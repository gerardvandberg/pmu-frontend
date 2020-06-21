import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { backendUrl } from 'params';
import { Link } from 'react-router-dom';

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


export default function ReportCard(props) {
    const classes = useStyles();
    const report = props.Report;
    console.log(props)
    const dForm = (d) => d.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ")[0];
    return (

        <Card className={classes.root}>

            <CardContent>

                <Typography gutterBottom variant="h5" component="h2">
                    {dForm(new Date(report.failureDate))} - {report.cause} <Typography />

                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">

                </Typography>

            </CardContent>
            <CardActions>
                <Link to={`/report/${report.pumpId}/${report.falseId}`} style={{ textDecoration: 'none' }}  >
                    <Button size="small" color="primary">
                        MORE
                 </Button>
                </Link >
            </CardActions>
        </Card >
    );
}