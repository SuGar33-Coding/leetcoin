import { NextFunction, Request, Response } from "express";
import { isCredentialsValid } from "../util/auth";
import { HttpError } from "../types";
import { Key } from "../models/Key";

export default {
	login: async (req: Request, res: Response, next: NextFunction) => {
		const name = req.query.name as string;
		const password = req.query.password as string;

		const isValid = await isCredentialsValid(name, password);

		return isValid ? res.sendStatus(200) : res.sendStatus(403);
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
