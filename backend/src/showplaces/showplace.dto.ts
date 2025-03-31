import {
  IsString,
  IsNumber,
  IsIn,
  IsNotEmpty,
  IsUrl,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateShowplaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  rating: number;

  @IsUrl()
  imageUrl: string;

  @IsString()
  location: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsIn(['planned', 'visited'])
  status: 'planned' | 'visited' = 'planned';
}

export class UpdateShowplaceDto extends CreateShowplaceDto {}
