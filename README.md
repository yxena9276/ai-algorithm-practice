# Algo梯

一个面向 AI 岗 Coding 笔试的渐进式手写训练站。练习不会要求你立刻从空白写起，而是依次经过：

1. 带注释模板
2. 半成品补全
3. 只留函数签名
4. 完整 ACM 输入输出

当前包含：

- K-Means
- KNN
- Precision / Recall / F1
- Softmax
- Scaled Dot-Product Attention

页面右上角可以切换浅色／深色模式；主题选择会保存在当前浏览器，与练习进度分开保存。

## 本地运行

由于浏览器安全策略和 Pyodide 的加载方式，请通过本地 HTTP 服务打开，不要直接双击 HTML 文件。

```bash
python -m http.server 8000 -d dist
```

然后访问 `http://localhost:8000`。

第一次点击“运行测试”时，会从 CDN 加载浏览器内 Python 运行环境。之后的代码和测试都在本机浏览器中执行。

## 发布到 GitHub Pages

仓库已经包含 GitHub Pages 工作流：

1. 在 GitHub 创建空仓库。
2. 将本项目推送到 `main` 分支。
3. 在仓库的 **Settings → Pages** 中，将 Source 设为 **GitHub Actions**。
4. 工作流完成后，从 Pages 页面打开站点地址。

## 项目结构

```text
dist/
  index.html
  styles.css
  app.js
  favicon.svg
.github/workflows/pages.yml
```

项目无需打包，`dist` 中的文件可以直接作为静态站点发布。

## 检查内置答案

修改练习或参考答案后，可以运行：

```bash
node scripts/check-challenges.mjs
```

它会同时检查核心函数测试和 ACM 样例输出。

## 贡献新练习

练习数据集中在 `dist/app.js` 的 `challenges` 数组中。一个练习包括：

- 中文步骤和分级提示
- 四个难度模板
- 核心函数参考答案
- ACM 参考答案
- 浏览器内自动测试
- ACM 样例输入与预期输出

欢迎通过 Issue 提议题型，或直接提交 Pull Request。

## License

MIT
