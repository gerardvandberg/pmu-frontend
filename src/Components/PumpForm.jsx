import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid, TextField } from '@material-ui/core';
import { BackendUrl, backendUrl } from 'params';

import StatusIcon from './StatusIcon';
import { Header } from 'Components';
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
    const { match } = props;
    const id = match.params.id;
    const url = backendUrl;
    const path = "/pump?pumpId="
    const [pump, setPump] = useState({});
    const fetchPump = async () => {
        const fetchPump = await fetch(url + path + id);
        const res = await fetchPump.json();

        setPump({ ...res, expectedFailureDate: addDays(new Date(), 89) });
    }
    useEffect(() => {
        fetchPump();

    }, []);


    const fieldForm = (f) => {
        const v = f.replace(/([A-Z])/g, " $1");
        return (v.charAt(0).toUpperCase() + v.slice(1));
    }
    const valForm = (v) => {
        if (v instanceof Date)
            return getDate(v);
        return v;
    }
    const genForm = () => {
        const fields = Object.keys(pump) ?? [];
        return (
            <React.Fragment>
                <Grid container justify="flex" spacing={2} alignItems="baseLine">
                    {fields.map((f) => (
                        pump[f] != null &&
                        <Grid item>  <TextField multiline label={fieldForm(f)} value={valForm(pump[f])} /> </Grid>
                    ))}
                </Grid>

            </React.Fragment >
        )
    };
    return (
        <div>
            <Header title={`Pump info - ${pump.name ?? ""}`} ></Header>
            <Card className={classes.root}>
                <CardContent>
                    {genForm()}

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
        </div>
    );
}