import { useAccount } from 'wagmi';
import PositionRow from './PositionRow';
import { zeroAddress } from 'viem';
import TableHeader from '../Table/TableHead';
import TableBody from '../Table/TableBody';
import Table from '../Table';
import TableRowEmpty from '../Table/TableRowEmpty';
import LoadingSpin from '../LoadingSpin';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/redux.store';

interface Props {
	showMyPos?: boolean;
}

export default function PositionTable({ showMyPos }: Props) {
	const { address } = useAccount();
	const { list, loading } = useSelector((state: RootState) => state.positions);

	const account = address || zeroAddress;
	const matchingPositions = list.filter((position) =>
		showMyPos ? position.owner == account : position.owner != account && !position.denied && !position.closed
	);
	const originalPositions = matchingPositions.filter((positions) => positions.isOriginal);
	const originalPositionsCat = originalPositions.map((org) => matchingPositions.filter((pos) => pos.original == org.original));

	return (
		<Table>
			<TableHeader headers={['Collateral', 'Liquidation Price', 'Available Amount']} actionCol />
			<TableBody>
				{loading ? (
					<TableRowEmpty>
						<div className="flex items-center">
							<LoadingSpin classes="mr-3" />
							Loading...
						</div>
					</TableRowEmpty>
				) : originalPositions.length == 0 ? (
					<TableRowEmpty>{showMyPos ? "You don't have any positions." : 'There are no other positions yet.'}</TableRowEmpty>
				) : (
					originalPositions.map((pos) => <PositionRow position={pos} key={pos.position} />)
				)}
			</TableBody>
		</Table>
	);
}
