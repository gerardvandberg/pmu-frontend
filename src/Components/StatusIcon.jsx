import React from 'react'
import { makeStyles, Tooltip } from '@material-ui/core'
import { red, yellow, green } from '@material-ui/core/colors'
import OkIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles({
    OkIcon: {
        color: green[500]
    },
    WarningIcon: {
        color: yellow[500]
    },
    SevereWarningIcon: {
        color: red[500]
    }
})
export default function StatusIcon(props) {
    const classes = useStyles();

    switch (props.status) {
        case "OK":
            return (
                <div>
                    <Tooltip title={props.Tooltip}>
                        <OkIcon className={classes.OkIcon} />
                    </Tooltip>
                </div>
            )
        case "WARN":
            return (
                <div>
                    <Tooltip title={props.Tooltip}>
                        <WarningIcon className={classes.WarningIcon} />
                    </Tooltip>
                </div>
            )

        default:
            return (
                <div>
                    <Tooltip title={props.Tooltip}>
                        <WarningIcon className={classes.SevereWarningIcon} />
                    </Tooltip>
                </div>
            )

    }

}
