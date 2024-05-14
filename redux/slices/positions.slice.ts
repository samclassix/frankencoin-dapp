import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usePositionLists, PositionQuery } from '@hooks';

export interface PositionState {
	loading: boolean;
	positions: PositionQuery[];
}

export const initialState: PositionState = {
	loading: false,
	positions: [],
};

export const slice = createSlice({
	name: 'positions',
	initialState,
	reducers: {
		setPositions: (state, action: { payload: PositionState }) => {
			console.log('setPositions');
			state.loading = action.payload.loading;
			state.positions = action.payload.positions;
		},
	},
});

export const positionReducer = slice.reducer;
export const positionActions = slice.actions;
