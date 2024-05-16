import { useSelector } from 'react-redux';
import { RootState } from '../../redux/redux.store';
import { PositionQuery } from '@hooks';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Card, CardContent, Grid, SvgIcon, Typography } from '@mui/material';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';

function uniqueValues(value: string, index: number, array: string[]) {
	return array.indexOf(value) === index;
}

export default function TotalValueLocked() {
	const { list, loading } = useSelector((state: RootState) => state.positions);

	const matchingPositions = list.filter((position) => !position.denied && !position.closed);
	const originalPositions = matchingPositions.filter((positions) => positions.isOriginal);
	const originalPositionsCategories = originalPositions.map((org) => matchingPositions.filter((pos) => pos.original == org.original));
	const collateralCat = matchingPositions.map((pos) => pos.collateral).filter(uniqueValues);
	const collateralPositionCat = collateralCat.map((cat) => matchingPositions.filter((pos) => pos.collateral == cat));

	const collateralStats = collateralPositionCat.map((posCat) => {
		const org = posCat.at(0);
		let balance = 0;
		let limitForClones = 0;
		let availableForClones = 0;

		for (let pos of posCat) {
			balance += parseInt(pos.collateralBalance);
			if (pos.isOriginal) {
				limitForClones += parseInt(pos.limitForClones);
				availableForClones += parseInt(pos.availableForClones);
			}
		}

		return {
			original: org,
			originals: posCat.filter((pos) => pos.isOriginal),
			clones: posCat.filter((pos) => pos.isClone),
			balance,
			limitForClones,
			availableForClones,
		};
	});

	return (
		<Grid container spacing={2} sx={{ justifyContent: 'center' }}>
			{collateralStats.map((stats) => {
				const name = stats?.original?.collateralName;
				const vl = stats?.balance / 10 ** stats?.original!.collateralDecimals;
				const prs = stats.originals.map(
					(pos) => Math.round((parseInt(pos.price) * 100) / 10 ** (36 - pos.collateralDecimals)) / 100
				);
				const av = Math.floor(stats!.availableForClones / 10 ** stats?.original!.zchfDecimals);
				const lm = Math.floor(stats!.limitForClones / 10 ** stats?.original!.zchfDecimals);
				const pct = Math.floor((1 - av / lm) * 10000) / 100;

				return (
					<Grid
						alignContent={'center'}
						item
						xs={2}
						key={stats?.original?.collateral}
						sx={{
							bgcolor: '#222',
							boxShadow: 10,
							borderRadius: 5,
							minWidth: 300,
							minHeight: 200,
							p: 5,
							m: 2,
						}}
					>
						<Typography align="center" variant="h5">
							{name}
						</Typography>
						<Typography>
							Value Locked: {vl} {stats.original?.collateralSymbol}
						</Typography>
						<Typography>Originals: {stats?.originals.length}</Typography>
						<Typography>Clones: {stats?.clones.length}</Typography>
						{prs ? prs.map((pr) => <Typography key={Math.random() * 10 ** 8}>Price: {pr} ZCHF</Typography>) : null}
						<Typography>Av. for cloans: {av} ZCHF</Typography>
						<Typography>Limit mint: {lm} ZCHF</Typography>
						<Typography>Pct minted: {pct} %</Typography>
					</Grid>
				);
			})}
		</Grid>
	);
}
