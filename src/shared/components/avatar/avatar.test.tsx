import {unmountComponentAtNode} from 'react-dom';
import i18n from '../../../i18nForTests';
import {render} from '@testing-library/react';
import React from 'react';
import Avatar from '@components/avatar/avatar';
import configureStore from 'redux-mock-store';
import {UserStatus} from '@shared/store/app-user/app-user.models';
import {Icon} from '@components/svg-icon';
import initialAppState from '@shared/store/app/app.initial-state';
import initialAppUserState from '@shared/store/app-user/appuser.initial-state';
import {Provider} from 'react-redux';

describe("Avatar tests", () => {
    const mockStore = configureStore();
    let store;
    const mockState = {
        appState: {
            ...initialAppState,
            displayLoginRequired: true,
            loginRequiredDismissed: false
        },
        appUserState: {
            ...initialAppUserState
        }
    };
    let container: HTMLDivElement | null;
    beforeEach(async () => {
        await i18n.init();
        store = mockStore(mockState);
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
        const {asFragment} = render(<Provider store={store}><Avatar userFullName='Name Surname'/></Provider>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("should render correctly with class", () => {
        const {asFragment} = render(<Provider store={store}><Avatar className='myClass' userFullName='Name Surname'/></Provider>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("should render correctly with labelClass", () => {
        const {asFragment} = render(<Provider store={store}><Avatar className='myClass' labelClassName='labelClass' userFullName='Name Surname'/></Provider>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("should render correctly with user status", () => {
        const {asFragment} = render(<Provider store={store}><Avatar  status={UserStatus.Busy} userFullName='Name Surname'/></Provider>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("should render correctly with icon", () => {
        const {asFragment} = render(<Provider store={store}><Avatar icon={Icon.Extension} userFullName='Name Surname'/></Provider>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("should render correctly with user picture", () => {
        const {asFragment} = render(<Provider store={store}><Avatar userPicture='userpicture' userFullName='Name Surname'/></Provider>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("should render correctly with user picture", () => {
        const {asFragment} = render(<Provider store={store}><Avatar displayStatus={true} userFullName='Name Surname'/></Provider>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("should render correctly with user id", () => {
        store = mockStore({
            ...mockState,
            appState: {
                ...mockState.appState,
                loginRequiredDismissed: true,
            },
            appUser: {
                liveAgentStatuses: []
            }
        });

        const {asFragment} = render(<Provider store={store}><Avatar userId='1234' userFullName='Name Surname'/></Provider>);
        expect(asFragment()).toMatchSnapshot();
    });

});
