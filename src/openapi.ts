import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";

export const Doc: OpenAPIV3.Document = {
	openapi: "3.0.2",
	info: {
		title: "Leetcoin API",
		version: "1.0",
	},
	servers: [{ url: "http://localhost:3000/" }],
	components: {},
	tags: [
		{
			name: "auth",
			description: "Actions involving users and authentication",
		},
		{
			name: "fun",
			description: "Testing probably",
		},
	],
	paths: {
		"/user": {
			post: {
				tags: ["auth"],
				parameters: [
					{
						name: "name",
						in: "query",
						required: true,
						schema: {
							type: "string",
						},
					},
					{
						name: "password",
						in: "query",
						required: true,
						schema: {
							type: "string",
						},
					},
				],
				responses: {
					200: {
						description: "Nice",
					},
					400: {
						description:
							"There was an error, the user was not created",
					},
					404: {
						description: "Not found",
					},
				},
			},
		},
	},
};
