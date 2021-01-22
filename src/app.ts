import * as dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import router from "./routes";
import { Doc } from "./openapi";
import { HttpError } from "./types";

import mongoose from "mongoose";

import swaggerUI from "swagger-ui-express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

/* Get Express app */
const app = express();

/* Logger */
app.use(morgan("common"));

/* Set up DB middleware */
mongoose
	.connect(process.env.MONGO_URI as string, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch(console.log);

/* Add cors headers */
app.use(cors());

/* Body parser */
app.use(bodyParser.json());

/* Set up OpenAPI validator */
// app.use(
//     OpenApiValidator.middleware({
//         apiSpec: Doc,
//         validateRequests: true,
//     })
// );

/* Set SwaggerUI route */
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(Doc));

/* Set api routes */
app.use("/api", router);

/* Invalid request response */
app.use((req, res, next) => {
	const error = new HttpError(404, "Not found");
	next(error);
});

/* Error handler (requires next arg for Express to recognize it as the end chain) */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
	console.error(error.stack);
	const status = error.status || 500;
	res.status(status).send({
		error: {
			message: error.message,
			status: status,
		},
	});
});

/* Spin up server */
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
