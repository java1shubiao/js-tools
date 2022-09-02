export const getDataType = (data: any): string => {
    const fn = Object.prototype.toString;
    return fn.call(data).slice(8, -1).toLowerCase();
};
