const express = require('express')
const cors = require('cors')
const app = express()
const db = require('./db')
const Query = require(`./db`)

app.use(express.json())
app.use(cors())
app.use('/actions', require('./routes/user_actions'))
app.use('/user', require('./routes/user'))
app.use('/admin', require('./routes/admin'))

// app.use('/dishes', require('./routes/dishes'))
// app.use('/orders', require('./routes/orders'))



app.get('/vacations', async (req, res) => {
     
    try {
        let q = `SELECT * from vacations`
        let vacations = await Query(q)
        res.json(vacations)
    } catch (error) {
        res.sendStatus(500)
    }


})


app.listen(1000, () => console.log("runing on port 1000"))