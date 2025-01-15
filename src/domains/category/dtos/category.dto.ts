import { IsNumber, IsPositive, IsString } from "class-validator";
import { Category } from "../entities/category.entity";


export class CreateCategoryDTO {
    @IsNumber()
    @IsPositive()
    id!: number;

    @IsString()
    name!: string;
}

export class UpdateCategoryDTO {

    @IsString()
    name!: string;
}

export class ResponseCategoryDTO {
    id!: number;
    name!: string;
    constructor(entity: Category) {
        this.id = entity.id;
        this.name = entity.name;
    }
}