import {
    Resolver,
    Mutation,
    Arg,
    Query,
    Ctx,
    UseMiddleware
} from 'type-graphql';
import { LoginDto, RegisterDto } from '../dto';
import { AuthResponse, MyContext } from '../types';
import { validateRegister, validateLogin } from '../validation';
import argon2 from 'argon2';
import { User } from '../entities';
import { isAuth } from '../middleware';
import { CONFIRM_PREFIX, COOKIE_NAME } from '../constants';
import { createConfirmationUrl, sendEmail } from '../utils';
import { redis } from '../redis';

@Resolver()
export class AuthResolver {
    @Mutation(() => AuthResponse)
    async register(
        @Arg('registerDto') registerDto: RegisterDto,
        @Ctx() { req }: MyContext
    ): Promise<AuthResponse> {
        const errors = validateRegister(registerDto);
        if (errors) {
            return {
                ok: false,
                errors: errors!
            };
        }

        const { name, email, password } = registerDto;

        const userExists = await User.findOneBy({ email });

        if (userExists) {
            return {
                ok: false,
                errors: [
                    {
                        field: 'email',
                        message: 'Email already in use'
                    }
                ]
            };
        }

        const hashedPassword = await argon2.hash(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        }).save();

        await sendEmail(email, await createConfirmationUrl(user.id));

        return {
            ok: true
        };
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return await User.find();
    }

    @Mutation(() => AuthResponse)
    async login(
        @Arg('loginDto') loginDto: LoginDto,
        @Ctx() { req }: MyContext
    ): Promise<AuthResponse> {
        const errors = validateLogin(loginDto);
        if (errors) {
            return {
                ok: false,
                errors: errors!
            };
        }

        const { email, password } = loginDto;

        const user = await User.findOneBy({ email });
        if (!user) {
            return {
                ok: false,
                errors: [
                    {
                        field: 'email',
                        message: 'No user with given email'
                    }
                ]
            };
        }

        const isMatch = await argon2.verify(user.password, password);

        if (!isMatch) {
            return {
                ok: false,
                errors: [
                    {
                        field: 'password',
                        message: 'Incorrect password'
                    }
                ]
            };
        }

        if (!user.confirmed) {
            return {
                ok: false,
                errors: [
                    {
                        field: 'email',
                        message: 'Please confirm your email'
                    }
                ]
            };
        }

        req.session.userId = user.id;

        return {
            ok: true
        };
    }

    @Query(() => User, { nullable: true })
    @UseMiddleware(isAuth)
    async me(@Ctx() { req }: MyContext): Promise<User | null> {
        return await User.findOneBy({ id: req.session.userId });
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
        return new Promise(resolve =>
            req.session.destroy(err => {
                if (err) {
                    resolve(false);
                    return;
                }
                res.clearCookie(COOKIE_NAME);
                resolve(true);
            })
        );
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteAccount(@Ctx() { req, res }: MyContext) {
        const x = await User.delete({ id: req.session.userId });
        if (x.affected === 0) {
            return false;
        }

        res.clearCookie(COOKIE_NAME);
        delete req.session.userId;

        return true;
    }

    @Mutation(() => Boolean)
    async confirmEmail(@Arg('token') token: string) {
        const userId = parseInt(
            (await redis.get(CONFIRM_PREFIX + token)) as string,
            10
        );

        if (!userId) {
            return false;
        }

        const x = await User.update({ id: userId }, { confirmed: true });
        await redis.del(CONFIRM_PREFIX + token);

        if (x.affected === 0) {
            return false;
        }

        return true;
    }
}
