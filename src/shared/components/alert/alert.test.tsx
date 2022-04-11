import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import i18n from '../../../i18n';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Alert from '@components/alert/alert';
import renderer from 'react-test-renderer';
import React from 'react';
describe("Alert tests", () => {

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

    it("should render error alert", () => {

        act(() => {
            render(<Alert type='error' message='test-alert'/>, container);
        });

        expect(container?.firstChild).toHaveClass("alert alert-error py-3 z-50 px-4 flex flex-row space-x-4 items-center");
        expect(container?.textContent).toContain("test-alert");
    });

    it("renders error correctly", () => {
        const tree = renderer
            .create(<Alert type='error' message='test-alert'/>, container)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
