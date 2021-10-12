import { Router } from "express";
import auth from "./controllers/auth";
import transactions from "./controllers/transactions";
import user from "./controllers/user";
import wallet from "./controllers/wallet";

const router = Router();

/** Auth */
router.get("/login", auth.login);
router.get("/key", auth.createApiKey);

/** User */
router.get("/user", user.getByName);
router.post("/user", user.create);
router.put("/user/tgId", user.addTelegramId);
router.get("/users", user.query);

/** Wallet */
router.get("/wallet/balance", wallet.getBalance);
// router.post("/wallet/transaction", wallet.makeTransaction);
router.post("/wallet/earnings", wallet.makeEarnings);
router.post("/wallet/transfer", wallet.makeTransfer);
router.post("/wallet/payment", wallet.makePayment);

/** Transactions */
router.get("/transactions", transactions.query);
router.get("/transactions/earnings/day", transactions.dayEarningsAggregate);

export default router;
