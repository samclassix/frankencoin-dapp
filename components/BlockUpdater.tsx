import { useBlockNumber } from 'wagmi';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { positionActions } from '../redux/slices/positions.slice';
import { RootState, store } from '../redux/redux.store';
import { usePositionLists } from '../hooks/usePositionLists';
import { usePositionListStats } from '../hooks/usePositionListStats';
import { usePositionStats } from '../hooks/usePositionStats';

export default function BockUpdater() {
	const { error, data } = useBlockNumber({ enabled: true, watch: true });
	const positionLists = usePositionLists();
	// const positionListStats = positionLists.positions.forEach(p => usePositionStats(p.position, p.collateral));

	useEffect(() => {
		if (error) return;
		console.log(`New block found: ${data}`);

		console.log(positionLists);
		if (positionLists.positions.length > 0) {
			store.dispatch(positionActions.setPositions(positionLists));
		}
	}, [error, data, positionLists]);

	return null;
}
