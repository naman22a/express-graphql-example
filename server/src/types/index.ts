import { Request, Response } from 'express';
import { ObjectType, Field } from 'type-graphql';

export interface MyContext {
    req: Request;
    res: Response;
}

@ObjectType()
export class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
export class AuthResponse {
    @Field(() => Boolean, { nullable: true })
    ok?: boolean;

    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}
