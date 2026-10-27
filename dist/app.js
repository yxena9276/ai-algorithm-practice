const STAGES = [
  { name: "带注释模板", note: "理解每一段" },
  { name: "半成品", note: "补关键逻辑" },
  { name: "只留签名", note: "自己组织代码" },
  { name: "ACM 模式", note: "完整输入输出" },
];

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.6/full/";

const challenges = [
  {
    id: "kmeans",
    name: "K-Means",
    category: "无监督学习",
    summary: "把“分配最近中心”和“重新求均值”拆开练，最后拼成完整迭代。",
    complexity: "O(rounds · n · k · d)",
    prompt: "完成固定轮数的 K-Means",
    description: "给定样本点、初始聚类中心和迭代轮数，返回更新后的中心。距离相同时选择下标较小的中心，空簇保留旧中心。",
    steps: ["计算点到每个中心的平方距离", "把点分配给最近的中心", "对每个簇的每一维求平均", "用新中心进入下一轮"],
    hints: [
      "比较距离时可以省略开平方：sum((x-y)**2 for x, y in zip(a, b))。",
      "先建立 k 个空列表 clusters，再根据最近中心下标 append(point)。",
      "空簇没有均值，直接 new_centers.append(centers[j])。",
    ],
    starters: [
      String.raw`def kmeans(points, centers, rounds):
    k = len(centers)
    dimensions = len(points[0])

    for _ in range(rounds):
        clusters = [[] for _ in range(k)]

        # 1. 为每个点寻找最近中心
        for point in points:
            best = min(
                range(k),
                key=lambda j: sum(
                    (x - y) ** 2
                    for x, y in zip(point, centers[j])
                )
            )
            clusters[best].append(point)

        # 2. 根据每个簇重新计算中心
        new_centers = []
        for j, cluster in enumerate(clusters):
            if not cluster:
                new_centers.append(centers[j])
                continue

            # TODO：对 cluster 的每一维求平均

        centers = new_centers

    return centers`,
      String.raw`def kmeans(points, centers, rounds):
    k = len(centers)

    for _ in range(rounds):
        clusters = [[] for _ in range(k)]

        for point in points:
            # TODO：找最近中心 best
            pass

        new_centers = []
        for j, cluster in enumerate(clusters):
            # TODO：处理空簇；否则每一维求平均
            pass

        centers = new_centers

    return centers`,
      String.raw`def kmeans(points, centers, rounds):
    pass`,
      String.raw`def main():
    # 输入：n d k rounds
    n, d, k, rounds = map(int, input().split())
    points = [list(map(float, input().split())) for _ in range(n)]
    centers = [list(map(float, input().split())) for _ in range(k)]

    # TODO：完成 K-Means 并逐行输出中心，保留 6 位小数
    pass


if __name__ == "__main__":
    main()`,
    ],
    coreSolution: String.raw`def kmeans(points, centers, rounds):
    k = len(centers)
    dimensions = len(points[0])

    for _ in range(rounds):
        clusters = [[] for _ in range(k)]

        for point in points:
            best = min(
                range(k),
                key=lambda j: sum(
                    (x - y) ** 2
                    for x, y in zip(point, centers[j])
                )
            )
            clusters[best].append(point)

        new_centers = []
        for j, cluster in enumerate(clusters):
            if not cluster:
                new_centers.append(centers[j])
                continue

            center = [
                sum(point[dim] for point in cluster) / len(cluster)
                for dim in range(dimensions)
            ]
            new_centers.append(center)

        centers = new_centers

    return centers`,
    acmSolution: String.raw`def kmeans(points, centers, rounds):
    k = len(centers)
    dimensions = len(points[0])

    for _ in range(rounds):
        clusters = [[] for _ in range(k)]
        for point in points:
            best = min(
                range(k),
                key=lambda j: sum((x-y)**2 for x, y in zip(point, centers[j]))
            )
            clusters[best].append(point)

        new_centers = []
        for j, cluster in enumerate(clusters):
            if not cluster:
                new_centers.append(centers[j])
            else:
                new_centers.append([
                    sum(point[dim] for point in cluster) / len(cluster)
                    for dim in range(dimensions)
                ])
        centers = new_centers

    return centers


def main():
    n, d, k, rounds = map(int, input().split())
    points = [list(map(float, input().split())) for _ in range(n)]
    centers = [list(map(float, input().split())) for _ in range(k)]

    for center in kmeans(points, centers, rounds):
        print(" ".join(f"{v:.6f}" for v in center))


if __name__ == "__main__":
    main()`,
    tests: String.raw`actual = kmeans(
    [[0, 0], [0, 2], [10, 10], [10, 12]],
    [[0, 0], [10, 10]],
    1,
)
expected = [[0, 1], [10, 11]]
assert len(actual) == len(expected), "中心数量不正确"
for row_a, row_e in zip(actual, expected):
    for a, e in zip(row_a, row_e):
        assert abs(a - e) < 1e-7, f"期望 {expected}，实际 {actual}"

# 空簇应保留旧中心
actual = kmeans([[0, 0]], [[0, 0], [10, 10]], 1)
assert actual == [[0.0, 0.0], [10, 10]] or actual == [[0, 0], [10, 10]], "空簇处理不正确"
print("✓ 普通聚类测试通过")
print("✓ 空簇测试通过")`,
    sampleInput: "4 2 2 1\n0 0\n0 2\n10 10\n10 12\n0 0\n10 10",
    expectedOutput: "0.000000 1.000000\n10.000000 11.000000",
  },
  {
    id: "knn",
    name: "KNN",
    category: "监督学习",
    summary: "把训练样本按距离排队，用前 k 个邻居投票预测类别。",
    complexity: "O(n · d + n log n)",
    prompt: "完成 KNN 分类器",
    description: "给定训练特征、训练标签、一个测试点和 k，返回前 k 个最近邻中出现次数最多的标签。本练习保证不会平票。",
    steps: ["计算测试点到每个训练点的平方距离", "保存 (距离, 标签) 并按距离排序", "截取前 k 个邻居", "统计标签并返回票数最多者"],
    hints: [
      "把候选项保存成 (distance, label)，元组排序会优先比较 distance。",
      "计数可以写 votes[label] = votes.get(label, 0) + 1。",
      "返回 max(votes, key=votes.get)，本题保证没有平票。",
    ],
    starters: [
      String.raw`def knn(train_x, train_y, test_point, k):
    candidates = []

    # 1. 计算每个训练点与测试点的距离
    for point, label in zip(train_x, train_y):
        distance = sum(
            (x - y) ** 2
            for x, y in zip(point, test_point)
        )
        candidates.append((distance, label))

    # 2. 按距离从小到大排序
    candidates.sort()

    # 3. 只统计前 k 个邻居
    votes = {}
    for _, label in candidates[:k]:
        # TODO：给 label 计票
        pass

    # TODO：返回票数最多的类别`,
      String.raw`def knn(train_x, train_y, test_point, k):
    candidates = []

    for point, label in zip(train_x, train_y):
        # TODO：计算平方距离并保存
        pass

    # TODO：排序、取前 k 个、投票并返回结果
    pass`,
      String.raw`def knn(train_x, train_y, test_point, k):
    pass`,
      String.raw`def main():
    # 输入：n d k；接下来 n 行为 d 个特征和 1 个标签；最后一行为测试点
    n, d, k = map(int, input().split())
    train_x = []
    train_y = []

    for _ in range(n):
        row = input().split()
        train_x.append(list(map(float, row[:d])))
        train_y.append(row[d])

    test_point = list(map(float, input().split()))

    # TODO：预测并输出类别
    pass


if __name__ == "__main__":
    main()`,
    ],
    coreSolution: String.raw`def knn(train_x, train_y, test_point, k):
    candidates = []

    for point, label in zip(train_x, train_y):
        distance = sum(
            (x - y) ** 2
            for x, y in zip(point, test_point)
        )
        candidates.append((distance, label))

    candidates.sort()
    votes = {}

    for _, label in candidates[:k]:
        votes[label] = votes.get(label, 0) + 1

    return max(votes, key=votes.get)`,
    acmSolution: String.raw`def knn(train_x, train_y, test_point, k):
    candidates = []
    for point, label in zip(train_x, train_y):
        distance = sum((x-y)**2 for x, y in zip(point, test_point))
        candidates.append((distance, label))

    candidates.sort()
    votes = {}
    for _, label in candidates[:k]:
        votes[label] = votes.get(label, 0) + 1
    return max(votes, key=votes.get)


def main():
    n, d, k = map(int, input().split())
    train_x = []
    train_y = []

    for _ in range(n):
        row = input().split()
        train_x.append(list(map(float, row[:d])))
        train_y.append(row[d])

    test_point = list(map(float, input().split()))
    print(knn(train_x, train_y, test_point, k))


if __name__ == "__main__":
    main()`,
    tests: String.raw`train_x = [[0, 0], [1, 1], [9, 9], [10, 10]]
train_y = ["A", "A", "B", "B"]
assert knn(train_x, train_y, [2, 2], 3) == "A", "测试点 [2, 2] 应预测为 A"
assert knn(train_x, train_y, [9, 10], 3) == "B", "测试点 [9, 10] 应预测为 B"
print("✓ A 类样例通过")
print("✓ B 类样例通过")`,
    sampleInput: "4 2 3\n0 0 A\n1 1 A\n9 9 B\n10 10 B\n2 2",
    expectedOutput: "A",
  },
  {
    id: "metrics",
    name: "P / R / F1",
    category: "分类评估",
    summary: "先数清 TP、FP、FN、TN，再安全地计算 Precision、Recall 和 F1。",
    complexity: "O(n)",
    prompt: "从真实标签和预测标签计算指标",
    description: "正类标签为 1。返回 precision、recall、f1 三个浮点数；任何分母为 0 时，对应指标返回 0.0。",
    steps: ["逐对检查真实标签与预测标签", "累计 TP、FP、FN、TN", "计算 Precision 与 Recall，并处理除零", "用二者的调和平均计算 F1"],
    hints: [
      "TP：true == 1 and pred == 1；FP：true == 0 and pred == 1。",
      "precision 的分母是 TP + FP；recall 的分母是 TP + FN。",
      "F1 的分母 precision + recall 也可能为 0。",
    ],
    starters: [
      String.raw`def classification_metrics(y_true, y_pred):
    tp = fp = fn = tn = 0

    for true, pred in zip(y_true, y_pred):
        if true == 1 and pred == 1:
            tp += 1
        elif true == 0 and pred == 1:
            fp += 1
        elif true == 1 and pred == 0:
            fn += 1
        else:
            tn += 1

    precision = tp / (tp + fp) if tp + fp > 0 else 0.0
    # TODO：计算 recall
    recall = 0.0

    # TODO：计算 f1，注意 precision + recall 可能为 0
    f1 = 0.0

    return precision, recall, f1`,
      String.raw`def classification_metrics(y_true, y_pred):
    tp = fp = fn = tn = 0

    # TODO：统计混淆矩阵中的四个数量

    # TODO：安全地计算 precision、recall、f1

    return precision, recall, f1`,
      String.raw`def classification_metrics(y_true, y_pred):
    pass`,
      String.raw`def main():
    n = int(input())
    y_true = list(map(int, input().split()))
    y_pred = list(map(int, input().split()))

    # TODO：输出 precision recall f1，均保留 6 位小数
    pass


if __name__ == "__main__":
    main()`,
    ],
    coreSolution: String.raw`def classification_metrics(y_true, y_pred):
    tp = fp = fn = tn = 0

    for true, pred in zip(y_true, y_pred):
        if true == 1 and pred == 1:
            tp += 1
        elif true == 0 and pred == 1:
            fp += 1
        elif true == 1 and pred == 0:
            fn += 1
        else:
            tn += 1

    precision = tp / (tp + fp) if tp + fp > 0 else 0.0
    recall = tp / (tp + fn) if tp + fn > 0 else 0.0
    f1 = (
        2 * precision * recall / (precision + recall)
        if precision + recall > 0
        else 0.0
    )
    return precision, recall, f1`,
    acmSolution: String.raw`def classification_metrics(y_true, y_pred):
    tp = fp = fn = tn = 0
    for true, pred in zip(y_true, y_pred):
        if true == 1 and pred == 1:
            tp += 1
        elif true == 0 and pred == 1:
            fp += 1
        elif true == 1 and pred == 0:
            fn += 1
        else:
            tn += 1

    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    return precision, recall, f1


def main():
    n = int(input())
    y_true = list(map(int, input().split()))
    y_pred = list(map(int, input().split()))
    precision, recall, f1 = classification_metrics(y_true, y_pred)
    print(f"{precision:.6f} {recall:.6f} {f1:.6f}")


if __name__ == "__main__":
    main()`,
    tests: String.raw`p, r, f1 = classification_metrics([1, 1, 0, 0], [1, 0, 1, 0])
assert abs(p - 0.5) < 1e-9, f"precision 应为 0.5，实际为 {p}"
assert abs(r - 0.5) < 1e-9, f"recall 应为 0.5，实际为 {r}"
assert abs(f1 - 0.5) < 1e-9, f"f1 应为 0.5，实际为 {f1}"

p, r, f1 = classification_metrics([0, 0], [0, 0])
assert (p, r, f1) == (0.0, 0.0, 0.0), "全负类时应正确处理除零"
print("✓ 基本指标测试通过")
print("✓ 除零测试通过")`,
    sampleInput: "4\n1 1 0 0\n1 0 1 0",
    expectedOutput: "0.500000 0.500000 0.500000",
  },
  {
    id: "softmax",
    name: "Softmax",
    category: "概率归一化",
    summary: "先减最大值保证稳定，再把指数归一化为总和等于 1 的概率。",
    complexity: "O(n)",
    prompt: "实现数值稳定的 Softmax",
    description: "输入一个非空数值列表，返回同长度的概率列表。必须先减去最大值，避免指数溢出。",
    steps: ["找到输入中的最大值 mx", "对每个 v 计算 exp(v - mx)", "求所有指数的总和", "每个指数除以总和"],
    hints: [
      "需要 import math，并使用 math.exp。",
      "核心列表推导式是 [math.exp(v - mx) for v in x]。",
      "返回 [v / total for v in exps]，结果之和应接近 1。",
    ],
    starters: [
      String.raw`import math


def softmax(x):
    # 1. 减最大值，保证数值稳定
    mx = max(x)

    # 2. 计算指数
    exps = [math.exp(v - mx) for v in x]

    # TODO：求指数总和
    total = 0

    # TODO：归一化并返回概率列表`,
      String.raw`import math


def softmax(x):
    # TODO：max → exp(v-max) → sum → normalize
    pass`,
      String.raw`def softmax(x):
    pass`,
      String.raw`import math


def main():
    n = int(input())
    x = list(map(float, input().split()))

    # TODO：计算 Softmax，保留 6 位小数输出
    pass


if __name__ == "__main__":
    main()`,
    ],
    coreSolution: String.raw`import math


def softmax(x):
    mx = max(x)
    exps = [math.exp(v - mx) for v in x]
    total = sum(exps)
    return [v / total for v in exps]`,
    acmSolution: String.raw`import math


def softmax(x):
    mx = max(x)
    exps = [math.exp(v - mx) for v in x]
    total = sum(exps)
    return [v / total for v in exps]


def main():
    n = int(input())
    x = list(map(float, input().split()))
    ans = softmax(x)
    print(" ".join(f"{v:.6f}" for v in ans))


if __name__ == "__main__":
    main()`,
    tests: String.raw`actual = softmax([1.0, 2.0, 3.0])
assert len(actual) == 3, "输出长度应与输入相同"
assert abs(sum(actual) - 1.0) < 1e-9, "Softmax 结果之和应为 1"
assert actual[0] < actual[1] < actual[2], "输入越大，对应概率应越大"

stable = softmax([1000.0, 1000.0])
assert all(abs(v - 0.5) < 1e-9 for v in stable), "大数输入应保持数值稳定"
print("✓ 概率性质测试通过")
print("✓ 数值稳定性测试通过")`,
    sampleInput: "3\n1 2 3",
    expectedOutput: "0.090031 0.244728 0.665241",
  },
  {
    id: "attention",
    name: "Attention",
    category: "深度学习",
    summary: "始终盯住矩阵形状：XW 得到 Q/K/V，QKᵀ 得分，按行 Softmax 后乘 V。",
    complexity: "O(n² · d)",
    prompt: "实现缩放点积 Attention",
    description: "只使用 Python 标准库和普通列表完成矩阵乘法、转置、按行 Softmax，以及最终 Attention 输出。",
    steps: ["计算 Q=XWQ、K=XWK、V=XWV", "计算 scores=QKᵀ/√dk", "对 scores 的每一行做 Softmax", "计算 output=weights×V"],
    hints: [
      "先分别实现 matmul、transpose、softmax 三个小函数，不要直接写 attention。",
      "K 的形状是 n×dk，因此乘 Q 前必须转置为 dk×n。",
      "Softmax 是按行进行：return [softmax(row) for row in matrix]。",
    ],
    starters: [
      String.raw`import math


def matmul(a, b):
    rows, middle, cols = len(a), len(b), len(b[0])
    result = [[0.0] * cols for _ in range(rows)]
    for i in range(rows):
        for j in range(cols):
            for t in range(middle):
                result[i][j] += a[i][t] * b[t][j]
    return result


def transpose(matrix):
    return [list(row) for row in zip(*matrix)]


def softmax(row):
    mx = max(row)
    exps = [math.exp(v - mx) for v in row]
    total = sum(exps)
    return [v / total for v in exps]


def attention(x, wq, wk, wv):
    q = matmul(x, wq)
    k = matmul(x, wk)
    v = matmul(x, wv)

    # TODO：QK^T，并除以 sqrt(dk)

    # TODO：按行 Softmax，再乘 V
`,
      String.raw`import math


def matmul(a, b):
    # TODO：三层循环完成矩阵乘法
    pass


def transpose(matrix):
    # TODO：返回矩阵转置
    pass


def softmax(row):
    # TODO：稳定版 Softmax
    pass


def attention(x, wq, wk, wv):
    # TODO：XW → QK^T → scale → row softmax → ×V
    pass`,
      String.raw`def attention(x, wq, wk, wv):
    pass`,
      String.raw`import math


def main():
    # 输入：n d。本练习中 WQ/WK/WV 均为 d×d
    n, d = map(int, input().split())
    x = [list(map(float, input().split())) for _ in range(n)]
    wq = [list(map(float, input().split())) for _ in range(d)]
    wk = [list(map(float, input().split())) for _ in range(d)]
    wv = [list(map(float, input().split())) for _ in range(d)]

    # TODO：计算 Attention 并逐行输出，保留 6 位小数
    pass


if __name__ == "__main__":
    main()`,
    ],
    coreSolution: String.raw`import math


def matmul(a, b):
    rows, middle, cols = len(a), len(b), len(b[0])
    result = [[0.0] * cols for _ in range(rows)]
    for i in range(rows):
        for j in range(cols):
            for t in range(middle):
                result[i][j] += a[i][t] * b[t][j]
    return result


def transpose(matrix):
    return [list(row) for row in zip(*matrix)]


def softmax(row):
    mx = max(row)
    exps = [math.exp(v - mx) for v in row]
    total = sum(exps)
    return [v / total for v in exps]


def attention(x, wq, wk, wv):
    q = matmul(x, wq)
    k = matmul(x, wk)
    v = matmul(x, wv)

    scores = matmul(q, transpose(k))
    scale = math.sqrt(len(q[0]))
    scores = [[value / scale for value in row] for row in scores]

    weights = [softmax(row) for row in scores]
    return matmul(weights, v)`,
    acmSolution: String.raw`import math


def matmul(a, b):
    rows, middle, cols = len(a), len(b), len(b[0])
    result = [[0.0] * cols for _ in range(rows)]
    for i in range(rows):
        for j in range(cols):
            for t in range(middle):
                result[i][j] += a[i][t] * b[t][j]
    return result


def transpose(matrix):
    return [list(row) for row in zip(*matrix)]


def softmax(row):
    mx = max(row)
    exps = [math.exp(v - mx) for v in row]
    total = sum(exps)
    return [v / total for v in exps]


def attention(x, wq, wk, wv):
    q, k, v = matmul(x, wq), matmul(x, wk), matmul(x, wv)
    scores = matmul(q, transpose(k))
    scale = math.sqrt(len(q[0]))
    scores = [[value / scale for value in row] for row in scores]
    weights = [softmax(row) for row in scores]
    return matmul(weights, v)


def main():
    n, d = map(int, input().split())
    x = [list(map(float, input().split())) for _ in range(n)]
    wq = [list(map(float, input().split())) for _ in range(d)]
    wk = [list(map(float, input().split())) for _ in range(d)]
    wv = [list(map(float, input().split())) for _ in range(d)]

    for row in attention(x, wq, wk, wv):
        print(" ".join(f"{v:.6f}" for v in row))


if __name__ == "__main__":
    main()`,
    tests: String.raw`identity = [[1, 0], [0, 1]]
actual = attention(identity, identity, identity, identity)
expected = [[0.6697615493, 0.3302384507], [0.3302384507, 0.6697615493]]
for row_a, row_e in zip(actual, expected):
    for a, e in zip(row_a, row_e):
        assert abs(a - e) < 1e-6, f"期望 {expected}，实际 {actual}"
print("✓ 维度与计算结果测试通过")`,
    sampleInput: "2 2\n1 0\n0 1\n1 0\n0 1\n1 0\n0 1\n1 0\n0 1",
    expectedOutput: "0.669762 0.330238\n0.330238 0.669762",
  },
];

