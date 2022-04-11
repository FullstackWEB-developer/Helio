import i18n from '../../../i18n';
import {unmountComponentAtNode} from 'react-dom';
import React from 'react';
import Badge from '@components/badge/badge';
import renderer from 'react-test-renderer';
describe("Badge tests", () => {
    let container: HTMLDivElement | null;
    beforeEach(async () => {
        await i18n.init();
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


    it("renders danger badge correctly", () => {
        const tree = renderer
            .create(<Badge text='badge-text' type='danger'/>, container)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });


    it("renders default badge correctly", () => {
        const tree = renderer
            .create(<Badge text='badge-text' type='default'/>, container)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders default badge with class correctly", () => {
        const tree = renderer
            .create(<Badge text='badge-text' type='default' className='test-class'/>, container)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
})
