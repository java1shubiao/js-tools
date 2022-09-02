import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const defaultRequestInterceptor = (request: any): AxiosRequestConfig => {
    return request;
};

const defaultResponseInterceptor = (response: any): AxiosResponse<any> | Promise<AxiosResponse<any>> => {
    const successCode = [200, 204, 304];
    if (successCode.includes(response.status)) {
        return response.data;
    }
    return response;
};

export const setInterceptors = (instance: any, requestInterceptor: any, responseInterceptor: any) => {
    const cancelRequest = instance.interceptors.request.use(requestInterceptor, (err: any) =>
        Promise.reject(err.response),
    );
    const cancelResponse = instance.interceptors.response.use(responseInterceptor, (err: any) => {
        const response = err.response;
        const errMessage = err.message;
        if (response) {
            return Promise.reject(response);
        }
        let temp = {
            status: 499,
            statusText: err,
        };
        if (errMessage === 'Network Error') {
            temp.status = 444;
            temp.statusText = '网络连接已断开';
        }
        return Promise.reject(temp);
    });
    return {
        instance,
        requestInterceptor: cancelRequest,
        responseInterceptor: cancelResponse,
    };
};

export const createDefaultInstance = (config: object) => {
    const instance: AxiosInstance = axios.create(config);
    setInterceptors(instance, defaultRequestInterceptor, defaultResponseInterceptor);
    return instance;
};
