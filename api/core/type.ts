export interface ResponseType<T = unknown> {
  isSuccess: boolean;
  code: number;
  message: string;
  result?: T;
}

export interface GetPaginationResult<T> {
  hasNext: boolean;
  page: number;
  content: Array<T>;
  count?: number;
  countNum?: number;
  restCommentNum?: number;
}

export type BrandFlag = 'Y' | 'N';
