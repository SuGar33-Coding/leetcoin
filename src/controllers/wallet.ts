import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { Wallet, IWallet } from "../models/Wallet";
import { HttpError } from "../types";
import bcrypt from "bcrypt";

/**
 * Changes and saves a wallet balance. Throws error on negative balance.
 * @param wallet that contains the affected balance
 * @param amt that the balance will change (positive or negative)
 */
const changeWalletBalance = (wallet: IWallet, amt: number): void => {
	let balance = parseFloat(wallet.balance.toString());

	if (balance + amt < 0) {
		throw new HttpError(400, "Wallet balance cannot be negative");
	}

	balance += amt;

	wallet.balance = balance;
	wallet.save();
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
		const user = await User.findOne({ name: req.query.name as string });

		if (!user) {
			return next(new HttpError(404, "User not found"));
		}

		let wallet = await Wallet.findById(user.wallet);

		if (!wallet) {
			return next(new HttpError(404, "Wallet wasn't found, somehow"));
		}

		wallet.balance =
			parseFloat(wallet.balance.toString()) +
			parseFloat(req.query.amt as string);

		wallet = await wallet.save();

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
			changeWalletBalance(senderWallet, amt * -1);
			changeWalletBalance(receiverWallet, amt);
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
			changeWalletBalance(wallet, amt * -1);
		} catch (exception) {
			return next(exception);
		}

		return res.status(200).send({ newBalance: wallet.balance });
	},
};
