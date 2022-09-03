import { NextPage } from 'next';
import Head from 'next/head';
import { Button, Container, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { InputField } from '../components';
import { useRouter } from 'next/router';
import mapToFieldError from '../utils/mapToFieldError';
import { useRegisterMutation } from '../generated/graphql';

const Register: NextPage = () => {
    const [register] = useRegisterMutation();
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Register</title>
            </Head>
            <Container maxW="sm" p={8}>
                <Text fontSize="2xl" mb={10} textAlign="center">
                    Register
                </Text>

                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        password: '',
                        cpassword: ''
                    }}
                    onSubmit={async (values, { setErrors }) => {
                        if (values.cpassword !== values.password) {
                            setErrors({ cpassword: 'Passwords must match' });
                            return;
                        }

                        const res = await register({
                            variables: values
                        });

                        if (res.data?.register.ok) {
                            router.push('/login');
                        } else {
                            setErrors(
                                mapToFieldError(res.data?.register.errors!)
                            );
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <InputField
                                name="name"
                                label="Name"
                                placeholder="Name"
                            />
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
                            <InputField
                                name="cpassword"
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                type="password"
                            />
                            <Button
                                isLoading={isSubmitting}
                                type="submit"
                                colorScheme="teal"
                                mt={5}
                            >
                                Register
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Container>
        </>
    );
};

export default Register;
