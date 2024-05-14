import { zeroAddress } from 'viem';
import DisplayAmount from '../DisplayAmount';
import { PositionQuery, usePositionStats, useTokenPrice, useZchfPrice } from '@hooks';
import TableRow from '../Table/TableRow';
import { useAccount, useChainId } from 'wagmi';
import { ADDRESS } from '../../contracts/address';
import Link from 'next/link';
import { Badge } from 'flowbite-react';
import { Button, Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface Props {
	position: PositionQuery;
}

export default function PositionRow({ position }: Props) {
	const { address } = useAccount();
	const chainId = useChainId();
	const positionStats = usePositionStats(position.position, position.collateral);
	const collTokenPrice = useTokenPrice(position.collateral);
	const zchfPrice = useZchfPrice();

	const account = address || zeroAddress;
	const isMine = positionStats.owner == account;

	const org = `${positionStats.original.slice(0, 6)}...${positionStats.original.slice(-4)}`;

	// console.log({ collTokenPrice });

	return (
		<TableRow
			link={`/position/${position.position}`}
			actionCol={
				isMine ? (
					<Link href={`/position/${position.position}/adjust`} className="btn btn-primary w-full">
						Adjust
					</Link>
				) : positionStats.cooldown * 1000n > Date.now() ? (
					<></>
				) : positionStats.limitForClones > 0n && !positionStats.closed ? (
					<Link href={`/position/${position.position}/borrow`} className="btn btn-primary w-full">
						Clone & Mint
					</Link>
				) : (
					<></>
				)
			}
		>
			<div>
				<DisplayAmount
					amount={positionStats.collateralBal}
					currency={positionStats.collateralSymbol}
					digits={positionStats.collateralDecimal}
					address={positionStats.collateral}
					usdPrice={collTokenPrice}
				/>
			</div>
			<div>
				<DisplayAmount
					amount={positionStats.liqPrice}
					currency={'ZCHF'}
					hideLogo
					bold={positionStats.cooldown * 1000n > Date.now()}
					digits={36 - positionStats.collateralDecimal}
					address={ADDRESS[chainId].frankenCoin}
					usdPrice={zchfPrice}
				/>
			</div>
			<div className="flex items-center">
				{position.position == positionStats.original ? (
					<Badge color="success">Original {org}</Badge>
				) : (
					<Badge color="warning">Clone {org}</Badge>
				)}
			</div>
			<div className="flex items-center">
				{position.denied ? (
					<Badge color="dark">Denied</Badge>
				) : positionStats.collateralBal == 0n ? (
					<Badge color="dark">Closed</Badge>
				) : (
					<DisplayAmount
						amount={positionStats.limitForClones}
						currency={'ZCHF'}
						hideLogo
						address={ADDRESS[chainId].frankenCoin}
						usdPrice={zchfPrice}
					/>
				)}
			</div>
		</TableRow>
	);
}
