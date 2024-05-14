import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// splices
import { positionReducer } from './slices/positions.slice';

// store with combined reducers
export const store = configureStore({
	reducer: combineReducers({
		positions: positionReducer,
	}),
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
