English | [简体中文](./README-zh.md)

# OCR And Then

## Introduction

Obtain text from OCR files or input directly, select specific scenarios or default prompts to chat with the LLM.

## Prerequisites

Before you start, make sure you have the following installed and set up:

- **Node.js**: Version 14.x or later
- **npm**: Version 6.x or later
- **MongoDB**: Ensure MongoDB is running locally, or you have a MongoDB Atlas account
- **Cloudflare account**: Required if you choose to use Cloudflare R2 for cloud storage (make sure to enable R2 storage bucket service)
- **Baidu Cloud account**: Required for text recognition (OCR) service

## Getting Started

1. **Install dependencies**  
   Run the following command to install the necessary npm packages:

   ```bash
   npm install
   ```

2. **Create a configuration file**  
   Copy the contents of `.env.example` to a new file named `.env`. Modify the settings according to your setup:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your specific configurations (e.g., Cloudflare R2 keys, Baidu Cloud OCR API key, MongoDB connection string).

3. **Run the application**  
   Start the development server:

   ```bash
   npm run dev
   ```

   Ensure that MongoDB is running locally or that you have a MongoDB Atlas cluster connected.