const els = {
  topicNav: document.querySelector("#topicNav"),
  stageTabs: document.querySelector("#stageTabs"),
  lessonIndex: document.querySelector("#lessonIndex"),
  lessonCategory: document.querySelector("#lessonCategory"),
  lessonTitle: document.querySelector("#lessonTitle"),
  lessonSummary: document.querySelector("#lessonSummary"),
  lessonComplexity: document.querySelector("#lessonComplexity"),
  stageTitle: document.querySelector("#stageTitle"),
  promptTitle: document.querySelector("#promptTitle"),
  promptText: document.querySelector("#promptText"),
  stepList: document.querySelector("#stepList"),
  hintBox: document.querySelector("#hintBox"),
  hintText: document.querySelector("#hintText"),
  hintBtn: document.querySelector("#hintBtn"),
  solutionBtn: document.querySelector("#solutionBtn"),
  solutionPanel: document.querySelector("#solutionPanel"),
  solutionCode: document.querySelector("#solutionCode"),
  codeEditor: document.querySelector("#codeEditor"),
  editorFilename: document.querySelector("#editorFilename"),
  runBtn: document.querySelector("#runBtn"),
  resetCodeBtn: document.querySelector("#resetCodeBtn"),
  consoleState: document.querySelector("#consoleState"),
  consoleOutput: document.querySelector("#consoleOutput"),
  attemptBadge: document.querySelector("#attemptBadge"),
  sampleCard: document.querySelector("#sampleCard"),
  sampleInput: document.querySelector("#sampleInput"),
  sampleOutput: document.querySelector("#sampleOutput"),
  nextStageBtn: document.querySelector("#nextStageBtn"),
  resetProgressBtn: document.querySelector("#resetProgressBtn"),
  themeToggleBtn: document.querySelector("#themeToggleBtn"),
  themeToggleIcon: document.querySelector("#themeToggleIcon"),
  themeToggleText: document.querySelector("#themeToggleText"),
  overallProgressText: document.querySelector("#overallProgressText"),
  overallProgressBar: document.querySelector("#overallProgressBar"),
  pythonStatus: document.querySelector("#pythonStatus"),
};

