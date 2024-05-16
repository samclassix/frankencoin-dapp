import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// splices
import { reducer as positionReducer } from './slices/positions.slice';
import { reducer as pricesReducer } from './slices/prices.slice';

// store with combined reducers
export const store = configureStore({
	reducer: combineReducers({
		positions: positionReducer,
		prices: pricesReducer,
	}),
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
