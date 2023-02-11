import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers/indexRouters.js";

dotenv.config();

const server = express();

server.use(cors());

server.use(express.json());

server.use(router);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running in port: ${port}`));