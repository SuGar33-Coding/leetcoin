import { opine } from "./utils/deps.ts";
import router from "./routes.ts";

const app = opine();
const PORT = 5000;

// app.use(LogMiddleware).use(ErrorMiddleware);
app
  .use("/api", router)
  .listen({ port: PORT });

console.log(`server listening on http://localhost:${PORT}`);
