import {Dispatch} from '@reduxjs/toolkit';

export const queryWithState = <T extends any>(
    getData: () => Promise<T>,
    setState: (payload?: T | undefined) => {
        payload: T | undefined,
        type: string
    },
    canFetch?: () => boolean
) => {
    return async (dispatch: Dispatch) => {
        if (canFetch && !canFetch()) {
            return;
        }

        try {
            const result = await getData();
            dispatch(setState(result));
        } catch (error: any) {
            dispatch(setState(undefined));
        }
    }
}
