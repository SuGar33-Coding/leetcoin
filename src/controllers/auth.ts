import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { HttpError } from "../types";
import bcrypt from "bcrypt";
import { Key } from "../models/Key";

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

	createApiKey: async (req: Request, res: Response, next: NextFunction) => {
		const pw = req.query.password as string;

		// NOTE: this is some garbo auth but it works for now
		if (process.env.ADMIN_PASSWORD && pw !== process.env.ADMIN_PASSWORD) {
			return next(new HttpError(403, "Forbidden"));
		}

		// authed, now make the api key
		const key = Math.random().toString(12).substr(2, 16);

		const keyObj = await Key.create({
			key,
		});

		return res.status(200).send(keyObj);
	},
};