const STORAGE_KEY = "algo-stairs-state-v2";
const THEME_KEY = "algo-stairs-theme";
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
const state = {
  challengeIndex: Number.isInteger(saved.challengeIndex) ? saved.challengeIndex : 0,
  stageIndex: Number.isInteger(saved.stageIndex) ? saved.stageIndex : 0,
  code: saved.code || {},
  passed: saved.passed || {},
  hintIndex: 0,
};

let pyodideInstance = null;
let pythonLoading = null;
let saveTimer = null;

function renderThemeToggle() {
  const isLight = document.documentElement.dataset.theme === "light";
  els.themeToggleBtn.setAttribute("aria-pressed", String(isLight));
  els.themeToggleIcon.textContent = isLight ? "☾" : "☀";
  els.themeToggleText.textContent = isLight ? "深色模式" : "浅色模式";
  els.themeToggleBtn.setAttribute("aria-label", isLight ? "切换到深色模式" : "切换到浅色模式");
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      challengeIndex: state.challengeIndex,
      stageIndex: state.stageIndex,
      code: state.code,
      passed: state.passed,
    }),
  );
}

function codeKey(challenge = currentChallenge(), stage = state.stageIndex) {
  return `${challenge.id}:${stage}`;
}

function currentChallenge() {
  return challenges[state.challengeIndex];
}

