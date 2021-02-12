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
const dateToString =(date: Date, format: string) =>  {
    const z = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    };
    format = format.replace(/(M+|d+|h+|m+|s+)/g, function(v: string) {
        // @ts-ignore
        return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
    });

    return format.replace(/(y+)/g, function(v) {
        return date.getFullYear().toString().slice(-v.length)
    });
}


const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString("en-US");
}


const addDays = (date: Date, days: number) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()+days);
}

const utils = {
    getWindowCenter, getWindowDimensions, formatDate, dateToString, addDays
}



export default utils;
