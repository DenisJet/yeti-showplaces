import {configureStore} from '@reduxjs/toolkit';
import showplacesReducer from './showplaces.slice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            showplaces: showplacesReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
