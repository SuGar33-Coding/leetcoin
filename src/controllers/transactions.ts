import { NextFunction, Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { HttpError } from "../types";

export default {
	query: async (req: Request, res: Response, next: NextFunction) => {
		const limit = parseFloat(req.query.limit as string);

		const transactions = await Transaction.aggregate([
			{
				$sort: {
					createdAt: -1,
				},
			},
			{
				$limit: limit,
			},
		]).exec();

		if (!transactions) {
			return next(new HttpError(404, "No Transactions found"));
		}

		return res.status(200).send(transactions);
	},
};
