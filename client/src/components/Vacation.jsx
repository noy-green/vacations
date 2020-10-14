import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { TabScrollButton } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import CreateIcon from '@material-ui/icons/Create';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    }
}));

export default function VacationCard({ vacation, update, like, history, vacations, likesVacations, unlikesVacations, updateLikes, updateUnLikes }) {
    const classes = useStyles();
    const user = useSelector(state => state.user)
    // const bull = <span className={classes.bullet}>•</span>;
    const [error, seterror] = useState("")
    const [expanded, setExpanded] = React.useState(false);
    const theme = useTheme();


    const handleDelete = async e => {
        console.log(vacation)
        try {
            let res = await fetch("http://localhost:1000/admin/" + vacation.id, {
                method: "DELETE",
                headers: { "content-type": "application/json", "Authorization": localStorage.token },

            })
            let data = await res.json()
            console.log(data)
            if (data.error) {
                seterror(data.msg)
            } else {
                let newVacations = [...vacations]
                newVacations = newVacations.filter(item => item.id !== vacation.id)
                update(newVacations)

            }
        } catch (err) {

        }
    }



    const handleUnlike = async e => {
        console.log(vacation)
        try {
            let res = await fetch("http://localhost:1000/user/" + user.userid, {
                method: "PUT",
                headers: { "content-type": "application/json", "Authorization": localStorage.token },
                body: JSON.stringify({ vacation_id: vacation.id })

            })
            let data = await res.json()
            console.log(data)
            if (data.error) {
                seterror(data.msg)
            } else {
                console.log(likesVacations)
                let newLikes = [...likesVacations]
                console.log("hii")
                console.log("new", newLikes)
                newLikes = newLikes.filter(item => item.id !== vacation.id)
                console.log("new", newLikes)
                updateLikes(newLikes)
                vacation.followers = vacation.followers - 1
                let newUnLikesVacations = [...unlikesVacations, vacation]
                console.log("newv", newUnLikesVacations)
                updateUnLikes(newUnLikesVacations)
                console.log(vacation.followers)

            }
        } catch (err) {

        }
    }


    const handlelike = async e => {
        console.log(vacation)
        try {
            let res = await fetch("http://localhost:1000/user/" + user.userid, {
                method: "POST",
                headers: { "content-type": "application/json", "Authorization": localStorage.token },
                body: JSON.stringify({ vacation_id: vacation.id })

            })
            let data = await res.json()
            console.log(data)
            if (data.error) {
                seterror(data.msg)
            } else {
                let newUnLikes = [...unlikesVacations]
                newUnLikes = newUnLikes.filter(item => item.id !== vacation.id)
                vacation.followers = vacation.followers + 1
                let newLikes = [...likesVacations, vacation]
                updateUnLikes(newUnLikes)
                updateLikes(newLikes)

            }
        } catch (err) {

        }
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card className={classes.root} >

            <Grid container>
                <Grid item>
                    <img className="imgVac" src={vacation.image}></img>
                </Grid>
                <Grid item>

                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {vacation.destination}
                        </Typography>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Followers {vacation.followers}
                        </Typography>
                        <Typography variant="body2" component="p">
                            Depart : {moment(vacation.start_date).format("DD/MM/YYYY")}
                            <br />
                           Return : {moment(vacation.end_date).format("DD/MM/YYYY")}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {vacation.price}$
                        </Typography>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <Typography color="textSecondary" gutterBottom>
                                {vacation.description}
                            </Typography>
                        </Collapse>



                    </CardContent>
                    {user.role === "admin" ?
                        <CardActions>
                            <Button size="small" onClick={handleDelete}><ClearIcon></ClearIcon></Button>
                            <Button size="small">
                                <Link to={'/edit/' + vacation.id} component={RouterLink} color="inherit" ><CreateIcon></CreateIcon></Link>
                            </Button>
                        </CardActions>
                        :

                        <CardActions>
                            {like === true ?
                                <Button size="small" onClick={handleUnlike}>UnLike</Button>
                                :
                                <Button size="small" onClick={handlelike}>Like</Button>
                            }
                        </CardActions>


                    }

                </Grid>
            </Grid>

        </Card >
    );
}

