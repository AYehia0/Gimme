import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber } from "class-validator" 

export class RegisterUserDto {
    @IsNotEmpty()
    name : string

    @IsNumber()
    age : number

    @IsNotEmpty()
    gender : string

    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsPhoneNumber("EG")
    @IsNotEmpty()
    phone : string

    @IsNotEmpty()
    password : string

}
