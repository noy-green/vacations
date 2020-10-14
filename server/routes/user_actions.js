const router = require('express').Router()
const Query = require(`../db`)
const { genSaltSync, hashSync, compareSync } = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { verifyUser } = require('../verify')


router.post('/register', async (req, res) => {
    console.log("register")
    const { fname, lname, username, password } = req.body
    // check body validity
    if (fname && lname && username && password) {
        try {
            let q = `select * from users where username = ?`
            let unswer = await Query(q, [username])
            console.log(unswer)
            if (unswer.length === 0) {
                console.log(true)
                const salt = genSaltSync(10)
                const hash = hashSync(password, salt)
                try {
                    let q = `INSERT INTO users(fname, lname, username, password)
                VALUES(?, ?, ?, ?)`
                    await Query(q, [fname, lname, username, hash])
                    res.status(201).json({ error: false, msg: "user regisred successfully" })
                }
                catch (error) {
                    res.sendStatus(500)
                }
            }
            else {
                res.status(400).json({ error: true, msg: "the username is already taken" })
            }
        }
        catch (error) {
            res.sendStatus(500)
        }
    }
    else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})


router.post("/login", async (req, res) => {
    const { username, password } = req.body
    console.log("login")
    console.log(username, password)

    if (username && password) {
        try {
            let q = `select * from users where username = ?`
            let unswer = await Query(q, [username])
            console.log(unswer)
            if (unswer.length === 0) {
                res.status(400).json({ error: true, msg: "the username is not exist" })
            }
            else {
                if (compareSync(password, unswer[0].password)) {
                    let access_token = jwt.sign({ id: unswer[0].id, fname: unswer[0].fname, role: unswer[0].role }, "BlAh", {
                        expiresIn: "10m"
                    })

                    res.status(201).json({ error: false, msg: "user login successfully", access_token })
                }
                else {
                    res.status(401).json({ error: true, msg: "wrong password" })
                }
            }
        } catch (error) {
            res.sendStatus(500)
        }

    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }



})


router.get('/', async (req, res) => {

    try {
        let q = `SELECT * from vacations`
        let users = await Query(q)
        res.json(users)
    } catch (error) {
        res.sendStatus(500)
    }


})

router.get('/oneVacation/:id', async (req, res) => {

    try {
        let q = `SELECT * from vacations where id = ?`
        let oneVacation = await Query(q, [+req.params.id])
        res.json(oneVacation)
    } catch (error) {
        res.sendStatus(500)
    }


})


router.post('/search', async (req, res) => {
    console.log("searchh")

    const { description, start_date, end_date } = req.body
    console.log("searchh", start_date, end_date)

    if (description && start_date && end_date) {
        try {
            let q = `SELECT * from vacations where description LIKE "%${description}%" AND start_date = ? AND end_date = ?`
            let search = await Query(q, [start_date, end_date])
            res.json(search)
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }


})




module.exports = router