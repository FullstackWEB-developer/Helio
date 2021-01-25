export const getWindowCenter = () => {
    const { width, height } = getWindowDimensions();
    return { x: width/2, y: height/2 };
}

export const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}
