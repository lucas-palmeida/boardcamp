import dayjs from "dayjs";
import { db } from "../database/connection.js";

export async function listRentals(req, res) {
    try {
        const rentals = await db.query(`
            SELECT rentals.*, 
                json_build_object(
                    'id', customers.id,
                    'name', customers.name
                ) AS customer,
                json_build_object(
                    'id', games.id,
                    'name', games.name
                ) AS game
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
    const id = req.params.id;

    try {
        const getRental = await db.query('SELECT * FROM rentals WHERE id = $1', [id]);
        
        if(!getRental.rows[0]) return res.status(404).send("Não existe aluguel com o n° informado.");

        if(getRental.rows[0].returnDate !== null) return res.status(400).send("Aluguel já foi finalizado.");

        const getGame = await db.query('SELECT * FROM games WHERE id = $1', [getRental.rows[0].gameId]);

        const returnDate = dayjs(), diffDays = returnDate.diff(getRental.rows[0].rentDate, 'day') - getRental.rows[0].daysRented, delayFee = diffDays > 0 ? diffDays * getGame.rows[0].pricePerDay : 0;
        
        await db.query('UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3', [returnDate, delayFee, id]);

        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function deleteRental(req, res) {
    const id = req.params.id;
    
    try {
        const getRental = await db.query('SELECT * FROM rentals WHERE id = $1', [id]);

        if(!getRental.rows[0]) return res.status(404).send("Não existe aluguel com o n° informado.");

        if(getRental.rows[0].returnDate === null) return res.status(400).send("Aluguel não foi finalizado.");

        await db.query('DELETE FROM rentals WHERE id = $1', [id]);
        
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}