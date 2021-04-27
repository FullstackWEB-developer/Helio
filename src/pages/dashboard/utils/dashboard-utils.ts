import {BasicStatistic} from '@pages/dashboard/models/basic-statistic.model';

export const shadeColor = (amount: number, color = "#151515") => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export const getPieChartColor = (item: BasicStatistic) => {
    return shadeColor(item.percentage * item.label.toString().length / 5);
}
