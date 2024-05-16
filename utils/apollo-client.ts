// apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { URI_PONDERINDEXER } from '@utils';

const client = new ApolloClient({
	link: new HttpLink({
		uri: URI_PONDERINDEXER,
	}),
	cache: new InMemoryCache(),
});

export default client;
