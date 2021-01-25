
const getAge = (dob: string) => {
    const date = new Date(dob);
    const now = new Date();
    return now.getFullYear() - date.getFullYear();
}

const formatDob = (dob: string) => {
    const date = new Date(dob);
    return date.toLocaleDateString("en-US");
}

const utils = {
    getAge, formatDob
}

export default utils