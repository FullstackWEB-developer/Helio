import Header from './header';
import Navigation from './navigation';
import Footer from './footer';
import { Fragment } from 'react';

interface LayoutProps {
    children: React.ReactNode
}

const Layout = (props: LayoutProps) => {
    return (
        <Fragment>
            <Header></Header>
            <div className="flex flex-row h-full">
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