import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { Wallet, IWallet } from "../models/Wallet";
import { HttpError } from "../types";
import bcrypt from "bcrypt";
import { Transaction, TransactionType } from "../models/Transaction";

/**
 * Changes and saves a wallet balance. Also logs the change in the Transaction log.
 * Throws error on negative balance.
 * @param wallet that contains the affected balance (receiver if TRANSFER)
 * @param amt that the balance will change (positive or negative)
 * @param type of the change
 * @param secondaryWallet second wallet involved in the change (sender if TRANSFER)
 */
const changeWalletBalance = async (
	wallet: IWallet,
	amt: number,
	type: "TRANSACTION" | "TRANSFER" | "PAYMENT",
	secondaryWallet?: IWallet
) => {
	let balance = parseFloat(wallet.balance.toString());

	if (balance + amt < 0) {
		throw new HttpError(400, "Wallet balance cannot be negative");
	}

	balance += amt;

	wallet.balance = balance;
	await wallet.save();

	// Perform other end of transfer if it's a transfer (subtract from sender)
	if (type === "TRANSFER" && secondaryWallet) {
		balance = parseFloat(secondaryWallet.balance.toString());
		if (balance - amt < 0) {
			throw new HttpError(
				400,
				"Secondary wallet balance cannot be negative"
			);
		}
		balance -= amt;
		secondaryWallet.balance = balance;
		await secondaryWallet.save();
	}

	/* Generate the Transaction for the Log */
	const transactionPayload: TransactionType = {
		type,
		amt,
		primaryWallet: wallet,
	};
	if (secondaryWallet) {
		transactionPayload.secondaryWallet = secondaryWallet;
	}
	Transaction.create(transactionPayload).catch((err) => {
		console.error(err);
	});
};

export default {
	getBalance: async (req: Request, res: Response, next: NextFunction) => {
		const name = req.query.name as string;
		const password = req.query.password as string;

		const user = await User.findOne({
			name,
		}).populate("wallet");

		if (!user) {
			const err = new HttpError(404, "User not found");
			return next(err);
		} else if (!("balance" in user.wallet)) {
			return next(
				new HttpError(
					400,
					"Could not find User's Wallet for some reason"
				)
			);
		}

		const isPasswordMatched = await bcrypt.compare(password, user.password);
		if (!isPasswordMatched) {
			return res.sendStatus(403);
		}

		const balance = user.wallet.balance;

		return res.status(200).send(balance.toString());
	},

	/**
	 * Add the amount to the user's wallet and return the new wallet
	 */
	makeTransaction: async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const name = req.query.name as string;
		const amt = parseFloat(req.query.amt as string);

		const user = await User.findOne({ name });

		if (!user) {
			return next(new HttpError(404, "User not found"));
		}

		const wallet = await Wallet.findById(user.wallet);

		if (!wallet) {
			return next(new HttpError(404, "Wallet wasn't found, somehow"));
		}

		try {
			await changeWalletBalance(wallet, amt, "TRANSACTION");
		} catch (error) {
			return next(error);
		}

		return res.status(200).send(wallet);
	},

	makeTransfer: async (req: Request, res: Response, next: NextFunction) => {
		const senderName = req.query.sender as string;
		const senderPassword = req.query.password as string;
		const receiverName = req.query.receiver as string;
		const amt = parseFloat(req.query.amt as string);

		const senderUser = await User.findOne({
			name: senderName,
		});

		if (!senderUser) {
			return next(new HttpError(404, "Sender not found"));
		}

		const isPasswordMatched = await bcrypt.compare(
			senderPassword,
			senderUser.password
		);
		if (!isPasswordMatched) {
			return res.sendStatus(403);
		}

		const receiverUser = await User.findOne({ name: receiverName });

		if (!receiverUser) {
			return next(new HttpError(404, "Receiver not found"));
		}

		const senderWallet = await Wallet.findById(senderUser.wallet);
		const receiverWallet = await Wallet.findById(receiverUser.wallet);

		if (!senderWallet || !receiverWallet) {
			return next(new Error("Error retrieving wallet"));
		}

		try {
			await changeWalletBalance(
				receiverWallet,
				amt,
				"TRANSFER",
				senderWallet
			);
		} catch (error) {
			return next(error);
		}

		return res.sendStatus(200);
	},

	makePayment: async (req: Request, res: Response, next: NextFunction) => {
		const name = req.query.name as string;
		const password = req.query.password as string;
		const amt = parseFloat(req.query.amt as string);
		const note = req.query.note;

		const user = await User.findOne({
			name,
		});

		if (!user) {
			return next(new HttpError(404, "User not found"));
		}

		const isPasswordMatched = await bcrypt.compare(password, user.password);
		if (!isPasswordMatched) {
			return res.sendStatus(403);
		}

		const wallet = await Wallet.findById(user.wallet);

		if (!wallet) {
			return next(new HttpError(404, "Error retrieving wallet"));
		}

		try {
			await changeWalletBalance(wallet, amt * -1, "PAYMENT");
		} catch (exception) {
			return next(exception);
		}

		return res.status(200).send({ newBalance: wallet.balance });
	},
};
