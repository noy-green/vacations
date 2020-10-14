const router = require('express').Router()
const { verifyUser, verifyAdmin } = require('../verify')
const Query = require(`../db`)
const { json } = require('express')


router.post('/addVacation',async (req, res) => {
    console.log(req.body)
    
    const { description, destination, start_date, end_date, price, image} = req.body
    if (description && destination && start_date && end_date && price && image) {
        
        try {
            let q = 'insert into vacations (description, destination, start_date, end_date, price, image) values(?,?,?,?,?,?)'
            await Query(q,[description, destination, start_date, end_date, price, image])
            res.sendStatus(200)
        }
        catch (error) {
            res.sendStatus(500)
        }

    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})


router.put('/edit/:id', verifyAdmin, async (req, res) => {
    console.log(req.body)
    const { description, destination, start_date, end_date, price, image} = req.body
    
    if (description && destination && start_date && end_date && price && image && req.params.id) {
        
        try {
            let q = `UPDATE vacations SET  description = ?, destination = ?, start_date = ? , end_date = ?, price = ?, image = ? where id = ?`
            await Query(q,[description, destination, start_date, end_date, price, image, req.params.id])
            res.status(200).json({ error: false, msg: "the vacation was updated" })
        }
        catch (error) {
            res.sendStatus(500)
        }

    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})


router.delete('/:id', verifyAdmin, async (req, res) => {
    
    if (req.params.id) {
        
        try {
            let q = `delete from followers where vacation_id = ?` 
            await Query(q,[+req.params.id])
            q = `delete from vacations where id = ?` 
            await Query(q,[+req.params.id])

            res.status(200).json({ error: false, msg: "the vacation was deleted" })
        }
        catch (error) {
            res.sendStatus(500)
        }

    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})








module.exports = router