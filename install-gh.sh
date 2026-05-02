#!/bin/bash
# 安装 gh CLI 到项目目录

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="$SCRIPT_DIR/.bin"
GH_BIN="$BIN_DIR/gh"

if [ -f "$GH_BIN" ]; then
    echo "gh CLI 已存在: $GH_BIN"
    exit 0
fi

echo "下载安装 gh CLI..."
mkdir -p "$BIN_DIR"

python3 << 'PYTHON'
import urllib.request
import tarfile
import os

url = 'https://github.com/cli/cli/releases/download/v2.72.0/gh_2.72.0_linux_amd64.tar.gz'
tar_path = '/tmp/gh.tar.gz'
urllib.request.urlretrieve(url, tar_path)

bin_dir = "/opt/data/workspace/ai-daily-briefing/.bin"
with tarfile.open(tar_path, 'r:gz') as tar:
    for member in tar.getmembers():
        if member.name.endswith('/bin/gh'):
            member.name = 'gh'
            tar.extract(member, bin_dir)
            print(f'提取完成: {bin_dir}/gh')
PYTHON

echo "✓ gh CLI 安装完成: $GH_BIN"
