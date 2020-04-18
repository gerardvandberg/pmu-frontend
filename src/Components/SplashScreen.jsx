import React, { useEffect } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { Paper } from '@material-ui/core';
export default function SplashScreen(props) {
    useEffect(() => {
        loadStuff()
    })
    const history = useHistory();
    const delay = (ms) => new Promise(resolve => (setTimeout(resolve, ms)));
    const loadStuff = () => {
        delay(10000).then(history.push(props.landingPath));

    }
    return (
        <div>
            <Paper>
                LOADING....
            </Paper>
        </div>
    )
}
