import { Document, Types } from 'mongoose';
export type MovieDocument = Movie & Document;
export declare class Movie {
    title: string;
    publishingYear: number;
    poster: string;
    userId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const MovieSchema: import("mongoose").Schema<Movie, import("mongoose").Model<Movie, any, any, any, Document<unknown, any, Movie> & Movie & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Movie, Document<unknown, {}, import("mongoose").FlatRecord<Movie>> & import("mongoose").FlatRecord<Movie> & {
    _id: Types.ObjectId;
}>;
