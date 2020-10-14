import React, { useState, useEffect } from 'react';
import { Input } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { useDispatch } from 'react-redux'
import jwt_decode from "jwt-decode";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux'



export default function Login({ history }) {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [error, seterror] = useState("")
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)


    useEffect(() => {
        (async () => {
            console.log(user)
            if (user.login === true) {
                history.push("/vacations")
            }
        })()
    }, [user])

    function exit(){
         dispatch({ type: "LOGOUT" })
         history.push("/login")
    }


    const handleSubmit = async e => {
        try {
            let res = await fetch("http://localhost:1000/actions/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            let data = await res.json()
            console.log(data)
            if (data.error) {
                seterror(data.msg)
            } else {
                localStorage.token = data.access_token
                let { id, role, fname } = jwt_decode(data.access_token)
                console.log(id, role, fname)
                localStorage.time = Date.now()
                dispatch({ type: "LOGIN", payload: { id, role, fname } })
                // setTimeout(function () { dispatch({ type: "LOGOUT" }) history.push("/login") }, 600000);
                setTimeout(function () {exit()},600000);
                history.push("/vacations")
            }
        } catch (err) {

        }
    }

    return (
        <div id="login">
            <AppBar>
                <Typography color="inherit" gutterBottom>
                    Welcome Back!
                </Typography>
            </AppBar>
            <div id="main">
                <span>{error}</span>
                <br></br>
                <Input placeholder="username" color="primary" onChange={e => setusername(e.target.value)} type="text" />
                <br></br>
                <Input placeholder="password" color="primary" onChange={e => setpassword(e.target.value)} type="password" />
                <br></br>
                <Button color="primary" onClick={handleSubmit}>log in</Button>
                <br></br>
            </div>
            <img id="mainPic" src="https://www.klicco.info/wp-content/uploads/2018/03/Depositphotos_54856269_m-2015.jpg"></img>
            <p>don't have an account yet? <Link to="/register" component={RouterLink}>Register</Link></p>
        </div>
    )
}


