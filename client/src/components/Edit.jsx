import React, { useState, useEffect } from 'react'
import { Input } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import moment from 'moment';
import { useSelector } from 'react-redux'

export default function Edit({ history, match}) {
    const [description, setDescription] = useState("")
    const [destination, setDestination] = useState("")
    const [start_date, setStart_date] = useState("")
    const [end_date, setEnd_date] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const user = useSelector(state => state.user)

    useEffect(() => {
        if (user.login===false){
            history.push('/login')
        }
        else{

        (async () => {
            let res = await fetch("http://localhost:1000/actions/oneVacation/" + match.params.id)
            let data = await res.json()
            console.log(data)
            setDescription(data[0].description)
            setDestination(data[0].destination)
            setStart_date(moment(data[0].start_date).format('yyyy-MM-DD'))
            setEnd_date(moment(data[0].end_date).format('yyyy-MM-DD'))
            setPrice(data[0].price)
            setImage(data[0].image)
          
        })()
    }
    
    },[user])

    const handleSubmit = async e => {
        console.log (match)
       try {
           let res = await fetch("http://localhost:1000/admin/edit/"+match.params.id,{
               method:"PUT",
               headers:{"content-type":"application/json", "Authorization":localStorage.token},
               body: JSON.stringify({description, destination, start_date, end_date, price, image})
           })
           if(res.status ==200){
               history.push("/vacations")
           }
       } catch (err) {
             console.log(err)
       }
   }
   console.log(destination)

    return (
        <div>
            <div id="add">
                <div>
                    <h1>Add Vacation</h1>
                </div>
                <div id="main">
                    <Input  value = {destination} placeholder="destination" color="primary" onChange={e => setDestination(e.target.value)} type="text" />
                    <br></br>
                    <Input  value = {description} placeholder="description" color="primary" onChange={e => setDescription(e.target.value)} type="text" />
                    <br></br>
                    <Input value = {start_date} placeholder="start_date" color="primary" onChange={e => setStart_date(e.target.value)} type="date" />
                    <br></br>
                    <Input value = {end_date} placeholder="end_date" color="primary" onChange={e => setEnd_date(e.target.value)} type="date" />
                    <br></br>
                    <Input value = {price} placeholder="price" color="primary" onChange={e => setPrice(e.target.value)} type="text" />
                    <br></br>
                    <Input value = {image} placeholder="image" color="primary" onChange={e => setImage(e.target.value)} type="text" />
                    <br></br>
                    <Button color="primary" onClick={handleSubmit}>Submit</Button>
                    <br></br>
                </div>
                <Link to="/vacations" component={RouterLink}>Back</Link>
            </div>

        </div>
    )
}
