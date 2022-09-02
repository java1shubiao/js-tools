import * as objectUtils from './objectUtils';
import * as base from './base';
import Request from './request';

// 获取数据类型
export default {
    ...base,
    ...objectUtils,
    RequestUtil: Request,
};

export * from './objectUtils';
export const RequestUtil = Request;
