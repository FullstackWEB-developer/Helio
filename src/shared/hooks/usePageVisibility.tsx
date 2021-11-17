import React from 'react';
const getBrowserVisibilityProp =() => {
    if (typeof document.hidden !== "undefined") {
        return "visibilitychange"
        // @ts-ignore
    } else if (typeof document.msHidden !== "undefined") {
        return "msvisibilitychange"
        // @ts-ignore
    } else if (typeof document.webkitHidden !== "undefined") {
        return "webkitvisibilitychange"
    }
}

const getBrowserDocumentHiddenProp = () => {
    if (typeof document.hidden !== "undefined") {
        return "hidden"
        // @ts-ignore
    } else if (typeof document.msHidden !== "undefined") {
        return "msHidden"
        // @ts-ignore
    } else if (typeof document.webkitHidden !== "undefined") {
        return "webkitHidden"
    }
    return "hidden";
}

export function getIsDocumentHidden() {
    return !document[getBrowserDocumentHiddenProp()]
}
const usePageVisibility = () =>  {
    const [isVisible, setIsVisible] = React.useState(getIsDocumentHidden())
    const onVisibilityChange = () => setIsVisible(getIsDocumentHidden())

    React.useEffect(() => {
        const visibilityChange = getBrowserVisibilityProp()
        // @ts-ignore
        document.addEventListener(visibilityChange, onVisibilityChange, false)

        return () => {
            // @ts-ignore
            document.removeEventListener(visibilityChange, onVisibilityChange)
        }
    })
    return isVisible
}

export default usePageVisibility;
