# Algo梯

[![Deploy to GitHub Pages](https://github.com/yxena9276/ai-algorithm-practice/actions/workflows/pages.yml/badge.svg)](https://github.com/yxena9276/ai-algorithm-practice/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

一个面向 AI 岗 Coding 笔试的渐进式手写训练站。它不会要求你立刻从空白写出完整算法，而是把每道题拆成由浅入深的四个阶段。

**[在线体验 Algo梯](https://yxena9276.github.io/ai-algorithm-practice/)**

> 第一次点击“运行测试”时，浏览器需要联网加载 Python 运行环境；加载完成后，代码和测试都在当前浏览器中执行。

## 为什么做这个项目

很多人理解 KNN、K-Means 或 Attention 的原理，却很难在考试中独立写出完整代码。Algo梯通过逐步减少提示，帮助学习者从“能看懂”过渡到“能手写”。

每个算法包含四个练习阶段：

1. 带注释模板
2. 半成品补全
3. 只保留函数签名
4. 完整 ACM 输入输出

## 当前练习

| 算法 | 主要训练内容 |
| --- | --- |
| K-Means | 最近中心、聚类分组、按维度更新中心 |
| KNN | 距离计算、排序、前 `k` 个邻居投票 |
| Precision / Recall / F1 | 指标公式与除零处理 |
| Softmax | 数值稳定性与概率归一化 |
| Scaled Dot-Product Attention | 矩阵乘法、转置、按行 Softmax、缩放与加权 |

## 功能特点

- 浏览器内直接编写并运行 Python
- 自动检查核心函数和 ACM 输入输出
- 分级提示和参考答案
- 自动保存练习进度
- 浅色／深色主题切换
- 响应式页面，可在电脑或移动设备中使用
- 纯静态部署，不需要后端服务

练习进度和主题设置保存在当前浏览器的 `localStorage` 中，不会上传到服务器；更换浏览器或清理网站数据后，需要重新开始记录。

## 本地运行

由于浏览器安全策略和 Pyodide 的加载方式，请通过本地 HTTP 服务打开，不要直接双击 `index.html`。

```bash
python -m http.server 8000 -d dist
```

然后访问：

```text
http://localhost:8000
```

## 检查内置答案

修改练习或参考答案后，可以运行：

```bash
node scripts/check-challenges.mjs
```

脚本会检查五类算法的核心函数和 ACM 样例输出。

## 项目结构

```text
dist/
  index.html        页面结构
  styles.css        页面样式与主题
  app.js            练习内容、交互和自动测试
  favicon.svg       网站图标
scripts/
  check-challenges.mjs
.github/workflows/
  pages.yml         GitHub Pages 自动部署
```

项目不需要打包，`dist` 中的文件可以直接作为静态网站发布。推送到 `main` 分支后，GitHub Actions 会自动部署最新版本。

## 贡献

练习数据集中在 `dist/app.js` 的 `challenges` 数组中。欢迎通过 [Issue](https://github.com/yxena9276/ai-algorithm-practice/issues) 提议新题型，或提交 Pull Request。

## License

[MIT](LICENSE)
