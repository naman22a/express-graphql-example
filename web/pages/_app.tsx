import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
    ApolloLink
} from '@apollo/client';

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include'
});

const apolloClient = new ApolloClient({
    link: ApolloLink.from([httpLink]),
    cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <ApolloProvider client={apolloClient}>
                <Component {...pageProps} />
            </ApolloProvider>
        </ChakraProvider>
    );
}

export default MyApp;
