import { Router } from "express";
import gamesRouter from "./GamesRoutes.js";
import customersRouter from "./CustomersRoutes.js";

const router = Router();

router.use(gamesRouter);
router.use(customersRouter);

export default router;