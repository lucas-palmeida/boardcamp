import { db } from "../database/connection.js";

export async function listGames(req, res) {
    try {
        const games = await db.query("SELECT * FROM games");
        return res.send(games.rows);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function insertGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;

    try {
        const gameExists = await db.query("SELECT * FROM games WHERE name = $1", [name]);
        
        if (gameExists.rows[0]) return res.status(409).send("O jogo informado já existe!");

        const result = await db.query('INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)', [name, image, stockTotal, pricePerDay]);
        console.log(result);
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}