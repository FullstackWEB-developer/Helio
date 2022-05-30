import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import React from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import Checkbox from '@components/checkbox/checkbox';
import i18n from '../../../i18nForTests';

describe("Checkbox tests", () => {
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

    it("renders checkbox correctly", async () => {
        const {asFragment} = render(<Checkbox
            label='test'
            name='name'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders checkbox with label-class correctly", async () => {
        const {asFragment} = render(<Checkbox
            label='test'
            name='name'
            labelClassName='label-class'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders checkbox with className correctly", async () => {
        const {asFragment} = render(<Checkbox
            label='test'
            name='name'
            className='class-name'
            labelClassName='label-class'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders checkbox with value correctly", async () => {
        const {asFragment} = render(<Checkbox
            label='test'
            name='name'
            className='class-name'
            value='3'
            labelClassName='label-class'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders checked checkbox correctly", async () => {
        const {asFragment} = render(<Checkbox
            label='test'
            name='name'
            className='class-name'
            value='3'
            checked={true}
            labelClassName='label-class'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders checkbox with assistive-text correctly", async () => {
        const {asFragment} = render(<Checkbox
            label='test'
            name='name'
            className='class-name'
            value='3'
            assistiveText='assistive-text'
            labelClassName='label-class'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders checkbox default checked correctly", async () => {
        const {asFragment} = render(<Checkbox
            label='test'
            name='name'
            className='class-name'
            value='3'
            defaultChecked={true}
            assistiveText='assistive-text'
            labelClassName='label-class'/>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders truncated checkbox correctly", async () => {
        const {asFragment} = render(<Checkbox
            label='test'
            name='name'
            className='class-name'
            value='3'
            truncate={true}
            defaultChecked={true}
            assistiveText='assistive-text'
            labelClassName='label-class'/>);
        expect(asFragment()).toMatchSnapshot();
    });

})
