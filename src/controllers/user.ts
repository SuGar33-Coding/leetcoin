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

	/**
	 *
	 * Get a list of all users in the db
	 */
	query: async (req: Request, res: Response, next: NextFunction) => {
		const users = await User.find({}).select("name");

		if (!users) {
			return next(
				new HttpError(404, "There are no users in the Database")
			);
		}

		return res.status(200).send(users);
	},
};
