#!/bin/bash
# Cronjob 启动脚本 - 设置环境和凭证

PROJECT_DIR="/opt/data/workspace/ai-daily-briefing"

# 加载环境变量
export PATH="$PROJECT_DIR/.bin:$PATH"
export GH_CONFIG_DIR="$PROJECT_DIR/.config/gh"

# 确保 gh CLI 存在
if [ ! -f "$PROJECT_DIR/.bin/gh" ]; then
    echo "安装 gh CLI..."
    "$PROJECT_DIR/install-gh.sh"
fi

# 配置 git 使用项目的 credential helper
cd "$PROJECT_DIR"
git config credential.helper "$PROJECT_DIR/.git-credential-helper"

echo "环境准备完成"