function renderNavigation() {
  els.topicNav.innerHTML = challenges
    .map((challenge, index) => {
      const passedCount = STAGES.filter((_, stage) => state.passed[`${challenge.id}:${stage}`]).length;
      return `
        <button class="topic-button ${index === state.challengeIndex ? "active" : ""}" data-topic="${index}" type="button">
          <span class="topic-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="topic-label">
            <strong>${challenge.name}</strong>
            <small>${challenge.category}</small>
          </span>
          <span class="topic-progress">${passedCount}/4</span>
        </button>
      `;
    })
    .join("");

  els.topicNav.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      persistEditor();
      state.challengeIndex = Number(button.dataset.topic);
      state.stageIndex = 0;
      state.hintIndex = 0;
      saveState();
      render();
    });
  });
}

function renderStages() {
  const challenge = currentChallenge();
  els.stageTabs.innerHTML = STAGES.map((stage, index) => {
    const passed = state.passed[`${challenge.id}:${index}`];
    return `
      <button
        class="stage-tab ${index === state.stageIndex ? "active" : ""} ${passed ? "passed" : ""}"
        data-stage="${index}"
        data-step="${index + 1}"
        role="tab"
        aria-selected="${index === state.stageIndex}"
        type="button"
      >
        <strong>${stage.name}</strong>
        <small>${stage.note}</small>
      </button>
    `;
  }).join("");

  els.stageTabs.querySelectorAll("[data-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      persistEditor();
      state.stageIndex = Number(button.dataset.stage);
      state.hintIndex = 0;
      saveState();
      renderLesson();
      renderStages();
    });
  });
}

