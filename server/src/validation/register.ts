import { RegisterDto } from '../dto';
import { isEmail, isNotEmpty, minLength } from 'class-validator';
import { FieldError } from '../types';

export const validateRegister = (user: RegisterDto): FieldError[] | null => {
    const errors: FieldError[] = [];

    if (!isNotEmpty(user.name)) {
        errors.push({
            field: 'name',
            message: 'Name can not be blank'
        });
    }

    if (!isEmail(user.email)) {
        errors.push({
            field: 'email',
            message: 'Invalid Email'
        });
    }

    if (!minLength(user.password, 6)) {
        errors.push({
            field: 'password',
            message: 'Password must be 6 characters long'
        });
    }

    if (errors.length === 0) return null;
    else return errors;
};
