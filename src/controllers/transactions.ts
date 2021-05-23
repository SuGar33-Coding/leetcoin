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

	dayEarningsAggregate: async (req: Request, res: Response) => {
		const startDate = req.query.startDate as string;
		const endDate = req.query.endDate as string;

		const agg: any[] = [
			{
				$match: {
					type: "EARNINGS",
				},
			},
		];

		if (startDate) {
			agg.push({
				$match: {
					createdAt: { $gte: new Date(startDate) },
				},
			});
		}

		if (endDate) {
			agg.push({
				$match: {
					createdAt: { $lt: new Date(endDate) },
				},
			});
		}

		agg.push({
			$group: {
				_id: {
					date: {
						$dateToString: {
							format: "%m-%d-%Y",
							date: "$createdAt",
						},
					},
					note: "$note",
				},
				count: {
					$sum: 1,
				},
			},
		});

		agg.push({
			$group: {
				_id: "$_id.date",
				note_group: {
					$push: {
						note: "$_id.note",
						count: "$count",
					},
				},
			},
		});

		agg.push({
			$sort: {
				_id: 1,
			},
		});

		const transactions = await Transaction.aggregate(agg).exec();

		return res.status(200).send(transactions);
	},
};
