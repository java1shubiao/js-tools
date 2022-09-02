import mockAxios from 'jest-mock-axios';
import RequestUtil from '../src/request';

const getMockResponse = (id = '') => {
    const data = [
        { id: 1, name: 'user1', phone: '13333333331' },
        { id: 2, name: 'user2', phone: '13333333332' },
        { id: 3, name: 'user3', phone: '13333333333' },
    ];
    const result = {
        code: 0,
        msg: 'ok',
    };
    let findResult = data.find((item) => item.id === id);
    findResult = JSON.parse(JSON.stringify(findResult || data));
    result.data = findResult;
    return result;
};
const getFailResponse = (code = 2, msg = '啊哦~出现错误了') => {
    const mockResponse = getMockResponse();
    mockResponse.code = code;
    mockResponse.msg = msg;
    return mockResponse;
};
const mockUrl = 'https://example.xiaoe-tech.com';
afterEach(() => {
    mockAxios.reset();
});
describe('开始测试请求工具库request', () => {
    test('测试实例创建', () => {
        const handleError = () => {
            // to do error someting
        };
        const instance = new RequestUtil({
            isJsonParams: true,
            handleError,
            showError: false,
        });
        expect(instance.handleError).toBeInstanceOf(Function);
        expect(instance.defaultConfig.isJsonParams).toBeTruthy();
        expect(instance.defaultConfig.showError).toBeFalsy();
        expect(instance.defaultConfig.axios).toEqual({
            headers: {},
        });
    });
    test('测试get成功的请求', async () => {
        // get
        const handleError = jest.fn();
        const instance = new RequestUtil({
            handleError,
        });
        const getPromise = instance.get({
            url: mockUrl,
            params: {
                id: 1,
            },
        });
        const forGetMockResponse = getMockResponse(1);
        const getRequestInfo = mockAxios.lastReqGet();
        // 判断请求方法
        expect(getRequestInfo.method).toEqual('get');
        // 判断请求地址
        expect(getRequestInfo.url).toEqual(mockUrl);
        // 判断传参是否正确
        expect(getRequestInfo.config.params.id).toEqual(1);
        mockAxios.mockResponse(forGetMockResponse);
        // expect(mockAxios.get).toHaveBeenCalledWith('https://example.xiaoe-tech.com', {params: mockGetParams})
        const { data, hasError, error, response } = await getPromise;
        expect(getPromise).toBeInstanceOf(Promise);
        expect(data).toEqual(forGetMockResponse.data);
        expect(hasError).toBeFalsy();
        expect(error).toEqual({ code: 0, msg: 'ok' });
        expect(handleError).not.toHaveBeenCalled();
        expect(response).toMatchObject(forGetMockResponse);
    });
    test('测试post成功的请求', async () => {
        const handleError = jest.fn();
        const instance = new RequestUtil({
            handleError,
        });
        const postPromise = instance.post({
            url: mockUrl,
            params: {
                id: 2,
            },
        });
        const forPostMockResponse = getMockResponse(2);
        const postRequestInfo = mockAxios.lastReqGet();
        expect(postRequestInfo.method).toEqual('post');
        expect(postRequestInfo.url).toEqual(mockUrl);
        expect(postRequestInfo.data).toEqual('id=2');
        mockAxios.mockResponse(forPostMockResponse);
        const { data, hasError, error, response } = await postPromise;
        expect(postPromise).toBeInstanceOf(Promise);
        expect(data).toEqual(forPostMockResponse.data);
        expect(hasError).toBeFalsy();
        expect(error).toEqual({ code: 0, msg: 'ok' });
        expect(handleError).not.toHaveBeenCalled();
        expect(response).toMatchObject(forPostMockResponse);
    });
    test('测试get失败的请求', async () => {
        const handleError = jest.fn();
        const instance = new RequestUtil({
            handleError,
        });
        const getPromise = instance.get({
            url: mockUrl,
        });
        const msg = '啊哦~get接口报错了';
        const code = 666;
        mockAxios.mockResponse(getFailResponse(code, msg));
        const { hasError, error } = await getPromise;
        const truthyError = { code, msg };
        expect(hasError).toBeTruthy();
        expect(handleError).toHaveBeenCalled();
        expect(handleError.mock.calls.length).toBe(1);
        expect(error).toEqual(truthyError);
        expect(handleError).toHaveBeenCalledWith(truthyError);
    });
    test('测试post失败的请求', async () => {
        const handleError = jest.fn();
        const instance = new RequestUtil({
            handleError,
        });
        const getPromise = instance.post({
            url: mockUrl,
        });
        const msg = '啊哦~post接口报错了';
        const code = 777;
        mockAxios.mockResponse(getFailResponse(code, msg));
        const { hasError, error } = await getPromise;
        const truthyError = { code, msg };
        expect(hasError).toBeTruthy();
        expect(handleError).toHaveBeenCalled();
        expect(handleError.mock.calls.length).toBe(1);
        expect(error).toEqual(truthyError);
        expect(handleError).toHaveBeenCalledWith(truthyError);
    });
});
