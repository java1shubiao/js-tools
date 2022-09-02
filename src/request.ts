import qs from 'qs';
import { assert } from './utils/index';
import { createDefaultInstance } from './utils/axios';
import { isObject, deepClone, mergeObject } from './objectUtils';
import { getDataType } from './base';
import { ERROR_MSG_MAP } from './constants/config';

interface RequestConfig {
    url: string;
    params?: object;
    showError: boolean;
    isJsonParams?: boolean;
    axios?: any;
    beforeRequest?: any;
    afterRequest?: any;
    isAsync?: boolean;
}
interface HandleErrorParam {
    msg: string;
    code: string | number;
}
class RequestUtil {
    public defaultConfig: object;

    protected errorMap: Map<number, string>;

    protected handleError: (config: HandleErrorParam) => void;

    constructor(config: any) {
        this.errorMap = (config && config.errorMap) || ERROR_MSG_MAP;
        this.handleError = (config && config.handleError) || (() => {});

        this.defaultConfig = {
            showError: true,
            isJsonParams: false, // post默认使用的是表单数据的键值对 key/value 的构造方式，这个设置为true就会改为json对象的方式传参给后端
            axios: {
                headers: {},
            },
        };
        this.defaultConfig = mergeObject(this.defaultConfig, config);
    }

    protected async makeService(config: RequestConfig, method: string) {
        const { url, params, showError, isJsonParams, axios } = config;
        let result = {};
        const messageFn = this.handleError;
        const defaultErrorMsg = '网络错误，请稍后再试';
        let data: any = params;
        try {
            if (method === 'get') {
                data = { params: data };
            }
            if (!isObject(axios.headers)) {
                axios.headers = {};
            }
            if (isJsonParams) {
                axios.headers['Content-type'] = 'application/json';
            }
            if (!isJsonParams && method === 'post') {
                axios.headers['Content-type'] = 'application/x-www-form-urlencoded';
                data = qs.stringify(data as any);
            }
            const instance: any = createDefaultInstance(axios);
            const response = await instance[method](url, data);
            const { code, msg, data: responseData } = response;
            // eslint-disable-next-line
            if (code == 0) {
                result = {
                    data: responseData,
                    hasError: false,
                    error: {
                        code,
                        msg,
                        nonBusiness: false,
                    },
                    response,
                };
            } else {
                if (showError) {
                    messageFn({ msg: msg || defaultErrorMsg, code });
                }
                result = {
                    hasError: true,
                    error: {
                        code,
                        msg,
                        nonBusiness: false,
                    },
                    response,
                };
            }
            return result;
        } catch (error) {
            const { status } = error;
            let customMsg = this.errorMap.get(status);
            customMsg = customMsg || defaultErrorMsg;
            if (showError) {
                messageFn({ msg: customMsg, code: status });
            }
            result = {
                hasError: true,
                error: {
                    msg: customMsg,
                    code: status,
                    detail: error,
                    nonBusiness: true, // 该字段表示错误是由浏览器触发的错误，而不是因为接口返回的业务特性的错误
                },
            };
            return result;
        }
    }

    private checkOptions(config: any) {
        assert(!config.url || getDataType(config.url) !== 'string', '请求地址不允许为空！');
        assert(config.showError && getDataType(this.handleError) !== 'function', 'handleError必须传入一个函数');
    }

    async get(config: any) {
        let innerConfig = config;
        innerConfig = mergeObject(deepClone(this.defaultConfig), deepClone(config));
        this.checkOptions(innerConfig);
        const result = await this.makeService(innerConfig, 'get');
        return result;
    }

    async post(config: any) {
        let innerConfig = config;
        innerConfig = mergeObject(deepClone(this.defaultConfig), deepClone(config));
        this.checkOptions(innerConfig);
        const result = await this.makeService(innerConfig, 'post');
        return result;
    }
}

export default RequestUtil;
