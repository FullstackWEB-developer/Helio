import {ComponentType, Suspense} from 'react';
import {Route} from "react-router-dom";
import ThreeDots from "../components/skeleton-loader/skeleton-loader";

/**
 * Wraps the provide component in a `Suspense`, with the provided fallback.
 * @example
 * const SomeScreen = withSuspense(React.lazy(() => import("path/to/some/screen")));
 */
export function withSuspense<P extends string | number | object>(WrappedComponent: ComponentType<P>) {
    return (props : P) =>  (

        <Suspense fallback={<ThreeDots/>}>
            <Route>
                <WrappedComponent {...props} />
            </Route>
        </Suspense>
    );
}