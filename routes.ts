import * as test from "./controllers/test.ts";
import { Router } from './utils/deps.ts';

const router = Router();

/** Test */
router.get("/test", test.get);

export default router;