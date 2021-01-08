import { DataTypes, FieldProps, Model, Relationships } from "../utils/deps.ts";
import { Wallet } from "./Wallet.ts";

const name: FieldProps = {
	type: DataTypes.STRING,
	allowNull: false,
	unique: true,
};

const password: FieldProps = {
	type: DataTypes.STRING,
	allowNull: false,
};

const walletId: FieldProps = {
	unique: true,
};

export class User extends Model {
	static table = "users";

	static timestamps = true;

	static fields = {
		_id: {
			primaryKey: true,
		},
		name,
		password,
		walletId,
	};

	static getWallet(user: User) {
		return Wallet.find(user.walletId as any);
	}
}
