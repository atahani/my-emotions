import { IsEmail, IsNotEmpty } from 'class-validator'

export class SignUpTestUserInput {
    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string

    @IsEmail()
    email: string
}
