# Clumsy Bird 游戏集成

## 当前状态

当前 `index.html` 是一个包装文件，它：

1. **优先加载本地游戏**（如果 `game.html` 存在）
2. **备选加载在线版本**（https://ellisonleao.github.io/clumsy-bird/）

这样可以在网络不稳定时也能玩游戏。

## 完整本地集成步骤

如果你想要完全本地部署（不依赖在线版本）：

### 选项 A: 使用预编译的构建文件

```bash
cd /web/public/games/clumsy-bird

# 下载 gh-pages 分支的预构建文件
curl -L https://github.com/ellisonleao/clumsy-bird/archive/refs/heads/gh-pages.zip -o build.zip
unzip build.zip
mv clumsy-bird-gh-pages/* .
rm -rf clumsy-bird-gh-pages build.zip

# 重命名主文件为 game.html
mv index.html game.html
```

### 选项 B: 从源码构建

```bash
cd /web/public/games/clumsy-bird

# 克隆源码
git clone https://github.com/ellisonleao/clumsy-bird.git src
cd src

# 安装依赖
npm install

# 构建
npm run build

# 把构建文件复制到上级目录
cp dist/* ../
cd ..
rm -rf src

# 重命名主文件
mv index.html game.html
```

## 文件结构

集成完成后的结构应该如下：

```
web/public/games/clumsy-bird/
├── index.html          # 包装页面（总是保留）
├── game.html           # 实际游戏 HTML（本地构建）
├── js/
│   ├── melonjs-3.0.0.min.js
│   ├── game.js
│   └── ...
├── css/
│   └── index.css
├── data/
│   ├── background.json
│   ├── sprites.json
│   └── ...
└── lib/
    └── ...
```

## 故障排除

### 游戏加载总是显示"在线版本"

这说明本地 `game.html` 不存在或路径不正确。

检查文件是否存在：
```bash
ls -la /web/public/games/clumsy-bird/game.html
```

### iframe 显示空白

可能是资源路径问题。检查浏览器控制台（F12）查看错误信息。

### 游戏在线版本加载失败

检查网络连接，或按上面的步骤本地构建游戏文件。

## 后续改进

- [ ] 实现本地构建的自动化脚本
- [ ] 添加游戏统计和分数保存
- [ ] 集成排行榜系统
- [ ] 添加其他游戏

## 参考

- [Clumsy Bird GitHub](https://github.com/ellisonleao/clumsy-bird)
- [MelonJS游戏引擎](http://melonjs.org/)
