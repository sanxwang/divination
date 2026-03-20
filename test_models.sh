#!/bin/bash

# 多模型测试脚本
# Test script for multi-model support

API_BASE="http://localhost:3000"
API_KEY="sk-3e8f11c6cde74a6da9ce261d31dd69c9"

echo "=== 多模型支持测试 ==="
echo ""

# 1. 获取可用模型
echo "1️⃣  获取可用模型列表..."
curl -s -X GET "$API_BASE/api/models" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# 2. 使用DeepSeek调用prompt
echo "2️⃣  使用DeepSeek模型调用..."
curl -s -X POST "$API_BASE/api/prompt/random?model=deepseek" \
  -H "Content-Type: application/json" \
  -H "X-DeepSeek-Key: $API_KEY" \
  -d '{
    "userId": "test-user",
    "contextTags": ["下午"],
    "candidateIds": ["tea1", "tea2"]
  }' | jq '.model, .ok'
echo ""

# 3. 使用Mimo模型调用
echo "3️⃣  使用Mimo模型调用..."
curl -s -X POST "$API_BASE/api/prompt/random?model=mimo" \
  -H "Content-Type: application/json" \
  -H "X-DeepSeek-Key: $API_KEY" \
  -d '{
    "userId": "test-user",
    "contextTags": ["下午"],
    "candidateIds": ["tea1", "tea2"]
  }' | jq '.model, .ok'
echo ""

# 4. POST body中指定模型
echo "4️⃣  通过POST body指定模型..."
curl -s -X POST "$API_BASE/api/prompt/random" \
  -H "Content-Type: application/json" \
  -H "X-DeepSeek-Key: $API_KEY" \
  -d '{
    "userId": "test-user",
    "model": "deepseek",
    "contextTags": ["早上"]
  }' | jq '.model, .ok'
echo ""

echo "✅ 测试完成！"
