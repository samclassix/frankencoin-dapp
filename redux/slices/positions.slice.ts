import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { gql } from '@apollo/client';
import { decodeBigIntCall } from '@utils';
import client from '../../utils/apollo-client'; // Assuming you've set up Apollo Client
import { Address, getAddress } from 'viem';

// --------------------------------------------------------------------------------

export type PositionQuery = {
	position: Address;
	owner: Address;
	zchf: Address;
	collateral: Address;
	price: string;

	created: number;
	isOriginal: boolean;
	isClone: boolean;
	denied: boolean;
	closed: boolean;
	original: Address;

	minimumCollateral: string;
	annualInterestPPM: number;
	reserveContribution: number;
	start: string;
	expiration: string;
	challengePeriod: string;

	zchfSymbol: string;
	zchfDecimals: number;

	collateralSymbol: string;
	collateralDecimals: number;
	collateralBalance: string;

	limitForPosition: string;
	limitForClones: string;
	availableForPosition: string;
	availableForClones: string;
	minted: string;
};

export type PositionsState = {
	error: string | null;
	loading: boolean;
	list: PositionQuery[];
};

export type DispatchPositionsLoading = {
	type: string;
	payload: Boolean;
};

export type DispatchPositionsList = {
	type: string;
	payload: PositionQuery[];
};

// --------------------------------------------------------------------------------

export const initialState: PositionsState = {
	error: null,
	loading: false,
	list: [],
};

// --------------------------------------------------------------------------------

export const slice = createSlice({
	name: 'positions',
	initialState,
	reducers: {
		// HAS ERROR
		hasError(state, action: { payload: string }) {
			state.error = action.payload;
		},

		// SET LOADING
		setLoading: (state, action: { payload: boolean }) => {
			state.loading = action.payload;
		},

		// SET POSITIONS LIST
		setPositionsList: (state, action: { payload: PositionQuery[] }) => {
			state.list = action.payload;
		},
	},
});

export const positionReducer = slice.reducer;
export const positionActions = slice.actions;

// --------------------------------------------------------------------------------
export const fetchPositionsList = () => async (dispatch: Dispatch<DispatchPositionsList | DispatchPositionsLoading>) => {
	console.log('Loading [REDUX]: PositionsList');
	dispatch(slice.actions.setLoading(true));

	const { data } = await client.query({
		query: gql`
			query {
				positions(orderBy: "availableForClones", orderDirection: "desc") {
					items {
						position
						owner
						zchf
						collateral
						price

						created
						isOriginal
						isClone
						denied
						closed
						original

						minimumCollateral
						annualInterestPPM
						reserveContribution
						start
						expiration
						challengePeriod

						zchfSymbol
						zchfDecimals

						collateralSymbol
						collateralDecimals
						collateralBalance

						limitForPosition
						limitForClones
						availableForPosition
						availableForClones
						minted
					}
				}
			}
		`,
	});

	const positions: PositionQuery[] = [];
	if (data && data.positions) {
		data.positions.items.forEach(async (p: PositionQuery) => {
			// TODO: decodeBigIntCall / parseStringToBigInt???
			positions.push({
				position: getAddress(p.position),
				owner: getAddress(p.owner),
				zchf: getAddress(p.zchf),
				collateral: getAddress(p.collateral),
				price: p.price,

				created: p.created,
				isOriginal: p.isOriginal,
				isClone: p.isClone,
				denied: p.denied,
				closed: p.closed,
				original: getAddress(p.position),

				minimumCollateral: p.minimumCollateral,
				annualInterestPPM: p.annualInterestPPM,
				reserveContribution: p.reserveContribution,
				start: p.start,
				expiration: p.expiration,
				challengePeriod: p.challengePeriod,

				zchfSymbol: p.zchfSymbol,
				zchfDecimals: p.zchfDecimals,

				collateralSymbol: p.collateralSymbol,
				collateralDecimals: p.collateralDecimals,
				collateralBalance: p.collateralBalance,

				limitForPosition: p.limitForPosition,
				limitForClones: p.limitForClones,
				availableForPosition: p.availableForPosition,
				availableForClones: p.availableForClones,
				minted: p.minted,
			});
		});
	}

	dispatch(slice.actions.setPositionsList(positions));
	dispatch(slice.actions.setLoading(false));
};
