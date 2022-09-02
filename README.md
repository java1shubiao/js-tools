## 安装
```
npm i cnpm -g --registry=https://registry.npm.taobao.org
cnpm config set registry=http://111.230.199.61:6888/
cnpm i @xiaoe/edu_js_tools
```
## 目录结构
```
edu_js_tools  
├─.babelrc
├─.browserslistrc
├─.editorconfig
├─.eslintignore
├─.eslintrc.js
├─.gitignore
├─.gitlab-ci.yml
├─jest.config.js // 单元测试配置文件
├─package-lock.json
├─package.json
├─prettier.config.js // 代码自动格式化配置
├─README.md
├─rollup.config.js
├─tsconfig.json
├─test // 单元测试目录
|  ├─base.test.js
|  ├─objectUtils.test.js
|  └request.test.js
├─src
|  ├─base.ts
|  ├─index.ts
|  ├─objectUtils.ts
|  ├─request.ts
|  ├─__mocks__  // 拦截请求的目录，勿动
|  |     └axios.js
|  ├─utils
|  |   ├─axios.ts
|  |   └index.ts
|  ├─constants
|  |     └config.ts
```

## 如何使用
### 常见工具集
```
// 单个导入
import { xxx } from '@xiaoe/edu_js_tools'

// 全量导入
import Utils from '@xiaoe/edu_js_tools'
```
### axios封装方法
#### 使用说明
```
// 1、在业务侧创建目录例如：utils，创建文件request.js
// 2、创建实例然后导出

// ...request.js
import RequestUtil from '@xiaoe/edu_js_tools/request'
const instance = new RequestUtil({
    handleError({code, msg}) {
        // 在这里统一处理错误，一般弹窗提示
    }
})
export default instance

// ...index.vue
import Request from '@/utils/request'
// 正常使用
async handleFetch() {
    const { data, hasError, error } = await Request.get({
        url: 'xxx',
        // post也使用这个key传参
        params: {
            a: 1,
            b: 2
        }
    })
    // 接口返回不为0都会调用到handleError，在创建实例时传入后这里就不用弹窗了
    if(hasError) {
        // to do someting
        return
    }
    // fetch success
}

// 覆盖全局配置
async handleFetch() {
    const { data, hasError, error, response } = await Request.post({
        url: 'xxx',
        params: {
            c: 2,
            d: 4
        },
        showError: false // 本次请求不调用全局错误处理方法
        // or
        handleError({code, msg}) {
            // 本次请求自定义的错误处理
        }
    })
}
```
在utils/request.js中实例化传入的配置最好是所有请求通用的配置，例如post请求是否需要改变传参模式为 **a=1&b=2** 的格式，此项配置鉴于B端多数接口需要这样传参，默认为true，可以自行在业务侧更改，其他地方调用get/post方法时除了传入接口地址和请求参数以外也可以传入实例化时传入的配置，内部会进行深度合并配置，不影响全局配置，只对当前请求生效

#### 配置说明
##### errorMap（不支持在get和post中重定义）
请求发生错误时的提示信息映射，需传入Map类型，默认值为  
```
new Map([
    [500, '服务器异常，请联系管理员处理'],
    [404, '找不到指定服务，请确认后重试'],
])
```
##### showError
是否触发handleError，默认为true
##### handleError
当调用请求返回的code码不为0或者请求调用失败时触发
```
const request = new RequestUtil({
    handleError({code, msg}) {
        // 错误处理
    }
})

// or

request.get({
    handleError({code, msg}) {
        // 错误处理
    }
})
```
##### isJsonParams
post请求默认为 a=1&b=2 格式传参，该字段设置为true改为json格式传参
##### axios
axios请求配置，具体配置参考 https://github.com/axios/axios#request-config
## 如何维护
项目整体技术栈使用typescript开发，加入jest进行单元测试，作者目前还未入门，不太规范，在提交变更之前，尽量为本次更改添加一下单元测试和补充文档，避免影响现网业务使用，在提交代码之前跑一下如下两个命令
```
npm run lint:fix
npm run test
```
显示无异常后修改package.json的版本号后提交代码即可，版本号目前填写规范为
```
// 注：以下 0321 表示的是迭代的deadline（即上线时间，不算延期时间哈，毕竟你也不知道项目延不延期，逃）
从master分支拉下来的版本号假设是 1.0.1

// 项目立项
开发 or 测试环境 1.1.0-t0321  中位加1，后位清0，每次提交变更时更改第3位
内灰 or 外灰环境 1.1.xx-r0321 注意这里的上线时间前的t变为了r
项目全网 1.1.xx + 1 去掉r后第三位加1

// 现网工单
假设你的工单上线日期是 3月28日
开发合并主干自测 1.0.2-d0328 第3位加1
工单状态流转为允许合并master后 1.0.2
```