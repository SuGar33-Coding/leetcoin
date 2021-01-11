import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { Wallet } from "../models/Wallet";
import { HttpError } from "../types";

export default {
	getByName: async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findOne({ name: req.query.name as string });

		if (!user) {
			return next(new HttpError(404, "User not found"));
		}

		const response = {
			name: user.name,
		};

		return res.status(200).send(response);
	},

	create: async (req: Request, res: Response, next: NextFunction) => {
		const wallet = await Wallet.create({
			balance: 0.0,
		});

		try {
			const user = await User.create({
				name: req.query.name as string,
				password: req.query.password as string,
				wallet: wallet._id,
			});
			return res.status(200).send(user);
		} catch (exception) {
			return next(new Error(exception));
		}
	},

	getBalance: async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findOne({
			name: req.query.name as string,
			password: req.query.password as string,
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

		wallet.balance = parseFloat(wallet.balance.toString()) + parseFloat(req.query.amt as string);
		
		wallet = await wallet.save();

		return res.status(200).send(wallet);
	},
};
