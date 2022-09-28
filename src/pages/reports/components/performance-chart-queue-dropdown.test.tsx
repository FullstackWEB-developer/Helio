import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import PerformanceChartQueueDropdown from '@pages/reports/components/performance-chart-queue-dropdown';
import {QueueLabels} from '@pages/reports/components/performance-charts-graphic';
import i18n from '../../../i18nForTests';

describe("Performance Chart Queue Dropdown Tests", () => {
    let container: HTMLDivElement | null;
    beforeEach(async () => {
        await i18n.init();
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
        const queueLabels : QueueLabels[] = [
            {
                queueName: 'Queue 1',
                queueValue: 3
            },
            {
                queueName: 'Queue 2',
                queueValue: 4
            }
        ]
        const {asFragment} = render(<TestWrapper>
            <PerformanceChartQueueDropdown onQueuesSelected={() => {}} queueLabels={queueLabels} type='chat'/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

})
