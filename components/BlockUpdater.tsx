import { useBlockNumber } from 'wagmi';
import { useEffect } from 'react';

import { store } from '../redux/redux.store';
import { fetchPositionsList } from '../redux/slices/positions.slice';

export default function BockUpdater() {
	const { error, data } = useBlockNumber({ enabled: true, watch: true });

	useEffect(() => {
		console.log('BlockUpdater Initialize State...');
	}, []);

	useEffect(() => {
		if (error) return;
		console.log(`New block found: ${data}`);

		// fetch positions list from ponder service
		store.dispatch(fetchPositionsList());

		// fetch positions list from ponder service
		// store.dispatch(fetchPositionsList());

		// fetch positions list from ponder service
		// store.dispatch(fetchPositionsList());
	}, [error, data]);

	return null;
}
