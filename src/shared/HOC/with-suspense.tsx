import { ComponentType, Suspense } from 'react';
import { Route } from 'react-router-dom';
import ThreeDots from '../components/skeleton-loader/skeleton-loader';

export function withSuspense<P extends string | number | object>(WrappedComponent: ComponentType<P>) {
    return (props: P) => (

        <Suspense fallback={<ThreeDots />}>
            <Route>
                <WrappedComponent {...props} />
            </Route>
        </Suspense>
    );
}
