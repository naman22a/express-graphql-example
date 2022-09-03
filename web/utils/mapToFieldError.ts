import { FieldError } from '../generated/graphql';

function mapToFieldError(errors: FieldError[]) {
    const newErrors: Record<string, string> = {};

    errors.map(error => {
        newErrors[error.field] = error.message;
    });

    return newErrors;
}

export default mapToFieldError;
