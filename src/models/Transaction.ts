import { Document, model, Schema } from "mongoose";
import { WalletType } from "./Wallet";

export interface TransactionType {
	type: "TRANSACTION" | "TRANSFER" | "PAYMENT";
	amt: number;
	note?: string;
	primaryWallet: WalletType;
	secondaryWallet?: WalletType;
}

export interface ITransaction extends Document, TransactionType {}

export const TransactionScheme = new Schema(
	{
		type: {
			type: String,
			enum: ["TRANSACTION", "TRANSFER", "PAYMENT"],
			required: true,
		},
		amt: { type: Schema.Types.Decimal128, required: true },
		note: { type: String, required: false },
		primaryWallet: {
			type: Schema.Types.ObjectId,
			ref: "Wallet",
			required: true,
		},
		secondaryWallet: {
			type: Schema.Types.ObjectId,
			ref: "Wallet",
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

export const Transaction = model<ITransaction>(
	"Transaction",
	TransactionScheme
);
