import { InputType, Field } from 'type-graphql';

@InputType()
export class RegisterDto {
    @Field()
    name: string;
    @Field()
    email: string;
    @Field()
    password: string;
}

@InputType()
export class LoginDto {
    @Field()
    email: string;
    @Field()
    password: string;
}
