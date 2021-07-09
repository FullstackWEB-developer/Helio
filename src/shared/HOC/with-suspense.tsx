import {ComponentType, Suspense} from 'react';
import Spinner from '@components/spinner/Spinner';

export function withSuspense<P extends string | number | object>(WrappedComponent: ComponentType<P>) {
    return (props: P) => (
        <Suspense fallback={<Spinner fullScreen />}>
            <WrappedComponent {...props} />
        </Suspense>
    );
}
