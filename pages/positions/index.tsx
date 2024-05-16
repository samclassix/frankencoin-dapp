import Head from 'next/head';
import AppPageHeader from '@components/AppPageHeader';
import TotalValueLocked from '@components/TotalValueLocked';
import Link from 'next/link';

export default function Positions() {
	return (
		<>
			<Head>
				<title>Frankencoin - Positions</title>
			</Head>
			<div>
				<AppPageHeader title="Total Value Locked" />
				<TotalValueLocked />
			</div>
			{/* <div className="flex">
				<Link href={'positions/create'} className="btn btn-primary m-auto">
					Propose New Position Type
				</Link>
			</div> */}
		</>
	);
}
