import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { HttpError } from "../types";
import bcrypt from "bcrypt";

export default {
	login: async (req: Request, res: Response, next: NextFunction) => {
		const name = req.query.name as string;
		const password = req.query.password as string;

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

		return res.sendStatus(200);
	},
};
