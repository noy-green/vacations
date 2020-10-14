const router = require('express').Router()
const { verifyUser } = require('../verify')
const Query = require(`../db`)

router.get('/:id', verifyUser, async (req, res) => {
    console.log("id")
    if (req.params.id) {
        console.log(req.params.id)
        try {
            let q = `SELECT users.id, vacations.id, vacations.description, vacations.destination, vacations.start_date, vacations.end_date, vacations.price, vacations.image, vacations.followers
        from followers inner join users on followers.user_id = users.id inner join 
        vacations on vacations.id = followers.vacation_id
        where followers.user_id = ?`
            let FollowesByUser = await Query(q, [req.params.id])
            res.json(FollowesByUser)
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }


})



router.post('/:id', verifyUser, async (req, res) => {
    const { vacation_id } = req.body
    console.log(vacation_id, +req.params.id)
    if (vacation_id && req.params.id) {
        
        try {
            let q = 'insert into followers (user_id, vacation_id) values("?","?")'
            await Query(q,[+req.params.id, vacation_id])
            // res.sendStatus(200)
            q = 'update vacations set followers = followers + 1 where id = ?'
            let vacations = await Query(q,[vacation_id])
            res.status(200).json({ error: false, msg: "seccessful" })
        }
        catch (error) {
            res.sendStatus(500)
        }

    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})


router.put('/:id', verifyUser, async (req, res) => {
    const { vacation_id } = req.body
    console.log(vacation_id, +req.params.id)
    if (vacation_id && req.params.id) {
        
        try {
            let q = 'delete from followers where  user_id =? and vacation_id = ?'
            await Query(q,[+req.params.id, vacation_id])
            q = 'update vacations set followers = followers -1 where id = ?'
            let vacations = await Query(q,[vacation_id])
            res.status(200).json({ error: false, msg: "seccessful" })
        }
        catch (error) {
            res.sendStatus(500)
        }

    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})


// router.get('search', async (req, res) => {
//     const { description, start_date, end_date } = req.body
    
//     if (description && start_date && end_date ) {
//         try {
//             let q = 'SELECT * from vacations where description LIKE %"?"% AND start_date = "?" AND end_date = "?"' 
//             let search = await Query(q, [description, start_date, end_date ])
//             res.json(search)
//         } catch (error) {
//             res.sendStatus(500)
//         }
//     } else {
//         res.status(400).json({ error: true, msg: "missing some info" })
//     }


// })







module.exports = router

