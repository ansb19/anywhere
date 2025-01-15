import { IsNumber, IsPositive, IsString } from "class-validator";
import { ResponseCategoryDTO } from "./category.dto";
import { SubCategory } from "../entities/sub-category.entity";


export class CreateSubCategoryDTO {
    @IsNumber()
    @IsPositive()
    id!: number;
    @IsString()
    name!: string;

    @IsNumber()
    @IsPositive()
    category_id!: number;
}

export class UpdateSubCategoryDTO {
    @IsString()
    name?: string;

    @IsNumber()
    @IsPositive()
    category_id?: number;
}

export class ResponseSubCategoryDTO {
    id!: number;
    name!: string;
    category!: ResponseCategoryDTO;

    constructor(entity: SubCategory) {
        this.id = entity.id;
        this.name = entity.name;
        this.category = entity.category;
    }
}