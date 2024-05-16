import { useSelector } from 'react-redux';
import { RootState } from '../../redux/redux.store';
import { Card, CardContent, Grid, SvgIcon, Typography } from '@mui/material';
import { Address } from 'viem';

export default function TotalValueLocked() {
	const { loading, openPositionsByCollateral } = useSelector((state: RootState) => state.positions);
	const { coingecko } = useSelector((state: RootState) => state.prices);

	if (openPositionsByCollateral.length == 0 || Object.keys(coingecko).length == 0) return <>Loadinng...</>;

	const stats = [];
	for (let positions of openPositionsByCollateral) {
		const original = positions.at(0);
		const collateral = coingecko[original!.collateral.toLowerCase() as Address];
		const mint = coingecko[original!.zchf.toLowerCase() as Address];

		if (!collateral || !mint) continue;

		let balance = 0;
		let limitForClones = 0;
		let availableForClones = 0;

		for (let pos of positions) {
			balance += parseInt(pos.collateralBalance);
			if (pos.isOriginal) {
				limitForClones += parseInt(pos.limitForClones);
				availableForClones += parseInt(pos.availableForClones);
			}
		}

		balance = balance / 10 ** collateral.decimals;
		const valueLocked = Math.round(balance * collateral.price.usd);
		const highestZCHFPrice =
			Math.round(Math.max(...positions.map((p) => (parseInt(p.price) * 100) / 10 ** (36 - p.collateralDecimals)))) / 100;

		const collateralizedPct = Math.round((collateral.price.usd / (highestZCHFPrice * mint.price.usd)) * 10000) / 100;

		stats.push({
			original,
			originals: positions.filter((pos) => pos.isOriginal),
			clones: positions.filter((pos) => pos.isClone),
			balance,
			collateral,
			mint,
			limitForClones,
			availableForClones,
			valueLocked,
			highestZCHFPrice,
			collateralizedPct,
		});
	}

	return (
		<Grid container spacing={2} sx={{ justifyContent: 'center' }}>
			{stats.map((stat) => {
				// const pr = stats?.priceQuote ? stats.priceQuote.usd : undefined;
				// console.log(stat);
				const prs = stat.originals.map(
					(pos) => Math.round((parseInt(pos.price) * 100) / 10 ** (36 - pos.collateralDecimals)) / 100
				);
				const av = Math.floor(stat!.availableForClones / 10 ** stat?.original!.zchfDecimals);
				const lm = Math.floor(stat!.limitForClones / 10 ** stat?.original!.zchfDecimals);
				const pct = Math.floor((1 - av / lm) * 10000) / 100;

				return (
					<Grid
						alignContent={'center'}
						item
						xs={2}
						key={stat?.original?.collateral}
						sx={{
							bgcolor: '#222',
							boxShadow: 10,
							borderRadius: 5,
							minWidth: '80%',
							minHeight: 200,
							p: 5,
							m: 2,
						}}
					>
						<Typography align="center" variant="h5">
							{stat.collateral.name}
						</Typography>

						<Typography>
							Balance: {stat.balance} {stat.collateral.symbol}
						</Typography>
						<Typography>Originals: {stat.originals.length}</Typography>
						<Typography>Clones: {stat.clones.length}</Typography>
						<Typography>-</Typography>

						<Typography>All prices for all original positions:</Typography>
						{prs ? prs.map((pr) => <Typography key={Math.random() * 10 ** 8}>Price: {pr} ZCHF</Typography>) : null}
						<Typography>Price (coingecko): {stat.mint.price.usd} USD/ZCHF</Typography>
						<Typography>
							Price (coingecko): {stat.collateral.price.usd} USD/{stat.collateral.symbol}
						</Typography>
						<Typography>Price (highest): {stat.highestZCHFPrice} ZCHF</Typography>
						<Typography>
							Price (highest): {stat.highestZCHFPrice * stat.mint.price.usd} USD/{stat.collateral.symbol}
						</Typography>
						<Typography>-</Typography>

						<Typography>Value Locked (coingecko): {stat.valueLocked} USD</Typography>
						<Typography>Value Locked (ZCHF): {Math.round(stat.balance * stat.highestZCHFPrice)} ZCHF</Typography>
						<Typography>-</Typography>

						<Typography>Av. for cloans: {av} ZCHF</Typography>
						<Typography>Limit mint: {lm} ZCHF</Typography>
						<Typography>-</Typography>

						<Typography>Pct minted: {pct} %</Typography>
						<Typography>Pct collateralized: {stat.collateralizedPct} %</Typography>
					</Grid>
				);
			})}
		</Grid>
	);
}
