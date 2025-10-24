import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';

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
}
