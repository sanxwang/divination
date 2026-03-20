#!/bin/bash

# 🎯 多模型应用 - 启动指南和设置检查
# Multi-Model App - Setup Guide and Health Check

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🤖 AI 奶茶研究所 - 多模型支持启动指南                        ║"
echo "║     Multi-Model Support - Getting Started Guide                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查函数
check_status() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ $1${NC}"
  else
    echo -e "${RED}❌ $1${NC}"
  fi
}

# 1. 检查环境变量
echo -e "${BLUE}1️⃣  检查配置状态${NC}"
echo "─────────────────────────────────────────────────────────────"

if [ -f .env ]; then
  echo -e "${GREEN}✅ 找到 .env 文件${NC}"
  if grep -q "MIMO_API_KEY" .env; then
    echo -e "${GREEN}✅ Mimo API Key 已配置${NC}"
  else
    echo -e "${YELLOW}⚠️  Mimo API Key 未配置${NC}"
  fi
  if grep -q "DEEPSEEK_API_KEY" .env; then
    echo -e "${GREEN}✅ DeepSeek API Key 已配置${NC}"
  else
    echo -e "${RED}❌ DeepSeek API Key 未配置${NC}"
  fi
else
  echo -e "${RED}❌ 未找到 .env 文件${NC}"
fi

echo ""

# 2. 检查服务状态
echo -e "${BLUE}2️⃣  检查服务状态${NC}"
echo "─────────────────────────────────────────────────────────────"

# 检查后端
if curl -s http://localhost:3000/api/models > /dev/null 2>&1; then
  echo -e "${GREEN}✅ 后端服务运行中 (http://localhost:3000)${NC}"
  MODELS=$(curl -s http://localhost:3000/api/models | grep -o '"name":"[^"]*"' | wc -l)
  echo -e "${GREEN}   ✓ 发现 $MODELS 个可用模型${NC}"
else
  echo -e "${RED}❌ 后端服务未运行 (http://localhost:3000)${NC}"
  echo -e "   运行命令: ${YELLOW}cd server && npm start${NC}"
fi

# 检查前端
if curl -s http://localhost:5173 > /dev/null 2>&1; then
  echo -e "${GREEN}✅ 前端服务运行中 (http://localhost:5173)${NC}"
elif curl -s http://localhost:3001 > /dev/null 2>&1; then
  echo -e "${GREEN}✅ 前端服务运行中 (http://localhost:3001)${NC}"
else
  echo -e "${YELLOW}⚠️  前端服务未检测到${NC}"
  echo -e "   运行命令: ${YELLOW}cd web && npm run dev${NC}"
fi

echo ""

# 3. 使用指南
echo -e "${BLUE}3️⃣  🎯 模型切换使用指南${NC}"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "📍 模型选择器位置："
echo "   在应用顶部导航栏可以看到 '🤖 AI 模型' 下拉菜单"
echo ""
echo "🔄 如何切换模型："
echo "   1. 打开应用"
echo "   2. 在导航栏找到 '🤖 AI 模型: [选择]'"
echo "   3. 点击下拉菜单选择模型"
echo "   4. 选择会自动保存"
echo "   5. 后续所有 API 调用都会使用这个模型"
echo ""
echo "⚡ 支持的模型："
echo "   ✓ DeepSeek (默认)"
echo "   ✓ Xiaomi MiMo (新增)"
echo "   ✓ OpenAI (如果配置)"
echo ""

# 4. 快速链接
echo -e "${BLUE}4️⃣  🔗 快速链接${NC}"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "🌐 访问应用:"
echo "   前端:      http://localhost:3000 或 http://localhost:5173"
echo "   后端 API:  http://localhost:3000"
echo ""
echo "📖 查看文档:"
echo "   使用指南:   ${YELLOW}open HOW_TO_SWITCH_MODELS.md${NC}"
echo "   完整配置:   ${YELLOW}open MULTI_MODEL_GUIDE.md${NC}"
echo "   快速参考:   ${YELLOW}bash QUICK_REFERENCE.sh${NC}"
echo ""
echo "🧪 测试工具:"
echo "   Web 测试:   ${YELLOW}open test_models.html${NC}"
echo "   Shell 测试: ${YELLOW}bash test_models.sh${NC}"
echo ""
echo "⚙️  API 端点:"
echo "   获取模型:   ${YELLOW}curl http://localhost:3000/api/models${NC}"
echo "   调用 API:   ${YELLOW}curl -X POST 'http://localhost:3000/api/prompt/random?model=mimo' ...${NC}"
echo ""

# 5. 下一步
echo -e "${BLUE}5️⃣  📋 下一步${NC}"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "□ 启动后端服务 (如果未运行)"
echo "  $ cd server && npm start"
echo ""
echo "□ 启动前端服务 (如果未运行)"
echo "  $ cd web && npm run dev"
echo ""
echo "□ 在浏览器中打开应用"
echo "  $ open http://localhost:3000"
echo ""
echo "□ 测试模型切换功能"
echo "  在导航栏选择不同的模型并尝试功能"
echo ""
echo "□ 查看使用文档"
echo "  $ cat HOW_TO_SWITCH_MODELS.md"
echo ""

# 6. 故障排除
echo -e "${BLUE}6️⃣  🆘 故障排除${NC}"
echo "─────────────────────────────────────────────────────────────"
echo ""
if ! curl -s http://localhost:3000/api/models > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  后端未运行${NC}"
  echo "   解决: cd server && npm install && npm start"
  echo ""
fi
echo "其他问题？查看完整文档:"
echo "  MODEL_CONFIG.md        - 配置说明"
echo "  MULTI_MODEL_GUIDE.md   - 详细指南"
echo "  IMPLEMENTATION_SUMMARY.md - 实现细节"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  🎉 准备好了吗？开始使用吧！                    ║"
echo "║               Ready to go? Start exploring models! 🚀          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
