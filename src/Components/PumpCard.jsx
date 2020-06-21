import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { backendUrl } from 'params'

import StatusIcon from './StatusIcon';
import { Link } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            minWwidth: '120',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: '120',
    },
    selectEmpty: {
        marginTop: theme.spacing(1),
    },
}));
const oneDay = 60 * 60 * 24 * 1000;

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function getDate(date) {
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    return `${year}-${month}-${day}`
}
function getTimeDelta(date) {
    let now = new Date();

    return date - now;
}
function getStatus(expectedDate) {
    let delta = getTimeDelta(expectedDate)
    if (delta > oneDay * 60) return "OK";
    if (delta > oneDay * 30) return "WARN";
    return "SWARN";
}

export default function PumpCard(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const { id } = props;
    const path = "/pump?pumpId="
    const [pump, setPump] = useState({});
    const [expectedDate, setExpectedDate] = useState(new Date());
    useEffect(() => {
        fetchPump();
        fetchDate();
    }, [])
    const fetchPump = async () => {
        const fetchPump = await fetch(backendUrl + path + id);
        const res = await fetchPump.json();

        setPump(res);
    }
    const fetchDate = async () => {
        const f = await fetch(backendUrl + "getPredictedFailureDate?pumpId=" + id);
        const date = await f.json();
        setExpectedDate(new Date(date.estimatedDate));
    }
    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container direction="row" justify="space-between">
                    <Grid item>
                        <Typography gutterBottom variant="h5" component="h2">
                            {pump.name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <StatusIcon Tooltip={`Expected failure date: ${getDate(expectedDate)}`} status={getStatus(expectedDate)} />
                    </Grid>
                </Grid>
                <Typography variant="body2" color="textSecondary" component="p">
                    Location: {pump.location}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Expected failure date: {getDate(expectedDate)}

                </Typography>
            </CardContent>
            <CardActions>
                <Link to={`/map/${pump.id}`} style={{ textDecoration: 'none' }}  >
                    <Button size="small" color="primary">
                        SHOWN ON MAP
                 </Button>
                </Link >
                <Link to={`/reports/${pump.id}`} style={{ textDecoration: 'none' }}  >
                    <Button size="small" color="primary">
                        VIEW REPORTS
                 </Button>
                </Link >

            </CardActions>
        </Card >
    );
}