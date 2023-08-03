// import { IPagination, IPaginationPayload, PaginationPayloadSchema, PaginationPayloadSwaggerSchema } from './pagination';
// import { ExploreQueryPayloadSchema, IExploreQuery } from './query';

// export interface IExplorePayload {
//   pagination: IPaginationPayload;
//   query?: IExploreQuery;
//   include?: Record<string, any>;
//   select?: Record<string, any>;
// }

// export interface IExploreResponse<T> {
//   pagination: IPagination;
//   query?: IExploreQuery;
//   data: T[];
// }

// export class ExplorePayloadDto {
//   pagination: PaginationPayloadSchema.required(),
//   query: ExploreQueryPayloadSchema,
// }

// export const ExplorePayloadSwaggerSchema = {
//   explore: {
//     type: 'object',
//     properties: {
//       pagination: {
//         ...PaginationPayloadSwaggerSchema.pagination,
//         required: true,
//       },
//       query: {
//         type: 'object',
//       },
//     },
//   },
// };
