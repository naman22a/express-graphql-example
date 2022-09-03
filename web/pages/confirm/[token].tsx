import React from 'react';
import { Button, Flex, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useConfirmEmailMutation } from '../../generated/graphql';

const ConfirmEmail: React.FC = () => {
    const router = useRouter();
    const token = router.query.token as string;
    const toast = useToast();
    const [confirmEmail, { loading }] = useConfirmEmailMutation();

    const handleConfirmEmail = async () => {
        const res = await confirmEmail({ variables: { token } });
        if (res.data?.confirmEmail) {
            router.push('/login');
        } else {
            toast({
                title: 'Something went wrong',
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: 'top'
            });
        }
    };

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mt={20}
        >
            <Text fontSize="2xl" fontWeight="semibold" mb={5}>
                Confirm Email
            </Text>
            <Button
                colorScheme="teal"
                isLoading={loading}
                onClick={() => handleConfirmEmail()}
            >
                Confirm Email
            </Button>
        </Flex>
    );
};

export default ConfirmEmail;
