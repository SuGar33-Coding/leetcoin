import { NextFunction, Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { HttpError } from "../types";

export default {
	query: async (req: Request, res: Response, next: NextFunction) => {
		const limit = parseFloat(req.query.limit as string);
		const typeFilter = req.query.type as string;

		const transAgg: any[] = [
			{
				$sort: {
					createdAt: -1,
				},
			},
			{
				$limit: limit,
			},
		];

		if (typeFilter) {
			transAgg.push({
				$match: {
					type: typeFilter,
				},
			});
		}

		const transactions = await Transaction.aggregate(transAgg).exec();

		if (!transactions) {
			return next(new HttpError(404, "No Transactions found"));
		}

		return res.status(200).send(transactions);
	},

	dayEarningsAggregate: async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const agg: any[] = [
			{
				$match: {
					type: "EARNINGS",
				},
			},
			{
				$group: {
					_id: {
						DATE: {
							$dateToString: {
								format: "%m-%d-%Y",
								date: "$createdAt",
							},
						},
						NOTE: "$note",
					},
					count: {
						$sum: 1,
					},
				},
			},
			{
				$group: {
					_id: "$_id.DATE",
					NOTE_GROUP: {
						$push: {
							NOTE: "$_id.NOTE",
							count: "$count",
						},
					},
				},
			},
			{
				$sort: {
					_id: 1,
				},
			},
		];

		const transactions = await Transaction.aggregate(agg).exec();

		return res.status(200).send(transactions);
	},
};
