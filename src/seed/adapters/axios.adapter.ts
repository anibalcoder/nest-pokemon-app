import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

// export interface HttpAdapter {
//   get<T>(url: string): Promise<T>;
// }

@Injectable()
export class AxiosAdapter {
  private readonly axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    const { data } = await this.axios.get<T>(url);
    return data;
  }
}
