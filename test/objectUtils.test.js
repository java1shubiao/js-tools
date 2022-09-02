import { isObject, deepClone, mergeObject } from '../src/objectUtils';

describe('开始测试objectUtils中的工具函数', () => {
    test('isObject传入对象返回为true', () => {
        expect(isObject({})).toBeTruthy();
    });

    test('isObject传入null返回为false', () => {
        expect(isObject(null)).toBeFalsy();
    });

    test('deepClone返回为对象', () => {
        const result = deepClone({});
        const isObj = isObject(result);
        expect(isObj).toBeTruthy();
    });

    test('deepClone解决了对象引用关系', () => {
        const testObj = {
            a: {
                b: {
                    d: 1,
                    f: 'xxx',
                },
                c: 2,
            },
            arr: [undefined, null, '333', [1, 2, 3]],
        };
        const result = deepClone(testObj);
        testObj.a.c = 'aaa';
        testObj.a.b.d = '333';
        testObj.arr[1] = 'hhh';
        delete testObj.a.b.f;
        expect(result.a.c).not.toBe(testObj.a.c);
        expect(result.a.b.d).not.toBe(testObj.a.b.d);
        expect(result.a.b).toHaveProperty('f');
        expect(result.arr[1]).not.toBe(testObj.arr[1]);
        expect(result.arr[1]).toBeNull();
        expect(result.arr[0]).toBeUndefined();
    });
    test('mergeObject合并两个对象', () => {
        const mockFn = jest.fn((o1, o2) => mergeObject(o1, o2));
        const obj1 = {
            a: 1,
            v: {
                c: 3,
            },
        };
        const obj2 = {
            a: 666,
            b: 3,
            d: {
                a: 1,
            },
        };
        const result = mockFn(obj1, obj2);
        expect(mockFn.mock.calls.length).toBe(1);
        expect(mockFn.mock.calls[0][0]).toEqual(obj1);
        expect(mockFn.mock.calls[0][1]).toEqual(obj2);
        expect(result).toMatchObject(obj1);
        expect(result).toMatchObject(obj2);
        expect(result.a).toEqual(666);
    });
    test('mergeObject测试合并数组', () => {
        const mockFn = jest.fn((o1, o2) => mergeObject(o1, o2));
        const obj1 = {
            arr: [1, 2, 3],
        };
        const obj2 = {
            arr: [1, 2, 3, [1, 2, 3], 4, { a: 2, b: 2, c: [1, 2, 3] }],
        };
        const result = mockFn(obj1, obj2);
        expect(result).toHaveProperty('arr');
        expect(result.arr[3]).toEqual([1, 2, 3]);
        expect(result.arr[5]).toEqual({ a: 2, b: 2, c: [1, 2, 3] });
    });
});
