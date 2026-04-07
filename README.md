# Clinic Cardiac

一个面向个人临床学习的 Markdown / Obsidian 仓库，用来承接四类内容：

- 每日学习与查房后的即时记录
- 复习回顾、错题与薄弱点追踪
- 心内相关专题知识的长期沉淀
- 常用临床助手数据，如用药、评分、流程速查

## 仓库设计原则

- 日志和知识分开：当天记录放 `01_daily`，沉淀后的内容放 `03_topics`
- 复习优先：所有值得再次回看的问题，都回收到 `02_review`
- 数据单独维护：结构化数据放 `05_data`，展示与说明放 `04_helpers`
- 来源可追踪：药物和流程类内容必须标注来源与更新时间
- 轻量起步：先能每天用，再逐步长成你自己的临床知识库

## 目录结构

```text
.
|-- 00_home.md                  # 仓库首页 / 导航页
|-- 01_daily/                   # 每日学习记录
|-- 02_review/                  # 复习、错题、回顾
|-- 03_topics/                  # 专题笔记与系统化沉淀
|-- 04_helpers/                 # 常用助手说明页
|-- 05_data/                    # 结构化数据源
|-- 06_templates/               # 各类模板
`-- scripts/                    # 小工具脚本
```

## 推荐工作流

1. 每天先运行 `./scripts/new_daily_note.sh` 生成当天记录页。
2. 学习/查房/复盘时，先把零散内容记在当天笔记里。
3. 当某个知识点反复出现时，整理进 `03_topics`。
4. 当某个问题容易忘、容易错，转移到 `02_review/mistake_log.md`。
5. 当你想做自己的用药助手或评分速查时，先更新 `05_data`，再在 `04_helpers` 写说明页。

## 你可以直接开始用的入口

- 仓库首页：[00_home.md](00_home.md)
- 每日模板：[06_templates/daily_note.md](06_templates/daily_note.md)
- 病例模板：[06_templates/case_note.md](06_templates/case_note.md)
- 专题模板：[06_templates/topic_note.md](06_templates/topic_note.md)
- 药物模板：[06_templates/drug_note.md](06_templates/drug_note.md)
- 每周回顾模板：[06_templates/weekly_review.md](06_templates/weekly_review.md)

## 建议维护方式

- `01_daily` 只放当天上下文，不要求完美
- `03_topics` 只放已经整理过、以后还会反复看的内容
- `05_data` 尽量用表格或 CSV，方便以后做检索、脚本或页面
- 每条药物/流程数据都保留 `source` 和 `updated_at`

## 重要提醒

本仓库适合个人学习、复习与知识整理。涉及诊疗流程、药物剂量、禁忌证、肾功能调整等内容时，实际临床请始终以最新指南、药品说明书、本院制度和上级医师意见为准。
