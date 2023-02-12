import { Router } from "express";
import gamesRouter from "./GamesRoutes.js";
import customersRouter from "./CustomersRoutes.js";
import rentalRouter from "./RentalsRoutes.js";

const router = Router();

router.use(gamesRouter);
router.use(customersRouter);
router.use(rentalRouter);

export default router;