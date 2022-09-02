export const assert = (condition: boolean, msg: string): void => {
    if (condition) {
        throw new Error(msg);
    }
};
