import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { Wallet } from "../models/Wallet";
import { HttpError } from "../types";
import bcrypt from "bcrypt";

export default {
	/** Return non-sensitive info about user */
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
		const name = req.query.name as string;
		const password = req.query.password as string;

		const wallet = await Wallet.create({
			balance: 0.0,
		});

		const hashedPassword = await bcrypt.hash(password, 10);

		try {
			const user = await User.create({
				name,
				password: hashedPassword,
				wallet: wallet._id,
			});
			return res.status(200).send(user);
		} catch (exception) {
			return next(exception);
		}
	},

	/** Get a list of all users in the db */
	query: async (req: Request, res: Response, next: NextFunction) => {
		const populateWallets = Boolean(req.query.populateWallets as string);

		let users;
		if (populateWallets) {
			users = await User.find({}).select("name").populate("wallet");
		} else {
			users = await User.find({}).select("name");
		}

		if (!users) {
			return next(
				new HttpError(404, "There are no users in the Database")
			);
		}

		return res.status(200).send(users);
	},
};
