import i18n from '../../../i18n';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import React from 'react';
import Calendar from '@components/calendar/index';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

describe("Calendar tests", () => {
    let container: HTMLDivElement | null;
    beforeEach(async () => {
        await i18n.init();
        dayjs.extend(duration);
        dayjs.extend(utc);
        dayjs.extend(customParseFormat);
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

    it("renders calendar correctly", async () => {
        const {asFragment} = render(<Calendar
            highlightToday={false}
            max={dayjs('2019-01-25').toDate()}
            min={dayjs('2019-01-25').toDate()}
            isWeekendDisabled={false}
            date={dayjs('2019-01-25').toDate()}
            onChange={() => {}}
            onFocus={() => {}}
            onBlur={() => {}}/>);
        expect(asFragment()).toMatchSnapshot();
    });
})
