
// export const baseUrl = '/api/v1.3/graph-connections';
// export const baseUrl = `http://172.24.194.92:8089/api/v1.3/graphspaces`;
export const baseUrl = `/api/v1.3/graphspaces`;

export type dict<T> = Record<string, T>;

export interface responseData<T> {
  status: number;
  data: T;
  message: string;
}
