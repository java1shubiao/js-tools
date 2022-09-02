export const ERROR_MSG_MAP: Map<number, string> = new Map([
    [500, '服务器异常，请联系管理员处理'],
    [404, '找不到指定服务，请确认后重试'],
    [444, '网络连接已断开，请检查网络环境'],
    [499, '请求失败'],
]);
