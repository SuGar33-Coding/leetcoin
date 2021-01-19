import { Document, model, Schema } from "mongoose";
import { WalletType } from "./Wallet";

export interface UserType {
	name: string;
	password: string;
	wallet: WalletType;
}

export interface IUser extends Document, UserType {}

export const UserSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
	},
	{ timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