function renderLesson() {
  const challenge = currentChallenge();
  const stage = STAGES[state.stageIndex];
  const key = codeKey();
  const isAcm = state.stageIndex === STAGES.length - 1;
  const passed = Boolean(state.passed[key]);

  els.lessonIndex.textContent = String(state.challengeIndex + 1).padStart(2, "0");
  els.lessonCategory.textContent = challenge.category;
  els.lessonTitle.textContent = challenge.name;
  els.lessonSummary.textContent = challenge.summary;
  els.lessonComplexity.textContent = challenge.complexity;
  els.stageTitle.textContent = stage.name;
  els.promptTitle.textContent = challenge.prompt;
  els.promptText.textContent = challenge.description;
  els.stepList.innerHTML = challenge.steps.map((step) => `<li>${step}</li>`).join("");
  els.hintBox.hidden = true;
  els.hintText.textContent = "";
  els.hintBtn.textContent = "给我一点提示";
  els.solutionPanel.hidden = true;
  els.solutionBtn.textContent = "查看参考答案";
  els.solutionCode.textContent = isAcm ? challenge.acmSolution : challenge.coreSolution;
  els.codeEditor.value = state.code[key] ?? challenge.starters[state.stageIndex];
  els.editorFilename.textContent = isAcm ? "main.py" : `${challenge.id}.py`;
  els.sampleCard.hidden = !isAcm;
  els.sampleInput.textContent = challenge.sampleInput;
  els.sampleOutput.textContent = challenge.expectedOutput;
  els.consoleState.textContent = passed ? "上次已通过" : "等待运行";
  els.consoleState.className = passed ? "success" : "";
  els.consoleOutput.textContent = isAcm
    ? "运行时会自动使用下方样例输入，并核对程序输出。"
    : "点击“运行测试”，浏览器会在本地执行你的 Python 代码。";
  els.attemptBadge.textContent = passed ? "已通过" : "尚未通过";
  els.attemptBadge.classList.toggle("passed", passed);
  els.nextStageBtn.textContent = state.stageIndex < STAGES.length - 1 ? "下一关 →" : "下一个算法 →";
}

