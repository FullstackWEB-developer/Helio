import React from "react";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallback from "../components/error-fallback/error-fallback";
import Logger from '../services/logger';

const withErrorLogging = <P extends object>(Component: React.ComponentType<P>) => {
    const logger = new Logger();
    const errorHandler = (error: Error, info: {componentStack: string}) => {
        logger.error(error.message, info)
    }

    const ComponentWithErrorBoundaries = (props: P) => {
        return(
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={errorHandler}
            >
                <Component {...props}/>
            </ErrorBoundary>);
    }

    return ComponentWithErrorBoundaries;
}

export default withErrorLogging;