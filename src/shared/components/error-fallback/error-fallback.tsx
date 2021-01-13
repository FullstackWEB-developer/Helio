import React from "react";
import {useTranslation} from "react-i18next";

interface ErrorFallbackProps {
    error: Error,
    resetErrorBoundary?: any
}
const ErrorFallback = ({error}: ErrorFallbackProps) => {
    const {t} = useTranslation()
    return (
        <div>
            <p>{t('error.error_fallback')}</p>
            <pre>{error.message}</pre>
        </div>
    )
}

export default ErrorFallback;