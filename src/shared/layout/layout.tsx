import Header from './header';
import Navigation from './navigation';
import Footer from './footer';
import React, {Fragment, useEffect, useRef} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndContainer} from './dragndrop/dnd-container'
import StatusBar from './statusbar';
import './layout.scss';
import Snackbar from '@components/snackbar/snackbar';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import {useHistory} from 'react-router-dom';
import utils from '@shared/utils/utils';
import Overlay from '@components/overlay/overlay';
import {useSelector} from 'react-redux';
import {selectGlobalLoading} from '@shared/store/app/app.selectors';

interface LayoutProps {
    children: React.ReactNode
}

const Layout = (props: LayoutProps) => {
    const headsetIconRef = useRef<HTMLDivElement>(null);
    const history = useHistory();
    useEffect(() => {
        if (!utils.isLoggedIn()) {
            history.push(`/login`);
        }
    })
    const isGlobalLoading = useSelector(selectGlobalLoading);
    return (
        <Fragment>
            <Overlay isActive={isGlobalLoading}>
            <div>
                <DndProvider backend={HTML5Backend}>
                    <DndContainer className='flex flex-auto' headsetIconRef={headsetIconRef}>
                        <div className='flex flex-row h-screen'>
                            <div className='h-full'>
                                <Navigation/>
                            </div>
                            <div className='flex flex-col w-screen'>
                                <div>
                                    <Header headsetIconRef={headsetIconRef}/>
                                </div>
                                <div className='flex flex-col w-full'>
                                    <div className='flex flex-row layout-content w-full'>
                                        <div className='flex-auto'>
                                            <main className='flex flex-col h-full w-full'>
                                                <div className='flex flex-auto h-full'>
                                                    {props.children}
                                                </div>
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
                        <Snackbar position={SnackbarPosition.TopRight}/>
                        <Snackbar position={SnackbarPosition.TopCenter}/>
                    </DndContainer>
                </DndProvider>
            </div>
            </Overlay>
        </Fragment>
    );
}

export default Layout;
