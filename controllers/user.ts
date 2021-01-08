import { User } from "../models/User.ts";
import { Wallet } from "../models/Wallet.ts";
import {
	Request,
	Response,
	ParamsDictionary,
	NextFunction,
	Model,
} from "../utils/deps.ts";

export default {
	getByName: async (
		req: Request<ParamsDictionary, any, any>,
		res: Response<any>,
		next: NextFunction
	) => {
		try {
			const user = await User.where({ name: req.params.name }).get();
			res.setStatus(200).send(user);
		} catch (error) {
			next(error);
		}
	},

	create: async (
		req: Request<ParamsDictionary, any, any>,
		res: Response<any>,
		next: NextFunction
	) => {
		const user = await User.create({
			name: req.query.name,
			password: req.query.password,
		});

		const wallet = await Wallet.create({
			balance: 0.0,
			userId: user._id as any,
		});

		user.walletId = wallet._id;
		await user.update();

		// TODO: error checking

		res.setStatus(200).send(user);
	},

	getBalance: async (
		req: Request<ParamsDictionary, any, any>,
		res: Response<any>,
		next: NextFunction
	) => {
		try {
			const users = (await User.where({
				name: req.query.name,
				password: req.query.password,
			}).get()) as Model[];
			const user = users.pop();

			const wallet = await User.getWallet(user as User);

			if (wallet) {
				res.setStatus(200).send(wallet.balance);
			} else {
				res.sendStatus(404);
			}
		} catch (exception) {
			console.error(exception);
		}
	},
};
