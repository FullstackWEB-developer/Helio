import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import ReLoginModal from './relogin-modal';
import initialAppState from '@shared/store/app/app.initial-state';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import initialAppUserState from '@shared/store/app-user/appuser.initial-state';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import i18n from '../../../i18nForTests';

describe("tests for ReLogin modal", () => {
    const mockStore = configureStore();
    let store;

    let container: HTMLDivElement | null;
    const mockState = {
        appState: {
            ...initialAppState,
            displayLoginRequired: true,
            loginRequiredDismissed: false
        },
        appUserState: {
            ...initialAppUserState,
            expiresOn: dayjs().add(29, 'minutes').toDate()
        }
    };
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

    it("renders reLogin required", async () => {
        store = mockStore(mockState);

        await act(async () => {
            render(<Provider store={store}><ReLoginModal type='modal'/></Provider>, container);
        });

        expect(container?.textContent).toContain("login.re-login_required");
        expect(container?.children.length).toEqual(1);
    });

    it("renders reLogin required in header", async () => {
        store = mockStore({
            ...mockState,
            appState: {
                ...mockState.appState,
                loginRequiredDismissed: true
            }
        });

        await act(async () => {
            render(<Provider store={store}><ReLoginModal type='header'/></Provider>, container);
        });

        expect(container?.textContent).toContain("login.re-login_required_header");
        expect(container?.children.length).toEqual(1);
    });

    it("does not render if display is false", async () => {
        store = mockStore({
            ...mockState,
            appState: {
                ...initialAppState,
                displayLoginRequired: false
            },
        });

        await act(async () => {
            render(<Provider store={store}><ReLoginModal type='modal'/></Provider>, container);
        });
        expect(container?.textContent).toEqual("");
        expect(container?.children.length).toEqual(0);
    });

});
