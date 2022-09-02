import { getDataType } from '../src/base';

describe('校验获取数据类型函数', () => {
    const testArr = [123];
    const testObj = {};
    const testFn = () => {};
    const map = new Map([
        ['', 'string'],
        [0, 'number'],
        [testArr, 'array'],
        [testObj, 'object'],
        [null, 'null'],
        [undefined, 'undefined'],
        [testFn, 'function'],
    ]);
    test('判断返回string', () => {
        const testData = '';
        const result = map.get(testData);
        expect(getDataType(testData)).toEqual(result);
    });
    test('判断返回number', () => {
        const testData = 0;
        const result = map.get(testData);
        expect(getDataType(testData)).toEqual(result);
    });
    test('判断返回array', () => {
        const testData = testArr;
        const result = map.get(testData);
        expect(getDataType(testData)).toEqual(result);
    });
    test('判断返回object', () => {
        const testData = testObj;
        const result = map.get(testData);
        expect(getDataType(testData)).toEqual(result);
    });
    test('判断返回null', () => {
        const testData = null;
        const result = map.get(testData);
        expect(getDataType(testData)).toEqual(result);
    });
    test('判断返回undefined', () => {
        const testData = undefined;
        const result = map.get(testData);
        expect(getDataType(testData)).toEqual(result);
    });
    test('判断返回function', () => {
        const testData = testFn;
        const result = map.get(testData);
        expect(getDataType(testData)).toEqual(result);
    });
});
