import { Router } from "express";
import { listRentals, insertRental, closeRental, deleteRental } from "../controllers/Rentals.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { rentalSchema } from "../schemas/RentalSchema.js";

const rentalRouter = Router();

rentalRouter.get('/rentals', listRentals);
rentalRouter.post('/rentals', validateSchema(rentalSchema), insertRental);
rentalRouter.post('/rentals/:id/return', closeRental);
rentalRouter.delete('/rentals/:id', deleteRental);

export default rentalRouter;