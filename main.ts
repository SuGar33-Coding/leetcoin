import { opine } from "./deps.ts";
import {
    thing
} from "./controllers/test.ts";

const app = opine();

// app.use(LogMiddleware).use(ErrorMiddleware);
app
  .get("/test", thing)
  .listen({ port: 5000 });
console.log(`server listening on http://localhost:5000`);
