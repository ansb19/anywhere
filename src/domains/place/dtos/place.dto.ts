// dto/create-place.dto.ts
import { IsString, IsNumber, IsArray, IsDate, IsOptional, MaxLength } from 'class-validator';

export class CreatePlaceDTO {
  @IsString()
  @MaxLength(40)
  place_name!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lon!: number;

  @IsDate()
  start_date!: Date;

  @IsDate()
  end_date!: Date;

  @IsString()
  day_of_the_week!: string;

  @IsArray()
  @IsOptional()
  photo_s3_url?: string[];

  @IsArray()
  @IsOptional()
  tag?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}
