import React, { useState } from 'react';
import { Input } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


export default function Register({history}) {
    const [fname, setfname] = useState("")
    const [lname, setlname] = useState("")
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [error, seterror] = useState("")


    const handleSubmit = async e => {
        try {
            let res = await fetch("http://localhost:1000/actions/register", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password, fname, lname })
            })
            let data = await res.json()
            console.log(data)
            if (data.error) {
                seterror(data.msg)
            } else {
                history.push("/login")
            }
        } catch (err) {

        }
    }




    return (
        <div id = "register">
        <AppBar>
            <Typography color="inherit" gutterBottom>
                    Welcome 
            </Typography>
        </AppBar>
        <div id = "main">
            <br></br>
        <span>{error}</span>
        <Input  placeholder = "first name" color = "primary" onChange={e => setfname(e.target.value)} type="text" />
        <br></br>
        <Input  placeholder = "last name" color = "primary" onChange={e => setlname(e.target.value)} type="text" />
        <br></br>
        <Input  placeholder = "username" color = "primary" onChange={e => setusername(e.target.value)} type="text" />
        <br></br>
        <Input placeholder = "password" color = "primary" onChange={e => setpassword(e.target.value)} type="password"/>
        <br></br>
        <Button color="primary" onClick={handleSubmit}>Register</Button>
        <br></br>
        </div>
        <img  id = "mainPic" src ="https://www.klicco.info/wp-content/uploads/2018/03/Depositphotos_54856269_m-2015.jpg"></img>
        <p>already have an account?  <Link to="/login" component={RouterLink}>Log in</Link></p>
    </div>

    )
}
