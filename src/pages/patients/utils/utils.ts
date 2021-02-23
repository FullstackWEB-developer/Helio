import dayjs from "dayjs";

const getAge = (dob: string) => {
    const date = new Date(dob);
    const now = new Date();
    return now.getFullYear() - date.getFullYear();
}

const formatDob = (dob: string) => {
    const date = new Date(dob);
    return dayjs(date).format("MM/DD/YYYY");
}

const utils = {
    getAge, formatDob
}

export default utils
