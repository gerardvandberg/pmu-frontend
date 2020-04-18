import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import { PumpCard } from '.';
import { generatePath } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing(2),
    },
    PumpCard: {

    }
}));

export default function PumpList(props) {
    const url = props.url;
    const path = "/getAllIds"
    const [pumpIds, updatePumpIds] = useState([1]);
    const [list, updateList] = useState([]);
    const [spacing, setSpacing] = React.useState(2);
    const classes = useStyles();
    useEffect(() => {
        fetchPumpIds();
    }, [])

    const fetchPumpIds = async () => {
        const fetchPump = await fetch("http://localhost:1453/getAllIds");
        const res = await fetchPump.json();
        console.log(res);
        updatePumpIds(res);
    }

    const handleChange = (event) => {
        setSpacing(Number(event.target.value));
    };

    return (
        <Grid container className={classes.root} spacing={2} >
            <Grid item xs={12}>
                <Grid container justify="flex-start" spacing={spacing} direction="column">
                    {pumpIds.map((value) => (
                        <Grid key={value} item xs>
                            <PumpCard className="pumpCard" url={url} id={value} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>

        </Grid>
    );
}