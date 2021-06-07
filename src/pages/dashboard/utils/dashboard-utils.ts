let colors: string[] = [];
export const getPieChartColor = (i: number) => {
    if (!colors || colors.length === 0) {
        DashboardColors();
    }
    return colors[i];
}

export const DashboardColors = (): string[] => {
    if (colors.length > 0) {
        return colors;
    }
    const style = getComputedStyle(document.body);
    colors.push(style.getPropertyValue('--chart-color-1'));
    colors.push(style.getPropertyValue('--chart-color-2'));
    colors.push(style.getPropertyValue('--chart-color-3'));
    colors.push(style.getPropertyValue('--chart-color-4'));
    colors.push(style.getPropertyValue('--chart-color-5'));
    colors.push(style.getPropertyValue('--chart-color-6'));
    colors.push(style.getPropertyValue('--chart-color-7'));
    colors.push(style.getPropertyValue('--chart-color-8'));
    colors.push(style.getPropertyValue('--chart-color-9'));
    colors.push(style.getPropertyValue('--chart-color-10'));
    colors.push(style.getPropertyValue('--chart-color-11'));
    return colors;
}
