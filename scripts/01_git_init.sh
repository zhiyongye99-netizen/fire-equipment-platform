#!/usr/bin/env bash
set -e

git init
git add .
git commit -m "init: add fire equipment platform transfer package"
git checkout -b develop

echo "已初始化 Git 并创建 develop 分支。"
