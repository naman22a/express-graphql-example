import { NextPage } from 'next';
import Head from 'next/head';
import { Button, Container, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { InputField } from '../components';
import { useLoginMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import mapToFieldError from '../utils/mapToFieldError';

const Login: NextPage = () => {
    const [login] = useLoginMutation();
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <Container maxW="sm" p={8}>
                <Text fontSize="2xl" mb={10} textAlign="center">
                    Login
                </Text>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    onSubmit={async (values, { setErrors }) => {
                        const res = await login({
                            variables: values
                        });

                        if (res.data?.login.ok) {
                            router.push('/dashboard');
                        } else {
                            setErrors(mapToFieldError(res.data?.login.errors!));
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <InputField
                                name="email"
                                label="Email"
                                placeholder="Email"
                            />
                            <InputField
                                name="password"
                                label="Password"
                                placeholder="Password"
                                type="password"
                            />
                            <Button
                                isLoading={isSubmitting}
                                type="submit"
                                colorScheme="teal"
                                mt={5}
                            >
                                Login
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Container>
        </>
    );
};

export default Login;
