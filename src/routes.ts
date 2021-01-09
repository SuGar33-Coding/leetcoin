import { Router } from "express";
import auth from "./controllers/auth";
import user from "./controllers/user";

const router = Router();

/** Auth */
router.get("/login", auth.login);

/** User */
router.post("/user", user.create);
router.get("/user/balance", user.getBalance);

export default router;
