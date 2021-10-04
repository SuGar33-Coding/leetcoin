declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";
			MONGO_PASSWORD: string;
			MONGO_URI: string;
			TOKEN_SECRET: string;
			PORT?: string;
			ADMIN_PASSWORD: string;
		}
	}
}

export {};
