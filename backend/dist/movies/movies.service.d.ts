import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { MovieStatsDto } from './dto/movie-stats.dto';
export declare class MoviesService {
    private movieModel;
    constructor(movieModel: Model<MovieDocument>);
    create(createMovieDto: CreateMovieDto, userId: string): Promise<MovieDocument>;
    findAll(userId: string, query: QueryMovieDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, MovieDocument> & Movie & import("mongoose").Document<any, any, any> & {
            _id: Types.ObjectId;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findOne(id: string, userId: string): Promise<MovieDocument>;
    update(id: string, updateMovieDto: UpdateMovieDto, userId: string): Promise<MovieDocument>;
    remove(id: string, userId: string): Promise<void>;
    getStats(userId: string): Promise<MovieStatsDto>;
}
