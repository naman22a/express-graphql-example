import { LoginDto } from '../dto';
import { isEmail, isNotEmpty, minLength } from 'class-validator';
import { FieldError } from '../types';

export const validateLogin = (user: LoginDto): FieldError[] | null => {
    const errors: FieldError[] = [];

    if (!isEmail(user.email)) {
        errors.push({
            field: 'email',
            message: 'Invalid Email'
        });
    }

    if (!isNotEmpty(user.password)) {
        errors.push({
            field: 'password',
            message: 'Password can not be blank'
        });
    }

    if (errors.length === 0) return null;
    else return errors;
};
