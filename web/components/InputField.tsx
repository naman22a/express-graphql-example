import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage
} from '@chakra-ui/react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
};

const InputField: React.FC<Props> = ({ label, size: _, ...props }) => {
    const [field, { error }] = useField(props);

    return (
        <FormControl isInvalid={!!error} display="inline-block">
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input
                {...field}
                {...props}
                id={field.name}
                placeholder={props.placeholder}
                autoComplete="off"
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default InputField;
