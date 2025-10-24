"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const movie_schema_1 = require("./schemas/movie.schema");
let MoviesService = class MoviesService {
    constructor(movieModel) {
        this.movieModel = movieModel;
    }
    async create(createMovieDto, userId) {
        const createdMovie = new this.movieModel({
            ...createMovieDto,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        return createdMovie.save();
    }
    async findAll(userId, query) {
        const { page = 1, limit = 8, search, year } = query;
        const skip = (page - 1) * limit;
        const filter = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
        if (year) {
            filter.publishingYear = year;
        }
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
    async findOne(id, userId) {
        const movie = await this.movieModel
            .findOne({ _id: id, userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        if (!movie) {
            throw new common_1.NotFoundException('Movie not found');
        }
        return movie;
    }
    async update(id, updateMovieDto, userId) {
        const movie = await this.movieModel
            .findOneAndUpdate({ _id: id, userId: new mongoose_2.Types.ObjectId(userId) }, updateMovieDto, { new: true })
            .exec();
        if (!movie) {
            throw new common_1.NotFoundException('Movie not found');
        }
        return movie;
    }
    async remove(id, userId) {
        const result = await this.movieModel
            .deleteOne({ _id: id, userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Movie not found');
        }
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(movie_schema_1.Movie.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MoviesService);
//# sourceMappingURL=movies.service.js.map