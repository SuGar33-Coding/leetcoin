import { DataTypes, FieldProps, Model, Relationships } from "../utils/deps.ts";
import { User } from "./User.ts";

const balance: FieldProps = {
	type: DataTypes.DECIMAL,
	allowNull: false,
};

const userId: FieldProps = {
	unique: true,
};

export class Wallet extends Model {
	static table = "wallets";

	static timestamps = true;

	static fields = {
		_id: {
			primaryKey: true,
		},
		balance,
		userId,
	};

	static getUser(wallet: Wallet) {
		return User.find(wallet.userId as any);
	}
}
