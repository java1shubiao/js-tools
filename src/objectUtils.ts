// eslint-disable-next-line import/no-cycle
import { getDataType } from './base';

export const isObject = (data: any): boolean => {
    return getDataType(data) === 'object';
};

export const isFunction = (data: any): boolean => {
    return getDataType(data) === 'function';
};

export const isArray = (data: any): boolean => {
    if (isFunction(Array.isArray)) {
        return Array.isArray(data);
    }
    return getDataType(data) === 'array';
};

export const deepClone = (data: object | Array<any>) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const shouldClone = (data: any): boolean => isObject(data) || isArray(data);
    if (!shouldClone(data)) {
        return data;
    }
    let root = data;
    if (isObject(data)) {
        root = {};
    } else if (isArray(data)) {
        root = [];
    }
    const stack = [
        {
            parent: root,
            data,
            key: '',
        },
    ];
    while (stack.length) {
        const node = stack.pop();
        const space: any = node?.parent;
        const currentData: any = node?.data;
        const key = node?.key;
        let temp = space;
        if (key) {
            // eslint-disable-next-line
            temp = space[key] = isObject(currentData) ? {} : [];
        }
        Object.keys(currentData).forEach((k) => {
            const d = currentData[k];
            if (isObject(d) || Array.isArray(d)) {
                stack.push({
                    parent: temp,
                    data: d,
                    key: k,
                });
            } else {
                temp[k] = d;
            }
        });
    }
    return root;
};

export const mergeObject = (source: any, target: any): object => {
    const result = source;
    if ((isObject(result) && isObject(target)) || (Array.isArray(result) && Array.isArray(target))) {
        const keys = Object.keys(target);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const data = target[key];
            if (isObject(data)) {
                result[key] = mergeObject(isObject(result[key]) ? result[key] : {}, data);
                continue;
            }
            if (Array.isArray(data)) {
                result[key] = mergeObject(Array.isArray(result[key]) ? result[key] : [], data);
                continue;
            }
            result[key] = data;
        }
    }
    return result;
};
