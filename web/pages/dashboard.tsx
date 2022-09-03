import { Box, Button, Container, Spinner, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
    useDeleteAccountMutation,
    useLogoutMutation,
    useMeQuery
} from '../generated/graphql';
import { useToast } from '@chakra-ui/react';

const dashboard: NextPage = () => {
    const { data, loading, error } = useMeQuery();
    const [logout, { loading: loggingOut }] = useLogoutMutation();
    const [deleteAccount, { loading: deleting }] = useDeleteAccountMutation();
    const router = useRouter();
    const toast = useToast();

    const handleLogout = async () => {
        const res = await logout();
        if (res.data?.logout) {
            toast({
                title: 'Logged Out',
                description: 'We have successfully logged you out',
                status: 'success',
                duration: 1000,
                isClosable: true,
                position: 'top'
            });
            router.push('/');
        } else {
            toast({
                title: 'Not Logged Out',
                description: 'Opps! Something went wrong',
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: 'top'
            });
        }
    };

    const handleDeleteAccount = async () => {
        const res = await deleteAccount();
        if (res.data?.deleteAccount) {
            toast({
                title: 'Account deleted',
                description: 'We have successfully deleted your account',
                status: 'success',
                duration: 1000,
                isClosable: true,
                position: 'top'
            });
            router.push('/');
        } else {
            toast({
                title: 'Account not deleted',
                description: 'Opps! Something went wrong',
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: 'top'
            });
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (error || !data) {
        router.push('/login');
        toast({
            title: 'You are not authorized to view this page',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top'
        });
        return null;
    }

    return (
        <Container maxW="lg" p={8}>
            <Text casing="capitalize" fontSize="2xl">
                dashboard
            </Text>
            <Text fontSize="xl">
                Welcome back <Text as="span">{data?.me?.name}</Text>
            </Text>
            <Button
                colorScheme="teal"
                onClick={() => handleLogout()}
                isLoading={loggingOut}
                my={5}
            >
                Logout
            </Button>
            <br />
            <Button
                colorScheme="red"
                onClick={() => handleDeleteAccount()}
                isLoading={deleting}
            >
                Delete Account
            </Button>
        </Container>
    );
};

export default dashboard;
