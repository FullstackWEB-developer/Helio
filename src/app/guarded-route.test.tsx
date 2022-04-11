import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import React from 'react';
import configureStore from 'redux-mock-store';
import initialAppState from '@shared/store/app/app.initial-state';
import initialAppUserState from '@shared/store/app-user/appuser.initial-state';
import {Provider} from 'react-redux';
import GuardedRoute from '@app/guarded-route';
import {MemoryRouter} from 'react-router-dom';
import ExternalUserVerificationCode from '@pages/external-access/verify-patient/external-user-verification-code';

describe("Guarded Route tests", () => {
    const mockStore = configureStore();
    let store;
    const mockState = {
        appState: {
            ...initialAppState,
            displayLoginRequired: true,
            loginRequiredDismissed: false
        },
        appUserState: {
            ...initialAppUserState,
            appUserDetails: {
                permissions: ['can-see']
            }
        }
    };
    let container: HTMLDivElement | null;
    beforeEach(async () => {
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

    it("should not render if user has no permission", () => {
        const {container} = render(<Provider store={store}><MemoryRouter><GuardedRoute path='/external' permission='cannot-see' component={ExternalUserVerificationCode} /></MemoryRouter></Provider>);
        expect(container).toContainHTML('<div />');
    });
});
