import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { TicketsWithErrors } from '../pages/tickets/ticket-list';
import Layout from '../shared/layout/layout';
function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Layout>
                    <Route path="/tickets">
                        <TicketsWithErrors/>
                    </Route>
                </Layout>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