function updateOverallProgress() {
  const total = challenges.length * STAGES.length;
  const completed = Object.keys(state.passed).filter((key) => state.passed[key]).length;
  els.overallProgressText.textContent = `${completed} / ${total}`;
  els.overallProgressBar.style.width = `${(completed / total) * 100}%`;
}

function render() {
  renderNavigation();
  renderStages();
  renderLesson();
  updateOverallProgress();
}

function persistEditor() {
  state.code[codeKey()] = els.codeEditor.value;
  saveState();
}

async function ensurePython() {
  if (pyodideInstance) return pyodideInstance;
  if (pythonLoading) return pythonLoading;

  els.pythonStatus.textContent = "正在加载 Python…";
  els.pythonStatus.className = "runtime-status loading";

  pythonLoading = globalThis
    .loadPyodide({ indexURL: PYODIDE_URL })
    .then((instance) => {
      pyodideInstance = instance;
      els.pythonStatus.textContent = "Python 已就绪";
      els.pythonStatus.className = "runtime-status ready";
      return instance;
    })
    .catch((error) => {
      pythonLoading = null;
      els.pythonStatus.textContent = "Python 加载失败";
      els.pythonStatus.className = "runtime-status";
      throw error;
    });

  return pythonLoading;
}

function pythonString(value) {
  return JSON.stringify(value);
}

