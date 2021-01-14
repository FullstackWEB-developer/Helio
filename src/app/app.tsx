import React, {Suspense} from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import {lazily} from "react-lazily";
import FallbackLoader from '../shared/components/skeleton-loader/skeleton-loader';
import Layout from '../shared/layout/layout';

const { TicketsWithErrors } = lazily(() => import('../pages/tickets/ticket-list'))

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Layout>
                    <Suspense fallback={<FallbackLoader />}>
                        <Route path="/tickets">
                            <TicketsWithErrors/>
                        </Route>
                    </Suspense>
                </Layout>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
