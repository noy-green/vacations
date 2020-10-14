import React, { useState, useEffect } from 'react'
import { Input } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { useSelector } from 'react-redux'

export default function Add({history}) {

    const [description, setDescription] = useState("")
    const [destination, setDestination] = useState("")
    const [start_date, setStart_date] = useState("")
    const [end_date, setEnd_date] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const user = useSelector(state => state.user)


    useEffect(() => {
        if(user.login===false){
            history.push('/login')
        }
    }, [user])


    const handleSubmit = async e => {
         console.log ("blah")
        try {
            let res = await fetch("http://localhost:1000/admin/addVacation",{
                method:"POST",
                headers:{"content-type":"application/json", "Authorization":localStorage.token},
                body: JSON.stringify({description, destination, start_date, end_date, price, image})
            })
            // let data = await res.json()
            // console.log(data)
            if(res.status ==200){
                history.push("/vacations")
            }
        } catch (err) {
              console.log(err)
        }
    }




    return (
        <div>
            <div id="add">
                <div>
                    <h1>Add Vacation</h1>
                </div>
                <div id="main">
                <Input placeholder="destination" color="primary" onChange={e => setDestination(e.target.value)} type="text" />
                    <br></br>
                    <Input placeholder="description" color="primary" onChange={e => setDescription(e.target.value)} type="text" />
                    <br></br>
                    <Input placeholder="start_date" color="primary" onChange={e => setStart_date(e.target.value)} type="date" />
                    <br></br>
                    <Input placeholder="end_date" color="primary" onChange={e => setEnd_date(e.target.value)} type="date" />
                    <br></br>
                    <Input placeholder="price" color="primary" onChange={e => setPrice(e.target.value)} type="text" />
                    <br></br>
                    <Input placeholder="image" color="primary" onChange={e => setImage(e.target.value)} type="text" />
                    <br></br>
                    <Button color="primary" onClick={handleSubmit}>Add</Button>
                    <br></br>
                </div>
                <Link to="/vacations" component={RouterLink}>Back</Link>
            </div>

        </div>
    )
}
