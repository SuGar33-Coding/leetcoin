import { Request, Response } from "express";
import { User } from "../models/User";

export default {
	login: async (req: Request, res: Response) => {
		const user = await User.findOne({
			name: req.query.name as string,
			password: req.query.password as string,
		});

		if (user) {
			res.sendStatus(200);
		} else {
			res.sendStatus(403);
		}
	},
};
