const getWindowCenter = () => {
    const { width, height } = getWindowDimensions();
    return { x: width/2, y: height/2 };
}

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString("en-US");
}

const utils = {
    getWindowCenter, getWindowDimensions, formatDate
}

export default utils;
