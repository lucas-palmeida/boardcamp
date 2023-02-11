import { Router } from "express";
import { insertGame, listGames } from "../controllers/Games.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { gameSchema } from "../schemas/GameSchema.js";


const gamesRouter = Router();

gamesRouter.get('/games', listGames);
gamesRouter.post('/games', validateSchema(gameSchema), insertGame);

export default gamesRouter;