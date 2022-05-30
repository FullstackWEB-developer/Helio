import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import React from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import Card from '@components/card/card';

describe("Card tests", () => {
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

    it("renders card correctly", async () => {
        const {asFragment} = render(<Card>
            <div>Test</div>
        </Card>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders card with title correctly", async () => {
        const {asFragment} = render(<Card title='test'>
            <div>Test</div>
        </Card>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders card with extra correctly", async () => {
        const {asFragment} = render(<Card title='test' extra={<div>extra</div>}>
            <div>Test</div>
        </Card>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders card with radius correctly", async () => {
        const {asFragment} = render(<Card title='test' hasBorderRadius={true}>
            <div>Test</div>
        </Card>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders card with full height correctly", async () => {
        const {asFragment} = render(<Card title='test' hasFullHeight={true}>
            <div>Test</div>
        </Card>);
        expect(asFragment()).toMatchSnapshot();
    });

})
