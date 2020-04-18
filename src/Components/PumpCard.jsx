import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';


import StatusIcon from './StatusIcon';
const useStyles = makeStyles({
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
    }
});
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
    console.log(`date: ${getDate(date)} now:${getDate(now)}`)
    console.log((date - now) / oneDay);
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
    const { url, id } = props;
    const path = "/pump?pumpId="
    const [pump, setPump] = useState({});
    const [expectedDate, setExpectedDate] = useState(addDays(new Date, 50));
    useEffect(() => {
        fetchPump();
        fetchDate();
    }, [])
    const fetchPump = async () => {
        const fetchPump = await fetch(url + path + id);
        const res = await fetchPump.json();
        console.log(res);
        setPump(res);
    }
    const fetchDate = async () => {
        setExpectedDate(addDays(new Date(), 1 + ((props.id * 9237) % 89)));
    }
    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container direction="row" justify="space-between">
                    <Grid item>
                        <Typography gutterBottom variant="h5" component="h2">
                            {pump.name} ({pump.id})
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

                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary">
                    SHOW ON MAP
        </Button>
                <Button size="small" color="primary">
                    VIEW REPORTS
        </Button>
            </CardActions>
        </Card >
    );
}