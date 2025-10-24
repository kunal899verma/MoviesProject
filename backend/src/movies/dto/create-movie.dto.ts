import { IsString, IsNumber, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Movie title',
    example: 'The Matrix',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Movie publishing year',
    example: 1999,
    minimum: 1888,
    maximum: 2100,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1888) // First movie ever made
  @Max(2100) // Reasonable future limit
  publishingYear: number;

  @ApiPropertyOptional({
    description: 'Movie poster URL',
    example: 'https://example.com/poster.jpg',
  })
  @IsOptional()
  @IsString()
  poster?: string;
}
