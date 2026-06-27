# Git 入门与分支/工作树使用

## Git 是什么

Git 是程序开发中的“时间机器 + 版本保险箱 + 协作记录本”。

它解决三件事：

1. 改错了可以回退；
2. 每次修改都有记录；
3. 可以开分支做实验，不影响主线。

## 你先记住 8 个命令

```bash
git status
git add .
git commit -m "docs: update project docs"
git log --oneline
git checkout -b feature/xxx
git checkout develop
git merge feature/xxx
git push
```

## 推荐分支结构

```txt
main       稳定版本
develop    日常开发集成版本
feature/*  单个功能分支
```

## 你的项目开发顺序

```txt
feature/project-scaffold
feature/database-schema
feature/supplier-admin
feature/platform-admin
feature/miniapp-equipment
feature/miniapp-community
feature/miniapp-mine
feature/supplier-mobile
```

## 初学者规则

- 每次让 Codex 改代码前先 `git status`；
- 有改动先提交；
- main 不直接开发；
- 一个功能一个分支；
- 不把 `.env`、密钥、数据库备份提交到 Git；
- 数据库模型不要多分支同时乱改。

## 推荐提交信息

```bash
git commit -m "chore: create project scaffold"
git commit -m "feat: add equipment selection page"
git commit -m "fix: hide supplier lead phone number"
git commit -m "docs: add wechat devtools guide"
```
