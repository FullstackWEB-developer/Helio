import Header from './header';
import Navigation from './navigation';
import Footer from './footer';
import React, {Fragment} from 'react';
import {useSelector} from 'react-redux';
import {authenticationSelector} from '../store/app-user/appuser.selectors';
import {Redirect} from 'react-router';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndContainer} from './dragndrop/dnd-container'
import StatusBar from './statusbar';
import './layout.scss';

interface LayoutProps {
    children: React.ReactNode
}

const Layout = (props: LayoutProps) => {
    const isLoggedIn = useSelector(authenticationSelector).isLoggedIn;
    if (!isLoggedIn) {
        return <Redirect to='/login'/>
    }

    return (
        <Fragment>
            <div>
                <DndProvider backend={HTML5Backend}>
                    <div className='flex flex-row h-screen'>
                        <div className='h-full'>
                            <Navigation/>
                        </div>
                        <div className='flex flex-col w-screen'>
                            <div>
                                <Header/>
                            </div>
                            <div className='flex flex-col w-full'>
                                <div className='flex flex-row layout-content w-full'>
                                    <div className='flex-auto overflow-y-auto'>
                                        <main className='flex flex-col h-full w-full'>
                                            <DndContainer propsChildren={props.children} className='flex flex-auto'/>
                                        </main>
                                    </div>
                                    <div className='flex justify-end'>
                                        <StatusBar/>
                                    </div>
                                </div>
                                <div>
                                    <Footer/>
                                </div>
                            </div>
                        </div>
                    </div>
                </DndProvider>
            </div>
        </Fragment>
    );
}

export default Layout;
