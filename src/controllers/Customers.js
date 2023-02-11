import { db } from '../database/connection.js';

export async function listCustomers(req, res) {
    try {
        const customers = await db.query('SELECT * FROM customers');
        return res.send(customers.rows);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function getCustomerById(req, res) {
    const id = req.params.id;

    try {
        const searchForCustomer = await db.query('SELECT * FROM customers WHERE id = $1', [id]);

        if(searchForCustomer.rows[0]) return res.send(searchForCustomer.rows[0]);

        return res.sendStatus(404);        
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function insertCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customerExists = await db.query("SELECT * FROM customers WHERE cpf = $1", [cpf]);
        
        if (customerExists.rows[0]) return res.status(409).send("O cliente informado já existe!");

        const result = await db.query('INSERT INTO customers (name, phone, "cpf", birthday) VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        console.log(result);
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function updateCustomer(req, res) {
    // const { name, phone, cpf, birthday } = req.body;
    // const id = req.params.id;

    // try {
        
    // } catch (error) {
    //     return res.status(500).send(error.message);
    // }
}