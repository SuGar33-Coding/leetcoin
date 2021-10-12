import { User } from "../models/User";
import bcrypt from "bcrypt";
import { Key } from "../models/Key";

export const isCredentialsValid = async (
	username: string,
	password: string
) => {
	const user = await User.findOne({
		name: username,
	});

	if (!user) {
		return false;
	}

	const isPasswordMatched = await bcrypt.compare(password, user.password);
	return isPasswordMatched;
};

export const isKeyValid = async (key: string) => {
	const keyObj = await Key.findOne({
		key,
	});

	return !!keyObj;
};
