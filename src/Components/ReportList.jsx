import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import { ReportCard } from '.';
import { generatePath } from 'react-router-dom';
import Header from './Header';
import { backendUrl } from 'params';
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

export default function ReportList(props) {
    const { url, match } = props;
    const id = match.params.id;
    const [spacing, setSpacing] = React.useState(2);
    const [Reports, setReports] = React.useState([]);
    const classes = useStyles();
    useEffect(() => {
        fetchReports();
    }, [])

    const fetchReports = async () => {
        const f = await fetch(`${backendUrl}/getInterventions?pumpId=${id}`);
        const res = await f.json();
        setReports(res.sort((a, b) => (a.failureDate < b.failureDate) ? 1 : a.failureDate > b.failureDate ? -1 : 0));
    }
    const handleChange = (event) => {
        setSpacing(Number(event.target.value));
    };

    return (
        <React.Fragment>
            <Header title="Reports" />
            <Grid container className={classes.root} spacing={2} >
                <Grid item xs={12}>
                    <Grid container justify="flex-start" spacing={spacing} direction="column">
                        {Reports.map((value, index) => (
                            <Grid key={index} item xs>
                                <ReportCard className="reportCard" Report={value} id={index} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

            </Grid>
        </React.Fragment>
    );
}