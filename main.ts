import { opine } from "./utils/deps.ts";
import router from "./routes.ts";

const app = opine();
const PORT = 5000;

// Simple log requests
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`)
  next();
});

app.use("/api", router).listen({ port: PORT });

console.log(`server listening on http://localhost:${PORT}`);
