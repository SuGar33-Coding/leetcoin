import { Database, opine, opineCors } from "./utils/deps.ts";
import router from "./routes.ts";
import { User } from "./models/User.ts";

const app = opine();

app.use(opineCors());

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
  name: "testy",
  password: "123"
});

console.log(`INFO: DB connected: ${await db.ping()}`);

/* Server */
const PORT = 5000;

// Simple log requests
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`)
  next();
});

app.use("/api", router).listen({ port: PORT });

console.log(`INFO: Server listening on http://localhost:${PORT}`);
