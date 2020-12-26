import { opine } from "./deps.ts";
import {
    thing
} from "./controllers/test.ts";

const app = opine();
const port = 5000;

// app.use(LogMiddleware).use(ErrorMiddleware);
app
  .get("/test", thing)
  .listen({ port });
console.log(`server listening on http://localhost:${port}`);
