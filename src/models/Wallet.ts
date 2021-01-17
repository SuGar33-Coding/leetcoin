import { Schema, Document, model } from "mongoose";

export interface WalletType {
	balance: number;
}

export interface IWallet extends Document, WalletType {}

export const WalletSchema = new Schema({
	balance: { type: Schema.Types.Decimal128, required: true },
});

export const Wallet = model<IWallet>("Wallet", WalletSchema);
