import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { MovieStatsDto } from './dto/movie-stats.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async create(createMovieDto: CreateMovieDto, userId: string): Promise<MovieDocument> {
    const createdMovie = new this.movieModel({
      ...createMovieDto,
      userId: new Types.ObjectId(userId),
    });
    return createdMovie.save();
  }

  async findAll(userId: string, query: QueryMovieDto) {
    const { page = 1, limit = 8, search, year } = query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { userId: new Types.ObjectId(userId) };
    
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    
    if (year) {
      filter.publishingYear = year;
    }

    // Execute queries in parallel
    const [movies, total] = await Promise.all([
      this.movieModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.movieModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: movies,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string, userId: string): Promise<MovieDocument> {
    const movie = await this.movieModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();
      
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto, userId: string): Promise<MovieDocument> {
    const movie = await this.movieModel
      .findOneAndUpdate(
        { _id: id, userId: new Types.ObjectId(userId) },
        updateMovieDto,
        { new: true }
      )
      .exec();
      
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    
    return movie;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.movieModel
      .deleteOne({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();
      
    if (result.deletedCount === 0) {
      throw new NotFoundException('Movie not found');
    }
  }

  async getStats(userId: string): Promise<MovieStatsDto> {
    const userObjectId = new Types.ObjectId(userId);
    
    // Get all user movies for statistics
    const movies = await this.movieModel
      .find({ userId: userObjectId })
      .select('title publishingYear createdAt')
      .sort({ createdAt: -1 })
      .exec();

    if (movies.length === 0) {
      return {
        totalMovies: 0,
        averageYear: 0,
        oldestMovieYear: 0,
        newestMovieYear: 0,
        moviesByDecade: {},
        recentMovies: [],
      };
    }

    // Calculate statistics
    const years = movies.map(movie => movie.publishingYear);
    const totalMovies = movies.length;
    const averageYear = Math.round(years.reduce((sum, year) => sum + year, 0) / totalMovies);
    const oldestMovieYear = Math.min(...years);
    const newestMovieYear = Math.max(...years);

    // Group movies by decade
    const moviesByDecade: Record<string, number> = {};
    years.forEach(year => {
      const decade = Math.floor(year / 10) * 10;
      const decadeKey = `${decade}s`;
      moviesByDecade[decadeKey] = (moviesByDecade[decadeKey] || 0) + 1;
    });

    // Get 5 most recent movies
    const recentMovies = movies.slice(0, 5).map(movie => ({
      title: movie.title,
      publishingYear: movie.publishingYear,
      createdAt: movie.createdAt,
    }));

    return {
      totalMovies,
      averageYear,
      oldestMovieYear,
      newestMovieYear,
      moviesByDecade,
      recentMovies,
    };
  }
}
