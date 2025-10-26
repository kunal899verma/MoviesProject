import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { MovieStatsDto } from './dto/movie-stats.dto';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    create(createMovieDto: CreateMovieDto, req: any): Promise<import("./schemas/movie.schema").MovieDocument>;
    uploadPoster(file: Express.Multer.File): {
        filename: string;
        path: string;
    };
    getStats(req: any): Promise<MovieStatsDto>;
    findAll(query: QueryMovieDto, req: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/movie.schema").MovieDocument> & import("./schemas/movie.schema").Movie & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
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
    findOne(id: string, req: any): Promise<import("./schemas/movie.schema").MovieDocument>;
    update(id: string, updateMovieDto: UpdateMovieDto, req: any): Promise<import("./schemas/movie.schema").MovieDocument>;
    remove(id: string, req: any): Promise<void>;
}
