import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import gamesRouter from "./routers/GamesRoutes.js";

dotenv.config();

const server = express();

server.use(cors());

server.use(express.json());

server.use(gamesRouter);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running in port: ${port}`));