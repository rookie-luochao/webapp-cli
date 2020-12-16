### quick start

```
// 拉取代码
git clone git@github.com:rookie-luochao/webapp-cli.git // or git clone https://github.com/rookie-luochao/webapp-cli.git

// 进入目标文件
cd webapp-cli

// 安装依赖
yarn

// 启动示例项目
yarn start tpl
```

### cli basic command

```
// 开发，例如：yarn start tpl
yarn start <app[--feature]> [env]

// 打包，例如：yarn build tpl
yarn build <app[--feature]> [env]

// 压缩打包，例如：yarn pkg tpl
yarn pkg <app[--feature]> [env]

// 发布，例如：yarn r tpl
yarn r <app[--feature]> [env]
```

### git commit type (commitlint)

git commit type must be one of [build, chore, ci, docs, feat, fix, improvement, perf, refactor, revert, style, test]

### function introduction
1. support react + typescript + rxjs + css in js grammar

2. support auto get axios request function by swagger.json

3. support CI/CD process

### directory basic introduction

```
├── __type__                 # 自定义js库index.d.ts
├── cmd                      # 项目对应CI/CD配置文件
├── public                   # webpack打包编译出来的压缩文件
│   └── tpl                  # 项目编译后的文件夹
├── src-app                  # 项目业务目录（支持多个项目）
│   └── tpl                  # 示例项目
├── src-clients              # 根据接口swagger.json生成的前端services文件
├── src-components           # 公共纯组件
├── src-core                 # 公共核心库
├── tools                    # 构建相关
│   └── client               # 解析swagger.json文件的脚本，获取枚举、中英文翻译、services函数
├── README.md
├── webpack.config.ts
└── package.json
```
