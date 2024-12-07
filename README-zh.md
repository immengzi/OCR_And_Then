# OCR And Then

## 概述

从 OCR 文件中获取文本或直接输入，选择特定场景或默认提示与 LLM 聊天。

## 前提条件

在开始之前，请确保已安装并配置以下内容：

- **Node.js**：版本 14.x 或更高
- **npm**：版本 6.x 或更高
- **MongoDB**：确保 MongoDB 正在本地运行，或已连接 MongoDB Atlas 账户
- **Cloudflare账号**：如果选择使用 Cloudflare R2 存储，需开通 R2 存储桶服务
- **百度云账号**：需要开通文字识别（OCR）服务

## 开始

1. **安装依赖**  
   运行以下命令安装所需的 npm 包：

   ```bash
   npm install
   ```

2. **创建配置文件**  
   将 `.env.example` 的内容复制到一个新的文件 `.env` 中，并根据实际情况修改设置：

   ```bash
   cp .env.example .env
   ```

   修改 `.env` 文件中的配置（如 Cloudflare R2 密钥、百度云 OCR API 密钥、MongoDB 连接字符串等）。

3. **运行应用**  
   启动开发服务器：

   ```bash
   npm run dev
   ```

   确保 MongoDB 正在本地运行或连接到 MongoDB Atlas 集群。