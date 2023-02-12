import dayjs from "dayjs";
import { db } from "../database/connection.js";

export async function listRentals(req, res) {
    try {
        const rentals = await db.query(`
            SELECT json_build_object(
                'id', rentals.id,
                'customerId', rentals."customerId",
                'gameId', rentals."gameId",
                'rentDate', rentals."rentDate",
                'daysRented', rentals."daysRented",
                'returnDate', rentals."returnDate",
                'originalPrice', rentals."originalPrice",
                'delayFee', rentals."delayFee",
                'customer', json_build_object(
                    'id', customers.id,
                    'name', customers.name
                ),
                'game', json_build_object(
                    'id', games.id,
                    'name', games.name
                )
            ) 
            FROM rentals 
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id`
        );

        return res.status(200).send(rentals.rows);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const getCustomer = await db.query("SELECT * FROM customers WHERE id = $1", [customerId]);
        
        if(!getCustomer.rows[0]) return res.status(400).send("Cliente não encontrado.");

        const getGame = await db.query("SELECT * FROM games WHERE id = $1", [gameId]);

        if(!getGame.rows[0]) return res.status(400).send("Jogo não encontrado.");

        const verifyGameRentals = await db.query('SELECT * FROM rentals WHERE "gameId" = $1',[gameId]);
        
        let outOfStock = 0;
        
        for(let i = 0; i < verifyGameRentals.rows.length; i++) {
            if(verifyGameRentals.rows[i].returnDate === null) {
                outOfStock += 1;
            }
        }

        if(outOfStock >= getGame.rows[0].stockTotal) return res.status(400).send("Não existe jogo disponível no estoque.");

        const rentDate = dayjs(), returnDate = null, originalPrice = daysRented * getGame.rows[0].pricePerDay, delayFee = null;

        await db.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function closeRental(req, res) {
    try {
        
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function deleteRental(req, res) {
    try {
        
    } catch (error) {
        return res.status(500).send(error.message);
    }
}