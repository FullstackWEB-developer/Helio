import React from 'react';
import {Switch, Route, BrowserRouter, Link} from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import Tickets from '../pages/tickets/ticket-list';
import './app.css';

function App() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

  return (
      <BrowserRouter>
          <div className={"row"}>
              <div className={"col-4"}>
                  <button onClick={() => changeLanguage('en')}>EN</button>
                  <button onClick={() => changeLanguage('es')}>ES</button>
                  <h1>{t('title')}</h1>
                  <h2>{t('description.part1')}</h2>
                  <p>{t('description.part2')}</p>
              </div>
          </div>
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
