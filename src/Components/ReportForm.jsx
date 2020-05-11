import { Button, Card, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, Snackbar, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { DateTimePicker } from "@material-ui/pickers";
import ReportFormMaterialPicker from 'Components/ReportFormMaterialPicker';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from './Header';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
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

const initialState = {
    cause: "",
    costPerWorker: "1000",
    distanceTravelled: "100",
    failureDate: new Date(),
    from: "",
    id: "",
    interventionCode: "",
    interventionDate: new Date(),
    materials: [{ material: "", totalCost: "", units: "" }],
    operation: "",
    problem: "",
    pumpId: "",
    remarks: "",
    responseTime: "",
    to: "",
    type: "",
    workers: "10",
}
export default function ReportForm(props) {
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        fetchAllPumps();

    }, [])

    const [state, setState] = useState({ ...initialState, pumpId: props.pumpId ?? "-1" });

    const [pumps, setAllPumps] = useState([]);

    const fetchPump = async (id) => {
        const pump = await fetch("http://localhost:1453/pump?pumpId=" + id);
        const res = await pump.json();
        return res;
    }
    const fetchAllPumps = async () => {
        const res = await fetch("http://localhost:1453/getAllIds");
        const pList = await res.json();
        const pInfo = await Promise.all(pList.map(id => fetchPump(id)));
        setAllPumps(pInfo)
    }

    const handlechange = (e) => {

        setState({ ...state, [e.target.name]: e.target.value })
    }
    const handleMchanges = (m) => {
        console.log(m);
        setState({ ...state, materials: m })
    }
    const handleCustomChange = (name, value) => {
        setState({ ...state, [name]: value })

    }
    const submit = async () => {
        {
            const requestOptions = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(state)
            };
            console.log(state)
            const res = await fetch('http://localhost:1453/postIntervention', requestOptions);
            debugger;
            console.log(res);
            if (res.ok) {
                setSubmitted(true);
                setFailure(false);
            }
            else { setFailure(true); }
            setNotify(true);
        };
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotify(false);

    };
    const [submitted, setSubmitted] = useState(false);
    const [failure, setFailure] = useState(false);
    const [notify, setNotify] = useState(false);
    const showSnack = () => {
        if (submitted) {
            return (<Snackbar open={notify} autoHideDuration={6000} onClose={handleClose}>
                <Alert severity="success">Report Sent Succesfully</Alert>
            </Snackbar>
            )
        }
        if (failure) {
            return (<Snackbar autoHideDuration={6000} onClose={handleClose}>
                <Alert severity="error">Report could not be sent</Alert>
            </Snackbar>
            )
        }
    }





    return (

        <div>
            <Header title="Create a Report" />
            <Card className={classes.root}>
                <Grid container direction="column" className={classes.root}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="pump-label">Pump</InputLabel>
                        <Select name="pumpId" onChange={handlechange} label="pump-label" value={state.pumpId}>
                            <MenuItem key={-1} value={-1} disabled>Select a Pump</MenuItem >
                            {pumps.map(({ id, name }) =>
                                <MenuItem key={id} value={id}>{`${id} - ${name}`}</MenuItem>
                            )}

                        </Select>
                    </FormControl>
                    <TextField
                        className={classes.root}
                        name="cause"
                        hintText="Enter the cause of the incidence"
                        floatingLabelText="Cause"
                        label="Cause"
                        onChange={handlechange}
                    />
                    <Grid container justify="flex-start" >
                        <DateTimePicker
                            className={classes.root}
                            value={state.failureDate}
                            name="failureDate"
                            onChange={(date) => handleCustomChange("failureDate", date)}
                            label="Date of Failure"
                        />
                        <DateTimePicker
                            className={classes.root}
                            value={state.interventionDate}
                            name="interventionDate"
                            onChange={(date) => handleCustomChange("interventionDate", date)}
                            label="Date of Report"
                            showTodayButton
                        />
                    </Grid>
                    <ReportFormMaterialPicker name="materials" mats={state.materials} onChange={handleMchanges} />
                    <Grid className={classes.root} container justify="flex-end" >
                        <Button className={classes.root} color="primary" onClick={submit}>
                            SUBMIT
                        </Button>
                    </Grid>
                </Grid>
            </Card>
            {showSnack()}

        </div >

    )

}
