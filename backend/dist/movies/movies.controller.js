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
exports.MoviesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const movies_service_1 = require("./movies.service");
const create_movie_dto_1 = require("./dto/create-movie.dto");
const update_movie_dto_1 = require("./dto/update-movie.dto");
const query_movie_dto_1 = require("./dto/query-movie.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let MoviesController = class MoviesController {
    constructor(moviesService) {
        this.moviesService = moviesService;
    }
    create(createMovieDto, req) {
        return this.moviesService.create(createMovieDto, req.user.userId);
    }
    uploadPoster(file) {
        return {
            filename: file.filename,
            path: `/uploads/${file.filename}`,
        };
    }
    findAll(query, req) {
        return this.moviesService.findAll(req.user.userId, query);
    }
    findOne(id, req) {
        return this.moviesService.findOne(id, req.user.userId);
    }
    update(id, updateMovieDto, req) {
        return this.moviesService.update(id, updateMovieDto, req.user.userId);
    }
    remove(id, req) {
        return this.moviesService.remove(id, req.user.userId);
    }
};
exports.MoviesController = MoviesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new movie' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Movie created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movie_dto_1.CreateMovieDto, Object]),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload-poster'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('poster', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                poster: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload movie poster' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Poster uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                filename: { type: 'string' },
                path: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "uploadPoster", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all user movies with pagination' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Movies retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { type: 'object' } },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' },
                        hasNext: { type: 'boolean' },
                        hasPrev: { type: 'boolean' },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_movie_dto_1.QueryMovieDto, Object]),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific movie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movie found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Movie not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a movie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movie updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Movie not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_movie_dto_1.UpdateMovieDto, Object]),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a movie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movie deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Movie not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "remove", null);
exports.MoviesController = MoviesController = __decorate([
    (0, swagger_1.ApiTags)('Movies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movies_service_1.MoviesService])
], MoviesController);
//# sourceMappingURL=movies.controller.js.map