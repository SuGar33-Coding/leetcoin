type error = {
	message: string;
};

type Gabe = () => Promise<{
	name: string;
	level: number;
	totalActions: number;
	actionTime: number;
	error?: error;
}>;

/* Fake database hit for yours truly */
export const getGabe: Gabe = async () => {
	return {
		name: "gabe",
		level: 1,
		totalActions: 69,
		actionTime: 3,
	};
};
