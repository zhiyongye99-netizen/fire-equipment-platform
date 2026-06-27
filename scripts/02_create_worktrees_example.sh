#!/usr/bin/env bash
set -e

# 使用前确保已提交当前修改：git status 应该干净
mkdir -p ../fire-equipment-worktrees

git worktree add ../fire-equipment-worktrees/database-schema -b feature/database-schema develop
git worktree add ../fire-equipment-worktrees/miniapp-core -b feature/miniapp-core develop
git worktree add ../fire-equipment-worktrees/supplier-admin -b feature/supplier-admin develop

echo "已创建示例工作树。初学阶段最多保留 2-3 个活跃工作树。"
