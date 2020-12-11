### quick start

```javascript
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

```javascript
// 开发，例如：yarn start tpl
yarn start <app[--feature]> [env]

// 打包，例如：yarn build tpl
yarn build <app[--feature]> [env]

// 压缩打包，例如：yarn pkg tpl
yarn pkg <app[--feature]> [env]

// 发布，例如：yarn r tpl
yarn r <app[--feature]> [env]
```

### git commit type

git commit type must be one of [build, chore, ci, docs, feat, fix, improvement, perf, refactor, revert, style, test]
