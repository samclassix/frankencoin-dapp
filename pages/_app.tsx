'use client';
import '../styles/globals.css';
import '../styles/datepicker.css';
import type { AppProps } from 'next/app';

import Layout from '@components/Layout';
import { ApolloProvider } from '@apollo/client';
import client from '../utils/apollo-client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Web3Modal } from '@components/Web3Modal';
import BlockUpdater from '@components/BlockUpdater';
import { useTokenPrice, useTokenPrices } from '@hooks';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../redux/redux.store';
import NextSeoProvider from '@components/NextSeoProvider';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ReduxProvider store={store}>
			<Web3Modal>
				<ApolloProvider client={client}>
					<BlockUpdater />
					<NextSeoProvider />
					<ToastContainer position="bottom-right" hideProgressBar={false} rtl={false} theme="dark" />
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</ApolloProvider>
			</Web3Modal>
		</ReduxProvider>
	);
}
