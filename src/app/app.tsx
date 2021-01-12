import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Tickets from '../pages/tickets/ticket-list';
import Layout from '../shared/layout/layout';
function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Layout>
                    <Route path="/tickets">
                        <Tickets />
                    </Route>
                </Layout>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
