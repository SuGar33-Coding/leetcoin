import { Schema, Document, model } from "mongoose";

export interface KeyType {
	key: string;
}

export interface IKey extends Document, KeyType {}

export const KeySchema = new Schema(
	{
		key: { type: Schema.Types.String, required: true },
	},
	{ timestamps: true }
);

export const Key = model<IKey>("Key", KeySchema);
