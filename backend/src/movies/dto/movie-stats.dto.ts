import { ApiProperty } from '@nestjs/swagger';

export class MovieStatsDto {
  @ApiProperty({ description: 'Total number of movies' })
  totalMovies: number;

  @ApiProperty({ description: 'Average publishing year' })
  averageYear: number;

  @ApiProperty({ description: 'Oldest movie year' })
  oldestMovieYear: number;

  @ApiProperty({ description: 'Newest movie year' })
  newestMovieYear: number;

  @ApiProperty({ description: 'Movies by decade', type: 'object' })
  moviesByDecade: Record<string, number>;

  @ApiProperty({ description: 'Most recent movies', isArray: true })
  recentMovies: Array<{
    title: string;
    publishingYear: number;
    createdAt: Date;
  }>;
}
