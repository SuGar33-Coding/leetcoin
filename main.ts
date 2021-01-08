import {
  Database,
  MongoDBConnector,
  opine,
  opineCors,
} from "./utils/deps.ts";
import router from "./routes.ts";
import { User } from "./models/User.ts";
import { Wallet } from "./models/Wallet.ts";

const app = opine();

app.use(opineCors());

/* DB */
const connector = new MongoDBConnector({
  uri: "mongodb://127.0.0.1:27017",
  database: "lc-test",
});

const db = new Database(connector);

db.link([User, Wallet]);

db.sync({
  drop: true,
});

// Create some test data
const user = await User.create({
  name: "testy",
  password: "123",
});

const wallet = await Wallet.create({
	balance: 420.69,
	userId: user._id as any
});

user.walletId = wallet._id;
await user.update();

const ret = await Wallet.getUser(wallet);
console.log(ret);

console.log(`INFO: DB connected: ${await db.ping()}`);

/* Server */
const PORT = 5000;

// Simple log requests
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

app.use("/api", router).listen({ port: PORT });

console.log(`INFO: Server listening on http://localhost:${PORT}`);
