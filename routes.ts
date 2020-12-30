import test from "./controllers/test.ts";
import user from "./controllers/user.ts";
import { Router } from './utils/deps.ts';

const router = Router();

/** Test */
router.get("/test", test.get);

/** User */
router.get("/user/:name", user.getByName);

export default router;