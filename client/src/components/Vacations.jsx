import React, { useEffect, useState } from 'react'
import Link from '@material-ui/core/Link';
import { useSelector } from 'react-redux'
import Vacation from './Vacation'
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { spacing } from '@material-ui/system';
import ClearIcon from '@material-ui/icons/Clear';
import { DialogTitle } from '@material-ui/core';




const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },

}));


export default function Vacations({ history }) {
    const [allVacations, setallVacations] = useState([])
    const [likesVacations, setlikesVacations] = useState([])
    const [unlikesVacations, setunlikesVacations] = useState([])
    const [description, setDescription] = useState("")
    const [start_date, setStart_date] = useState("")
    const [end_date, setEnd_date] = useState("")
    const user = useSelector(state => state.user)
    const [search, setSearch] = useState([])
    const classes = useStyles();

    useEffect(() => {

        if (user.login === false) {
            history.push('/login')
        } else {
            (async () => {

                console.log("vacation", user)
                let res = await fetch(`http://localhost:1000/actions/`, {
                    headers: { "Authorization": localStorage.token }
                })
                let data = await res.json()
                setallVacations(data)
                if (user.role === "user") {
                    let res1 = await fetch(`http://localhost:1000/user/${user.userid}`, {
                        headers: { "Authorization": localStorage.token }
                    })
                    let data1 = await res1.json()
                    setlikesVacations(data1)
                    setunlikesVacations(data.filter(compare(data1)))
                }
            })()
        }


    }, [user, search])

    const handaleSearch = async () => {
        try {
            let res = await fetch("http://localhost:1000/actions/search", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ description, start_date, end_date })
            })
            let data = await res.json()
            console.log(data)
            if (data.length === 0) {
                alert("There are no matching results for your search")
            }
            setSearch(data)

        } catch (err) {

        }
    }

    const handaleClear = async () => {
        setSearch([])
        setDescription("")
        setStart_date("")
        setEnd_date("")
    }



    function compare(otherArray) {
        console.log('called from compare')
        return function (current) {
            for (var i = 0; i < otherArray.length; i++) {
                if (current.id == otherArray[i].id) { return false }
            }
            return true
        }
    }


    function handaleLogOut() {
        user.login = false
        localStorage.removeItem("token")
        localStorage.removeItem("time")
        history.push('login')
    }

  


    return (
        <div id="vacations">

            <AppBar>
                <Grid container>
                    <Grid item xs={1}>
                        <Typography color="inherit" gutterBottom>
                            Welcome {user.fname}
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>

                    </Grid>
                    <Grid item xs={1} >
                        <Button color="inherit" onClick={handaleLogOut}>Logout
                            <ExitToAppIcon></ExitToAppIcon>
                        </Button>
                    </Grid>
                </Grid>
            </AppBar>
            <br></br>
            <br></br>
            <div id="search">
                <Input value={description} placeholder="description" color="primary" onChange={e => setDescription(e.target.value)} type="text" />
                <Input title="start date" value={start_date} placeholder="start_date" color="primary" onChange={e => setStart_date(e.target.value)} type="date" />
                <Input title ="end date" value={end_date} placeholder="end_date" color="primary" onChange={e => setEnd_date(e.target.value)} type="date" />
                <span id="clear">
                    <Button onClick={handaleSearch}><SearchIcon></SearchIcon></Button>
                    <Button onClick={handaleClear}><ClearIcon></ClearIcon></Button>
                </span>
            </div>
            {search.length === 0 ?

                (user.role === "admin" ?
                    (<>
                        <br></br>
                       
                        <Button>
                            <Link to="/add" component={RouterLink} >Add Vacation</Link>
                        </Button>
                        <Button>
                        <Link to="/reports" vacations={allVacations} component={RouterLink} >Reports</Link>
                        </Button>
                        <h5>Vacations list</h5>
                        <Grid container>
                            <Grid item xs={2}></Grid>
                            <Grid item xs={8}>
                                <Grid container spacing={2} >
                                    {allVacations.map(v => (<Grid item xs={6}>
                                        <Vacation update={setallVacations} key={v.id} vacation={v} vacations={allVacations} />
                                    </Grid>))}
                                </Grid>
                            </Grid>
                            <Grid item xs={2}></Grid>
                        </Grid>

                   


                    </>)

                    :

                    (<>
                        <br></br>
                        <br></br>
                        <h5>The vacations followed by you</h5>
                        <Grid container>
                            <Grid item xs={2}></Grid>
                            <Grid item xs={8}>
                                <Grid container spacing={2} >
                                    {likesVacations.map(v => (<Grid item xs={6}><Vacation updateLikes={setlikesVacations} updateUnLikes={setunlikesVacations} key={v.id} vacation={v} like={true} likesVacations={likesVacations} unlikesVacations={unlikesVacations} /></Grid>))}
                                </Grid>
                            </Grid>
                            <Grid item xs={2}></Grid>
                        </Grid>

                        <h5> The vacations that have not yet been followed by you</h5>
                        <Grid container>
                            <Grid item xs={2}></Grid>
                            <Grid item xs={8}>
                                <Grid container spacing={2} >
                                    {unlikesVacations.map(v => (<Grid item xs={6}><Vacation updateLikes={setlikesVacations} updateUnLikes={setunlikesVacations} key={v.id} vacation={v} like={false} likesVacations={likesVacations} unlikesVacations={unlikesVacations} /></Grid>))}
                                </Grid>
                            </Grid>
                            <Grid item xs={2}></Grid>
                        </Grid>

                    </>))

                :
                (<Grid container>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8}>
                        <Grid container spacing ={2}>

                            {search.map(v => (<Grid item xs = {6}> <Vacation key={v.id} vacation={v} /></Grid>))}
                        </Grid>
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>)

            }

        </div>
    )
}






