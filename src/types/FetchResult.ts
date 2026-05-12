export interface FetchResult<T> {
  data: T | null,
  loading: boolean,
  error: Error | null
}