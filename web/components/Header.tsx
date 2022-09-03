import React from 'react';
import { Flex, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

const Header: React.FC = () => {
    return (
        <Flex
            as="header"
            px={50}
            py={20}
            alignItems="center"
            justifyContent="space-between"
            shadow="xl"
        >
            <Text>GraphQL</Text>
            <Flex as="nav">
                <NextLink href="/" passHref>
                    <Link mx={5}>Home</Link>
                </NextLink>
                <NextLink href="/login" passHref>
                    <Link mx={5}>Login</Link>
                </NextLink>
                <NextLink href="/register" passHref>
                    <Link mx={5}>Register</Link>
                </NextLink>
                <NextLink href="/dashboard" passHref>
                    <Link mx={5}>Dasboard</Link>
                </NextLink>
            </Flex>
        </Flex>
    );
};

export default Header;
