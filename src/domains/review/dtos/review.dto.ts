import { IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class CreateReviewDto {
    @IsInt()
    user_id!: number;

    @IsInt()
    place_id!: number;

    @IsString()
    @MaxLength(500)
    @MinLength(10)
    content!: string;
}

export class UpdateReviewDto {
    
    @IsOptional()
    @IsString()
    @MaxLength(500)
    @MinLength(10)
    content?: string;
}

export class ResponseReviewDto {
    id!: number;
    content!: string;
    created_at!: Date;
    updated_at!: Date;

    user!: {
        id: number;
        nickname: string;
        profileImage: string;
    }

    place!: {
        id: number;
        name: string;
        lat: number;
        lon: number;
    }
}