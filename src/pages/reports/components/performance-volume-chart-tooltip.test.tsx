import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import PerformanceVolumeChartTooltip from '@pages/reports/components/performance-volume-chart-tooltip';

describe("Performance Volume Chart Tooltip Tests", () => {
    let container: HTMLDivElement | null;
      beforeEach(async () => {
        dayjs.extend(duration);
        dayjs.extend(utc);
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (container) {
            unmountComponentAtNode(container);
            container.remove();
            container = null;
        }
    });

    it("renders correctly", async () => {
        const {asFragment, findByText} = render(<TestWrapper>
            <PerformanceVolumeChartTooltip point={{
                serieId: 'Operator',
                y:4,
                x:3,
                id:'31',
                index:0,
                color:'',
                serieColor: 'blue',
                borderColor: '',
                data: {
                    x: 3,
                    y:4,
                    yFormatted:'4',
                    xFormatted: '3'
                }
            }} />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
        expect(findByText('Operator')).not.toBeNull();
        expect(findByText('blue')).not.toBeNull();
    });

})
