import { useEffect } from 'react';
import Head from 'next/head';
import AppPageHeader from '@components/AppPageHeader';
import { Card, CardContent } from '@mui/material';
import { usePositionLists, PositionQuery } from '../hooks/usePositionLists';
import { usePositionListStats } from '../hooks/usePositionListStats';
import { useState } from 'react';

export default function TestComponent({}) {
	const { loading, positions } = usePositionLists();
	const [positionListStats, setPositionListStats] = useState([]);

	useEffect(() => {
		// const stats = usePositionListStats(positions);
		console.log(positions);
	}, [positions]);

	return (
		<>
			<Head>
				<title>Frankencoin - TestComponent</title>
			</Head>
			<div>
				<AppPageHeader title="Your Tests" />
				{positions &&
					positions.map((position: PositionQuery) => (
						<Card variant="outlined" key={position.position}>
							{/* <div className="flex flex-col px-4 py-4" key={position.position}> */}
							<h2>Position: {position.position}</h2>
							<h2>Owner: {position.owner}</h2>
							<h2>Created: {new Date(position.created * 1000).toString()}</h2>
							<h2>Denied: {position.denied ? 'true' : 'false'}</h2>
							<h2>Closed: {position.closed ? 'true' : 'false'}</h2>
							<h2>Collateral: {position.collateral}</h2>
							<h3>PositionId: {position.position}</h3>
							<h3>Price: {position.price.toString()}</h3>
							<h3>ZCHF: {position.zchf}</h3>
							<h3></h3>
							{/* </div> */}
						</Card>
					))}
				{/* <h1>positions: {JSON.stringify(positions)}</h1> */}
			</div>
		</>
	);
}
