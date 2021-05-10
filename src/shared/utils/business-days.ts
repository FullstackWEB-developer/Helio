import dayjs from 'dayjs';

const isBusinessDay = (date: dayjs.Dayjs) => {
    const workingWeekdays = [1, 2, 3, 4, 5];
    return workingWeekdays.includes(date.day());
}

const add = (date: Date, number: number) => {
    const numericDirection = number < 0 ? -1 : 1;
    let currentDay = dayjs(date).clone();
    let daysRemaining = Math.abs(number);

    while (daysRemaining > 0) {
        currentDay = currentDay.add(numericDirection, 'd');
        if (isBusinessDay(currentDay)) daysRemaining -= 1;
    }

    return currentDay.toDate();
}

const businessDays = {
    isBusinessDay,
    add
}

export default businessDays;