async function runCoreCode(pyodide, code, tests) {
  const script = `
import io
import traceback
import contextlib

_user_code = ${pythonString(code)}
_test_code = ${pythonString(tests)}
_scope = {}
_stdout = io.StringIO()

try:
    with contextlib.redirect_stdout(_stdout):
        exec(_user_code, _scope)
        exec(_test_code, _scope)
    _result = "__PASS__\\n" + _stdout.getvalue()
except Exception:
    _result = "__FAIL__\\n" + traceback.format_exc() + _stdout.getvalue()

_result
`;
  return String(await pyodide.runPythonAsync(script));
}

async function runAcmCode(pyodide, code, sampleInput, expectedOutput) {
  const script = `
import io
import sys
import traceback
import contextlib

_user_code = ${pythonString(code)}
_sample_input = ${pythonString(`${sampleInput}\n`)}
_expected = ${pythonString(expectedOutput.trim())}
_stdout = io.StringIO()
_old_stdin = sys.stdin

try:
    sys.stdin = io.StringIO(_sample_input)
    with contextlib.redirect_stdout(_stdout):
        exec(_user_code, {"__name__": "__main__"})
    _actual = _stdout.getvalue().strip()
    if _actual != _expected:
        raise AssertionError(
            "输出不一致\\n期望输出：\\n" + _expected + "\\n\\n你的输出：\\n" + (_actual or "<空输出>")
        )
    _result = "__PASS__\\n✓ 样例输入输出完全匹配\\n\\n程序输出：\\n" + _actual
except Exception:
    _result = "__FAIL__\\n" + traceback.format_exc()
finally:
    sys.stdin = _old_stdin

_result
`;
  return String(await pyodide.runPythonAsync(script));
}

async function runCurrentCode() {
  const challenge = currentChallenge();
  const code = els.codeEditor.value;
  const isAcm = state.stageIndex === STAGES.length - 1;

  persistEditor();
  els.runBtn.disabled = true;
  els.consoleState.textContent = "正在运行";
  els.consoleState.className = "";
  els.consoleOutput.textContent = pyodideInstance ? "正在执行测试…" : "第一次运行需要加载浏览器内 Python，可能需要几秒钟…";

  try {
    const pyodide = await ensurePython();
    const result = isAcm
      ? await runAcmCode(pyodide, code, challenge.sampleInput, challenge.expectedOutput)
      : await runCoreCode(pyodide, code, challenge.tests);
    const passed = result.startsWith("__PASS__");
    const output = result.replace(/^__(PASS|FAIL)__\n?/, "");

    els.consoleState.textContent = passed ? "测试通过" : "需要修改";
    els.consoleState.className = passed ? "success" : "error";
    els.consoleOutput.textContent = output.trim() || "运行完成，没有输出。";

    if (passed) {
      state.passed[codeKey()] = true;
      saveState();
      renderNavigation();
      renderStages();
      updateOverallProgress();
      els.attemptBadge.textContent = "已通过";
      els.attemptBadge.classList.add("passed");
    }
  } catch (error) {
    els.consoleState.textContent = "运行环境错误";
    els.consoleState.className = "error";
    els.consoleOutput.textContent = `无法启动浏览器内 Python。请检查网络后重试。\n\n${error.message}`;
  } finally {
    els.runBtn.disabled = false;
  }
}

