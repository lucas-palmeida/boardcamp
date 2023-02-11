import { Router } from "express";
import { listCustomers, getCustomerById, insertCustomer, updateCustomer } from "../controllers/Customers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { customerSchema } from "../schemas/CustomerSchema.js";

const customersRouter = Router();

customersRouter.get('/customers', listCustomers);
customersRouter.get('/customers/:id', getCustomerById);
customersRouter.post('/customers', validateSchema(customerSchema), insertCustomer);
customersRouter.put('/customers/:id', validateSchema(customerSchema), updateCustomer);

export default customersRouter;