import { IsBoolean, IsEmail, IsNumber, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, IsUrl, Length, Max, Min } from "class-validator";
import { User } from "../entities/user.entity";


export class CreateUserDTO {
    @IsPhoneNumber("KR")
    //@Length(10, 15) // 한국 기준
    phone!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @Length(1, 30)
    nickname!: string;

    @IsOptional()
    @IsUrl()
    profileImage: string = "http://k.kakaocdn.net/dn/iQ0tJ/btsGiZtOW9n/KtOXXrKf98a5yvbXX6Pf40/img_640x640.jpg"

    @IsString()
    @Length(3, 40)
    anywhere_id!: string;


    @Length(3, 30)
    @IsStrongPassword({
        'minLength': 8,
        'minLowercase': 1,
        'minNumbers': 1,
        'minSymbols': 1,
        'minUppercase': 1,
    })
    password!: string;

    constructor(part: Partial<CreateUserDTO>) {
        Object.assign(this, part);
    }
}

export class UpdateUserDTO {
    @IsOptional()
    @IsPhoneNumber("KR")
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Length(1, 30)
    nickname?: string;

    @IsOptional()
    @IsUrl()
    profileImage?: string;

    @IsOptional()
    @IsString()
    @Length(8, 255)
    password?: string;

}

export class AdminUpdateUserDTO {
    @IsOptional()
    @IsString()
    @Length(10, 15)
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Length(1, 30)
    nickname?: string;

    @IsOptional()
    @IsUrl()
    profileImage?: string;

    @IsOptional()
    @IsString()
    @Length(3, 40)
    anywhere_id?: string;

    @IsOptional()
    @IsString()
    @Length(8, 255)
    password?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(3)
    penalty_count?: number;

    @IsOptional()
    @IsBoolean()
    penalty_state!: boolean;
}

export class ResponseUserDTO {
    id!: number;
    phone!: string;
    email!: string;
    nickname!: string;
    profileImage!: string;
    penalty_count!: number;
    penalty_state!: boolean;
    created_at!: Date;
    updated_at!: Date;

    constructor(entity: User) {
        this.id = entity.id;
        this.nickname = entity.nickname;
        this.email = entity.email;
        this.phone = entity.phone;
        this.profileImage = entity.profileImage;
        this.penalty_count = entity.penalty_count;
        this.penalty_state = entity.penalty_state;
        this.created_at = entity.created_at;
        this.updated_at = entity.updated_at;
    }
}
