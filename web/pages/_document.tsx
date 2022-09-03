import { Flex } from '@chakra-ui/react';
import { Html, Head, Main, NextScript } from 'next/document';
import { Header } from '../components';

export default function Document() {
    return (
        <Html>
            <Head />
            <body>
                <Flex direction="column" bg="gray.300" minHeight="100vh">
                    <Header />
                    <Main />
                    <NextScript />
                </Flex>
            </body>
        </Html>
    );
}
