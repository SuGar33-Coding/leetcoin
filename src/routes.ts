import { Router } from "express";
import auth from "./controllers/auth";
import user from "./controllers/user";

const router = Router();

/** Auth */
router.get("/login", auth.login);

/** User */
router.get("/user", user.getByName);
router.post("/user", user.create);
router.get("/user/balance", user.getBalance);
router.post("/user/transaction", user.makeTransaction);
router.get("/users", user.query);

export default router;
