import Header from './header';
import Navigation from './navigation';
import Footer from './footer';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { authenticationSelector } from '../store/app-user/appuser.selectors';
import { Redirect } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndContainer } from './dragndrop/dnd-container'
interface LayoutProps {
    children: React.ReactNode
}

const Layout = (props: LayoutProps) => {
    const isLoggedIn = useSelector(authenticationSelector).isLoggedIn;
    if (!isLoggedIn) {
        return <Redirect to='/login' />
    }

    return (
        <Fragment>
            <div className='border-b'>
            <Header />
            </div>
            <div className='flex flex-row h-full bg-primary text-primary overflow-auto'>
                <div>
                    <Navigation />
                </div>
                <DndProvider backend={HTML5Backend}>
                    <main className='flex flex-col h-full w-full'>
                        <DndContainer propsChildren={props.children} className='flex flex-auto' />
                    </main>
                </DndProvider>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Layout;