els.codeEditor.addEventListener("input", () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persistEditor, 300);
});

els.codeEditor.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = els.codeEditor.selectionStart;
    const end = els.codeEditor.selectionEnd;
    els.codeEditor.setRangeText("    ", start, end, "end");
  }

  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    runCurrentCode();
  }
});

els.runBtn.addEventListener("click", runCurrentCode);

els.themeToggleBtn.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  try {
    localStorage.setItem(THEME_KEY, nextTheme);
  } catch {
    // Storage may be unavailable; the current page can still change theme.
  }
  renderThemeToggle();
});

els.hintBtn.addEventListener("click", () => {
  const challenge = currentChallenge();
  const hint = challenge.hints[Math.min(state.hintIndex, challenge.hints.length - 1)];
  els.hintBox.hidden = false;
  els.hintText.textContent = hint;
  state.hintIndex += 1;
  els.hintBtn.textContent = state.hintIndex < challenge.hints.length ? "再给一点提示" : "已显示全部提示";
});

els.solutionBtn.addEventListener("click", () => {
  const willShow = els.solutionPanel.hidden;
  els.solutionPanel.hidden = !willShow;
  els.solutionBtn.textContent = willShow ? "收起参考答案" : "查看参考答案";
});

els.resetCodeBtn.addEventListener("click", () => {
  const challenge = currentChallenge();
  if (!window.confirm("恢复当前关卡的初始模板？你写的代码会被替换。")) return;
  els.codeEditor.value = challenge.starters[state.stageIndex];
  state.code[codeKey()] = els.codeEditor.value;
  saveState();
  els.consoleState.textContent = "等待运行";
  els.consoleState.className = "";
  els.consoleOutput.textContent = "模板已恢复。";
});

els.nextStageBtn.addEventListener("click", () => {
  persistEditor();
  if (state.stageIndex < STAGES.length - 1) {
    state.stageIndex += 1;
  } else {
    state.challengeIndex = (state.challengeIndex + 1) % challenges.length;
    state.stageIndex = 0;
  }
  state.hintIndex = 0;
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

els.resetProgressBtn.addEventListener("click", () => {
  if (!window.confirm("清空所有练习代码和通过记录？此操作无法撤销。")) return;
  localStorage.removeItem(STORAGE_KEY);
  state.challengeIndex = 0;
  state.stageIndex = 0;
  state.code = {};
  state.passed = {};
  state.hintIndex = 0;
  render();
});

function registerWebMcpTools() {
  const context = document.modelContext;
  if (!context?.registerTool) return;

  const reportError = (error) => console.warn("WebMCP tool registration failed", error);

  try {
    void Promise.resolve(
      context.registerTool({
        name: "get_algorithm_practice_progress",
        title: "查看算法练习进度",
        description: "读取 Algo梯 中五类算法各自已经通过的练习台阶。",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute() {
          return {
            totalPassed: Object.values(state.passed).filter(Boolean).length,
            totalStages: challenges.length * STAGES.length,
            algorithms: challenges.map((challenge) => ({
              id: challenge.id,
              name: challenge.name,
              passedStages: STAGES.filter((_, stage) => state.passed[`${challenge.id}:${stage}`]).length,
            })),
          };
        },
      }),
    ).catch(reportError);

    void Promise.resolve(
      context.registerTool({
        name: "open_algorithm_practice",
        title: "打开算法练习",
        description: "在 Algo梯 中切换到指定算法和练习台阶。台阶编号为 1 到 4。",
        inputSchema: {
          type: "object",
          properties: {
            algorithmId: {
              type: "string",
              enum: challenges.map((challenge) => challenge.id),
            },
            stage: { type: "integer", minimum: 1, maximum: 4 },
          },
          required: ["algorithmId"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const challengeIndex = challenges.findIndex((challenge) => challenge.id === input?.algorithmId);
          if (challengeIndex < 0) throw new Error("未知的算法 ID");
          const stage = input.stage ?? 1;
          if (!Number.isInteger(stage) || stage < 1 || stage > 4) throw new Error("stage 必须是 1 到 4 的整数");

          persistEditor();
          state.challengeIndex = challengeIndex;
          state.stageIndex = stage - 1;
          state.hintIndex = 0;
          saveState();
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });

          return {
            opened: challenges[challengeIndex].name,
            stage,
            stageName: STAGES[stage - 1].name,
          };
        },
      }),
    ).catch(reportError);
  } catch (error) {
    reportError(error);
  }
}

render();
renderThemeToggle();
registerWebMcpTools();
