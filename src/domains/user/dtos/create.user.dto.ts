import { IsEmail, IsOptional, IsString, isString, Length } from "class-validator";


export class CreateUserDTO{
    @IsString()
    @Length(1,30)
    nickname!: string;

    @IsEmail()
    email!: string;

    //@IsOptional()
    @IsString()
    phone!: string;

    @IsString()
    profileImage: string = "http://k.kakaocdn.net/dn/iQ0tJ/btsGiZtOW9n/KtOXXrKf98a5yvbXX6Pf40/img_640x640.jpg"
}