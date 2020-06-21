import React, { useState, useEffect } from 'react'
import { Grid, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default function ReportFormMaterialPicker(props) {
    const classes = useStyles();
    const { mats, disabled } = props;


    const changeCallback = (materials) => {
        console.log(materials)
        props.onChange(materials);
    }
    const handlechange = (e, index) => {
        const m = mats.map((m, i) => ((i == index) ? { ...m, [e.target.name]: e.target.value } : m));

        changeCallback(m);
    }
    const addMat = () => {
        const m = [...mats, { material: "", totalCost: "", units: "" }]
        changeCallback(m);

    }
    const delMat = (e, i) => {
        const m = mats.filter((_, index) => i != index);
        changeCallback(m)

    }
    return (
        <div>
            <Grid container direction="column">
                {mats.map((mat, i) => (
                    <Grid key={i}>
                        <TextField
                            className={classes.root}
                            name="material"
                            disabled={disabled}
                            hintText="Material"
                            floatingLabelText="Material"
                            label="Material"
                            value={mat.material}
                            onChange={(e) => handlechange(e, i)}
                        />
                        <TextField
                            className={classes.root}
                            name="totalCost"
                            disabled={disabled}
                            hintText="Material total cost"
                            floatingLabelText="Total cost"
                            label="Total cost"
                            value={mat.totalCost}
                            onChange={(e) => handlechange(e, i)}
                        />
                        <TextField
                            className={classes.root}
                            name="units"
                            disabled={disabled}
                            hintText="Units"
                            floatingLabelText="Material"
                            label="Units"
                            value={mat.units}
                            onChange={(e) => handlechange(e, i)} />

                        {!disabled && <Button className={classes.root} onClick={(e) => delMat(e, i)}>Delete</Button>}

                    </Grid>
                ))}


                <Grid container justify="space-between">
                    {!disabled && <Button className={classes.root} color="primary" onClick={addMat}>Add Material</Button>}
                </Grid>
            </Grid>
        </div>
    )
}
