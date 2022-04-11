import { unmountComponentAtNode} from 'react-dom';
import i18n from '../../../i18n';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {render} from '@testing-library/react';
import React from 'react';
import AudioPlayer from '@components/audio-player/audio-player';
describe("Audio Player tests", () => {

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

    it("should render correctly", () => {
            jest
            .spyOn(window.HTMLMediaElement.prototype, 'load')
            .mockImplementation(() => {})
        const {asFragment} = render(<AudioPlayer url='test'/>);
        expect(asFragment()).toMatchSnapshot();
    });

});
