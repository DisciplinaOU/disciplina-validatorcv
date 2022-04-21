// @flow
/*
* Basic HTTP service. It imports Axios as main AJAX library.
* You can define BASE href url.
* HttpService class creates an axios instance with base configuration.
* Each class method decorates standard ajax calls to API with given arguments.
* Each async/await forwards response to dataHandler method which extract 'data' field in JSON response.
* There is no general error handler so ypu should handle server exceptions in individual service implemented.
* All Methods and arguments are type checked with Flow
* */
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Error, IHttpService, ResponseType } from './Http.type';

const BASE = `/api/certificates/v1`;

class HttpService implements IHttpService {
  httpService: typeof axios;

  constructor(axiosService: AxiosInstance) {
    this.httpService = axiosService.create({
      baseURL: BASE
    });
  }

  _makeBaseOptions(): any {
    return {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false
    };
  }

  async get(url: string, options): Promise<ResponseType | Error> {
    const response: ResponseType = await this.httpService.get(url, {
      ...this._makeBaseOptions(),
      ...options
    });

    return this.dataHandler(response);
  }

  async put(url: string, data: any, options): Promise<ResponseType | Error> {
    const response: ResponseType = await this.httpService.put(url, data, {
      ...this._makeBaseOptions(),
      ...options
    });

    return this.dataHandler(response);
  }

  async post(url: string, data: any, options): Promise<ResponseType | Error> {
    const response: ResponseType = await this.httpService.post(url, data, {
      ...this._makeBaseOptions(),
      ...options
    });

    return this.dataHandler(response);
  }

  // async post(url: string, data?: any): Promise<ResponseType | Error> {
  //   const response: ResponseType = await this.httpService.post(url, data, this._makeBaseOptions());
  //   return this.dataHandler(response);
  // }
  //
  // async patch(url: string, data: {}): Promise<ResponseType | Error> {
  //   const response: ResponseType = await this.httpService.patch(url, data, this._makeBaseOptions());
  //   return this.dataHandler(response);
  // }
  //
  // async delete(url: string): Promise<ResponseType | Error> {
  //   const response: ResponseType = await this.httpService.delete(url, this._makeBaseOptions());
  //   return this.dataHandler(response);
  // }

  dataHandler(response: ResponseType): any {
    return response.data;
  }
}

export default new HttpService(axios);
