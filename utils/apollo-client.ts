// apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
	link: new HttpLink({
		// uri: 'https://ponder3.frankencoin.com/',
		uri: 'http://localhost:42069',
	}),
	cache: new InMemoryCache(),
});

export default client;
