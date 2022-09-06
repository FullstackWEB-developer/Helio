import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ReportResponsiveLineCustomTick from '@pages/reports/components/report-responsive-line-custom-tick';

describe("Report Responsive Line Custom Tick Test", () => {
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
        const {asFragment} = render(<TestWrapper>
            <ReportResponsiveLineCustomTick
                tick={{
                    value: '9:00 AM'
                }}
                isTime={true}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders time if isTime == true", async () => {
        const {asFragment, findByText} = render(<TestWrapper >
            <ReportResponsiveLineCustomTick
                tick={{
                    value: '9:00 AM'
                }}
                isTime={true}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
        expect(findByText('9 AM')).not.toBeNull();
    });

    it("renders date if isTime != true", async () => {
        const {asFragment, findByText} = render(<TestWrapper >
            <ReportResponsiveLineCustomTick
                tick={{
                    value: 'Aug 01'
                }}
                isTime={true}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
        expect(findByText('Aug 01')).not.toBeNull();
    });

})
