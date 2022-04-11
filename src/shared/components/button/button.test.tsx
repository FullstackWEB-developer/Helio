import i18n from '../../../i18n';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import React from 'react';
import Button from '@components/button/button';
import {Icon} from '@components/svg-icon';

describe("Button tests", () => {
    let container: HTMLDivElement | null;
    beforeEach(async () => {
        await i18n.init();
        dayjs.extend(duration);
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

    it("renders button correctly", async () => {
        const {asFragment} = render(<Button type='button' label='test-button'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders big button correctly", async () => {
        const {asFragment} = render(<Button buttonType={'big'} label='test-button'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders secondary-big button correctly", async () => {
        const {asFragment} = render(<Button buttonType={'secondary-big'} label='test-button'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders secondary button correctly", async () => {
        const {asFragment} = render(<Button buttonType={'secondary'} label='test-button'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders small button correctly", async () => {
        const {asFragment} = render(<Button buttonType={'small'} label='test-button'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders secondary-medium button correctly", async () => {
        const {asFragment} = render(<Button buttonType={'secondary-medium'} label='test-button'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders disabled button correctly", async () => {
        const {asFragment} = render(<Button buttonType={'secondary-medium'} disabled={true} label='test-button'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders icon button correctly", async () => {
        const {asFragment} = render(<Button buttonType={'secondary-medium'} icon={Icon.Add} label='test-button'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders loading button correctly", async () => {
        const {asFragment} = render(<Button isLoading={true} buttonType={'secondary-medium'} label='test-button'/>);
        expect(asFragment()).toMatchSnapshot();
    });
})
