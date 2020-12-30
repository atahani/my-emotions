import { IsEmail } from 'class-validator'

export class LoginTestUserInput {
    @IsEmail()
    email: string
}
