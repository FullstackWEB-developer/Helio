import React from 'react';
import {Switch, Route, BrowserRouter, Link} from 'react-router-dom'
import Tickets from '../pages/tickets/ticket-list';
import './app.css';

function App() {
  return (
      <BrowserRouter>
          <div className={"row"}>
              <div className={"col-2"}>
                  <nav>
                      <ul>
                          <li>
                              <Link to="/">Home</Link>
                          </li>
                          <li>
                              <Link to="/tickets">Tickets</Link>
                          </li>
                      </ul>
                  </nav>
              </div>
              <div className={"col-10"}>
                  <Switch>
                      <Route path="/tickets">
                          <Tickets />
                      </Route>
                  </Switch>
              </div>
          </div>

      </BrowserRouter>
  );
}

export default App;
