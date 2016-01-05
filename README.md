[![Dependency Status](https://david-dm.org/plantain-00/SubsNoti-frontends.svg)](https://david-dm.org/plantain-00/SubsNoti-frontends)
[![devDependency Status](https://david-dm.org/plantain-00/SubsNoti-frontends/dev-status.svg)](https://david-dm.org/plantain-00/SubsNoti-frontends#info=devDependencies)
[![Build Status](https://travis-ci.org/plantain-00/SubsNoti-frontends.svg?branch=master)](https://travis-ci.org/plantain-00/SubsNoti-frontends)

# tools and global npm packages

+ node.js >=4.0(for ES6 support)
+ typescript@next(for ES6 and ES7 async function support)
+ gulp
+ scss-lint

# development

+ `npm install`
+ `gulp build`
+ `gulp host`

# deploy

+ `gulp deploy`

# demo

https://yorkyao.xyz/

# tips

本来是用来给对email不敏感的情景来用的，比如企业内部。

所以如果不想暴露email，不要在public里创建theme，可以创建一个organization后，在这个organization里随意玩。

一般使用情景是，比如，有人想统计周末去哪里玩的人，就可以发个theme，别人就可以watch，后悔可以unwatch，到时间copy emails并close掉；

或者经常遇到的，好几个人对你说，这个做完通知我下，然后你做完，忘了谁想被通知，如果漏了谁或者打扰了谁，多不好。所以可以发个theme，想被通知的就watch下，做完后，copy emails，发通知，close。

## 几个点：

1. 文档的图是用dot写，再生成svg的
2. 有CI，有tslint、scss-lint来控制代码格式，后端有完整api测试
3. 可以根据comment自动部署
4. 改变theme后，不是直接修改，也不是重新查询，而是根据后端push的结果来改变
5. theme创建、编辑页，支持markdown，可以点击按钮上传图片、也可以拖拽文件上传、也可以从其它页面复制图片后在textarea里粘贴
6. 实现了完整的OAuth2，可以由生成的access token获取资源
7. 可以在原位置编辑
8. webpack打包、gulp控制html/js/css的编译、合并、压缩、版本化
9. https和http 2
10. 前后端的类型系统有共用的地方，抽出到submodule实现代码共用
11. 基于react-router的单页
12. 后端代码使用async函数
13. API有调用频率限制，在response header里有反映
