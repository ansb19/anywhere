import { IsInt, IsOptional, IsString, MaxLength } from "class-validator";


export class CreateReviewDto {
    @IsInt()
    user_id!: number;

    @IsInt()
    place_id!: number;

    @IsString()
    @MaxLength(500)
    content!: string;
}

export class UpdateReviewDto {
    @IsOptional()
    @IsInt()
    user_id?: number;

    @IsOptional()
    @IsInt()
    place_id?: number;

    @IsOptional()
    @IsString()
    @MaxLength(500)
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
        nickname: string;
        lat: number;
        lon: number;
    }
}