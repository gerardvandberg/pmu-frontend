import { Button, Card, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, Snackbar, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { DateTimePicker } from "@material-ui/pickers";
import ReportFormMaterialPicker from 'Components/ReportFormMaterialPicker';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import { backendUrl } from 'params';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            minWwidth: '120',
            disabled: theme.palette.primary
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
    const { match } = props;

    const id = (match) ? match.params.id ?? 0 : 0;
    const timestamp = (match) ? match.params.time ?? 0 : 0;
    const filled = props.filled ?? false;
    const locked = id && timestamp;

    const classes = useStyles();
    useEffect(() => {
        if (locked) {
            fetchReport(timestamp);
        }
        fetchAllPumps();

    }, [])

    const [state, setState] = useState({ ...initialState, pumpId: props.pumpId ?? "-1" });
    const [pumps, setAllPumps] = useState([]);
    const [selected, updateSelected] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [failure, setFailure] = useState(false);
    const [notify, setNotify] = useState(false);

    const fetchReport = async (rid) => {

        const report = await fetch(`${backendUrl}getIntervention?falseId=${rid}`);
        const res = await report.json();
        setState({ ...res, materials: (res.materials) ? res.materials : [{ material: "", totalCost: "", units: "" }] })
        updateSelected(res.pumpId);
        loadOptions(res.pumpId);

    }
    const fetchPump = async (id) => {
        const pump = await fetch(`${backendUrl}/pump?pumpId=` + id);
        const res = await pump.json();
        return res;
    }
    const fetchAllPumps = async () => {
        const res = await fetch(`${backendUrl}/getAllIds`);
        const pList = await res.json();
        const pInfo = await Promise.all(pList.map(id => fetchPump(id)));
        setAllPumps(pInfo)
    }
    const [dropdowns, updateDropdowns] = useState({ problem: [], operation: [], cause: [] })
    const loadOptions = async (id) => {
        const res = await fetch(`${backendUrl}/getDropdownValue?pumpId=${id}`);
        const json = await res.json();
        updateDropdowns(json);
    }
    const handlechange = (e) => {

        setState({ ...state, [e.target.name]: e.target.value });
        if (e.target.name == "pumpId") {
            updateSelected(e.target.value);
            setState({ ...state, [e.target.name]: e.target.value, cause: "", operation: "", problem: "" })
            loadOptions(e.target.value);
        }
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
            const res = await fetch(`${backendUrl}/postIntervention`, requestOptions);
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
    const handleClose = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotify(false);

    };

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
            <Header title="Report" />
            <Card className={classes.root}>
                <Grid container direction="column" className={classes.root}>
                    <FormControl className={classes.formControl} disabled={locked}>
                        <InputLabel id="pump-label">Pump</InputLabel>
                        <Select name="pumpId" onChange={handlechange} label="pump-label" value={state.pumpId} disabled={locked}>
                            <MenuItem key={-1} value={-1} disabled>Select a Pump</MenuItem >
                            {pumps.map(({ id, name }) =>
                                <MenuItem key={id} value={id}>{`${id} - ${name}`}</MenuItem>
                            )}

                        </Select>
                    </FormControl>
                    {selected != 0 && <FormControl className={classes.formControl} disabled={locked}>
                        <InputLabel id="problem-label">Problem</InputLabel>
                        <Select name="problem" onChange={handlechange} label="pump-label" value={state.problem}>
                            <MenuItem key={-1} value={-1} disabled>Select the problem</MenuItem >
                            {dropdowns.problem.map((text, id) =>
                                <MenuItem key={id} value={text}>{text}</MenuItem>
                            )}

                        </Select>
                    </FormControl>}
                    {selected != 0 && <FormControl className={classes.formControl} disabled={locked}>
                        <InputLabel id="operation-label">Operation</InputLabel>
                        <Select name="operation" onChange={handlechange} label="pump-label" value={state.operation}>
                            <MenuItem key={-1} value={-1} disabled>How does the pump operate?</MenuItem >
                            {dropdowns.operation.map((text, id) =>
                                <MenuItem key={id} value={text}>{text}</MenuItem>
                            )}

                        </Select>
                    </FormControl>}
                    {selected != 0 && <FormControl className={classes.formControl} disabled={locked}>
                        <InputLabel id="cause-label">Cause</InputLabel>
                        <Select name="cause" onChange={handlechange} label="pump-label" value={state.cause}>
                            <MenuItem key={-1} value={-1} disabled>Select the most likely cause</MenuItem >
                            {dropdowns.cause.map((text, id) =>
                                <MenuItem key={id} value={text}>{text}</MenuItem>
                            )}

                        </Select>
                    </FormControl>}

                    <DateTimePicker
                        className={classes.root}
                        value={state.failureDate}
                        name="failureDate"
                        disabled={locked}
                        onChange={(date) => handleCustomChange("failureDate", date)}
                        label="Date of Failure"
                    />


                    <ReportFormMaterialPicker name="materials" mats={state.materials} onChange={handleMchanges} disabled={locked} />
                    <Grid className={classes.root} container justify="flex-end" >
                        {!locked && <Button className={classes.root} color="primary" onClick={submit}>
                            SUBMIT
                        </Button>}
                    </Grid>
                </Grid>
            </Card>
            {showSnack()}

        </div >

    )

}
