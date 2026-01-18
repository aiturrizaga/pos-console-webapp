export interface ApiResponse<T> {
  code: any;
  message: string;
  data: T;
}

export interface Page<T> {
  content: T[],
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }
}
