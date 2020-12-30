import { Database, opine } from "./utils/deps.ts";
import router from "./routes.ts";
import { User } from "./models/User.ts";

const app = opine();

/* DB */
const db = new Database(
  {
    dialect: "mongo",
    debug: false,
  },
  {
    uri: "mongodb://127.0.0.1:27017",
    database: "lc-test",
  }
);

db.link([User]);

db.sync({
  drop: true,
});

await User.create({
  name: "Testy McTestface"
});

console.log(`INFO: DB connected: ${await db.ping()}`);

/* Server */
const PORT = 5000;

// app.use(LogMiddleware).use(ErrorMiddleware);
app.use("/api", router).listen({ port: PORT });

console.log(`INFO: Server listening on http://localhost:${PORT}`);
