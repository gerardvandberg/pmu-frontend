import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from 'react-router-dom';
import { SplashScreen, Map, Header, PumpList, PumpForm } from "./Components/"
import { Fab, Tooltip, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ReportForm from 'Components/ReportForm';
import ReportList from 'Components/ReportList';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';



const useStyles = makeStyles();
function App() {


  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>

      <React.Fragment>

        <Router>
          <Switch>
            <Route path="/" exact>
              <SplashScreen landingPath="/list" />
            </Route >
            <Route path="/list">
              <Header title="Pump List" />
              <PumpList url="http://localhost:1453" />
            >
            <Tooltip title="Create Report">
                <Link to="/createReport">
                  <Fab color="primary" aria-label="add" style={{
                    margin: 0,
                    top: 'auto',
                    right: 40,
                    bottom: 20,
                    left: 'auto',
                    position: 'fixed',
                  }}>

                    <AddIcon />
                  </Fab>
                </Link>
              </Tooltip>

            </Route>
            <Route path="/createReport" >
              <ReportForm />
            </Route>
            <Route path="/pump/:id" render={(props) => <PumpForm {...props} url="http://localhost:1453" />} />
            <Route path="/reports/:id" render={(props) => <ReportList {...props} url="http://localhost:1453" />} />
          </Switch>

        </Router>
      </React.Fragment >
    </MuiPickersUtilsProvider >
  );
}

export default App;
