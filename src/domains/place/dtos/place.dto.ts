import { IsString, IsNumber, IsArray, IsDate, IsOptional, MaxLength, IsUrl, IsBoolean, IsInt, IsEnum } from 'class-validator';
import { Place } from '../entities/place.entity';
import { DeepPartial } from 'typeorm';
import { CONDITION_OWNER } from '@/config/enum_control';

export class CreatePlaceDTO {
  @IsString()
  @MaxLength(50)
  name!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lon!: number;

  @IsDate()
  start_date!: Date;

  @IsDate()
  end_date!: Date;

  @IsOptional()
  @IsUrl({}, { each: true })
  @IsArray()
  photo_s3_url?: string[];

  @IsString({ each: true }) // each -> 배열의 각 요소가 문자열인지 검사
  @IsArray()
  day_of_the_week!: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;

  @IsString()
  @IsOptional()
  @IsArray()
  tag?: string[];

  @IsBoolean()
  owner!: boolean; // 제보자 false 작성자 true

  @IsNumber()
  user_id!: number;

  @IsNumber()
  category_id!: number;

  @IsNumber()
  subcategory_id!: number;

  @IsNumber({}, { each: true })
  @IsArray()
  charge_ids!: number[];

}

export class UpdatePlaceDTO {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lon?: number;

  @IsOptional()
  @IsDate()
  start_date?: Date;

  @IsOptional()
  @IsDate()
  end_date?: Date;

  @IsOptional()
  @IsUrl({}, { each: true })
  @IsArray()
  photo_s3_url?: string[];

  @IsString({ each: true })
  @IsArray()
  day_of_the_week?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;

  @IsString()
  @IsOptional()
  @IsArray()
  tag?: string[];

  @IsOptional()
  @IsInt()
  exist_count?: number;

  @IsOptional()
  @IsInt()
  non_exist_count?: number;

  @IsOptional()
  @IsBoolean()
  owner?: boolean;

  @IsOptional()
  @IsNumber()
  category_id?: number;

  @IsOptional()
  @IsNumber()
  subcategory_id?: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  @IsArray()
  charge_ids?: number[];
}

export class ResponsePlaceDTO {
  id!: number;
  name!: string;
  lat!: number;
  lon!: number;
  updated_at!: Date;
  start_date!: Date;
  end_date!: Date;
  photo_s3_url?: string[];
  day_of_the_week!: string[];
  comment?: string;
  tag?: string[];
  exist_count!: number;
  non_exist_count!: number;
  owner!: boolean;
  user!: {
    id: number,
    nickname: string,
  }
  category!: {
    id: number,
    name: string,
  };
  subcategory!: {
    id: number,
    name: string,
  };
  charges!: {
    id: number,
    name: string,
  }[];

  constructor(entity: Place) {
    this.id = entity.id;
    this.name = entity.name;
    this.lat = entity.lat;
    this.lon = entity.lon;
    this.updated_at = entity.updated_at;
    this.start_date = entity.start_date;
    this.end_date = entity.end_date;
    this.photo_s3_url = entity.photo_s3_url;
    this.day_of_the_week = entity.day_of_the_week;
    this.comment = entity.comment;
    this.tag = entity.tag;
    this.exist_count = entity.exist_count;
    this.non_exist_count = entity.non_exist_count;
    this.owner = entity.owner;
    this.user = {
      id: entity.user.id,
      nickname: entity.user.nickname,
    }
    this.category = {
      id: entity.category.id,
      name: entity.category.name,
    }
    this.subcategory = {
      id: entity.subcategory.id,
      name: entity.subcategory.name,
    }
    this.charges = entity.charges.map((charge) => ({
      id: charge.id,
      name: charge.name,
    })) || [];
  }
}

export class FindPlaceByFiltersDTO {
  @IsNumber()
  page: number = 1;

  @IsEnum(["DESC", "ASC"])
  sort_order: "DESC" | "ASC" = "DESC";

  @IsBoolean()
  perfect_match: boolean = false;

  @IsEnum(CONDITION_OWNER)
  @IsOptional()
  owner: CONDITION_OWNER = CONDITION_OWNER.ALL;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[]

  @IsNumber()
  @IsOptional()
  category_id?: number

  @IsNumber()
  @IsOptional()
  subcategory_id?: number

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  charge_ids?: number[];

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsNumber()
  @IsOptional()
  lon?: number;

  @IsDate()
  @IsOptional()
  start_date?: Date;

  @IsDate()
  @IsOptional()
  end_date?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  day_of_the_weeks?: string[];

  @IsNumber()
  @IsOptional()
  exist_count_min?: number;
}
