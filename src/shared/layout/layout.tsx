import Header from './header';
import Navigation from './navigation';
import Footer from './footer';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { authenticationSelector } from '../store/app-user/appuser.selectors';
import { Redirect } from 'react-router';
interface LayoutProps {
    children: React.ReactNode
}
const Layout = (props: LayoutProps) => {
    const isLoggedIn = useSelector(authenticationSelector).isLoggedIn;
    if (!isLoggedIn) {
        return <Redirect to="/login" />
    }

    return (
        <Fragment>
            <Header></Header>
            <div className="flex flex-row h-full bg-primary text-primary">
                <div className="w-full md:w-auto">
                    <Navigation></Navigation>
                </div>
                <main className="flex flex-col">
                    <div className="flex flex-auto">
                        {props.children}
                    </div>
                </main>
            </div>
            <Footer></Footer>
        </Fragment>
    );
}

export default Layout;
