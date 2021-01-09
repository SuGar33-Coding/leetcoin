import { Schema, Document, model } from "mongoose";

export interface WalletType {
	balance: number;
}

interface IWallet extends Document, WalletType {}

export const WalletSchema = new Schema({
	balance: { type: Number, required: true },
});

export const Wallet = model<IWallet>("Wallet", WalletSchema);
