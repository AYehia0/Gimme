import { IsPhoneNumber, IsOptional } from "class-validator" 

export class EditUserDto {
    @IsOptional()
    name: string

    @IsOptional()
    age : number

    @IsOptional()
    gender : string

    @IsPhoneNumber("EG")
    @IsOptional()
    phone : string

    @IsOptional()
    password : string

}
