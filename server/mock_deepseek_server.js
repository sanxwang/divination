const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/v1/generate', (req, res) => {
  const { system, prompt } = req.body || {};
  // Heuristics to decide which mock response to return based on prompt content
  let replyObj = null;
  try {
    const parsed = typeof prompt === 'string' ? JSON.parse(prompt) : prompt || {};

    if (parsed && parsed.candidateIds) {
      // divination
      replyObj = {
        type: 'divination',
        headline: '模擬命中注定的一杯',
        mystic_reason: '星象显示你今天该宠幸自己。',
        recommendation: { id: parsed.candidateIds[0] || 'sku_mock', name: '模拟奶茶', reason: '今天就冲它', tags: ['模拟','推荐'] },
        cta: '就喝这个',
        share_text: '被占卜命中：模拟奶茶 🍹'
      };
    } else if (parsed && parsed.seed !== undefined) {
      // random roll
      replyObj = {
        type: 'random',
        intro: '赌运来了，押我！',
        roll_emote: '滚动中...别眨眼',
        final: { id: 'sku_random', name: '黑糖珍珠鲜奶 (mock)', reason: 'mock 推荐理由' },
        cta: '再抽一次',
        share_text: '赌神附体：黑糖珍珠GET'
      };
    } else if (parsed && parsed.selectedTags) {
      // roast_reco
      replyObj = {
        type: 'roast_reco',
        thinking_text: '好吧，你想要强烈的奶感...给你推荐',
        top1: { id: 'sku_roast1', name: '奶香波霸 (mock)', reason: '奶味浓到可以当被子' },
        alternatives: [{ id: 'sku_roast2', name: '焦糖拿铁 (mock)', reason: '稳稳补能量' }],
        cta: '就喝这个',
        share_text: '奶味太强？那就奶香波霸吧，绝对安心'
      };
    } else if (parsed && parsed.answers) {
      // personality
      replyObj = {
        type: 'personality',
        profileId: 'lazy_sweet',
        title: '快乐摆烂型',
        description: '你享受生活的懒惰美学，甜点比计划靠谱。',
        recommendation: { id: 'sku_person1', name: '焦糖布丁奶茶 (mock)', reason: '专治摆烂的灵魂' },
        share_text: '我是快乐摆烂型，布丁奶茶了解一下？'
      };
    } else if (parsed && parsed.flavor) {
      // custom_builder
      replyObj = {
        type: 'custom_builder',
        summary: '你选了水果、清爽、椰果——夏日正确操作',
        matches: [
          { id: 'sku2', name: '杨枝甘露 (mock)', taste: '清新', reason: '水果感强，椰果加分' },
          { id: 'sku4', name: '柠檬绿茶 (mock)', taste: '清爽', reason: '酸度帮你清醒' }
        ],
        cta: '就这样做',
        share_text: '自制命中：杨枝甘露，椰果天花板'
      };
    } else if (parsed && parsed.game) {
      // mini_game
      replyObj = {
        type: 'mini_game',
        prompt: '猜猜老板几岁？大胆点',
        on_correct: '你们真会算，老板羞答答',
        on_wrong: '你们投票功力不足，回炉重修',
        reveal_text: '老板实际30岁，皮实得很',
        share_text: '我居然猜中了老板年龄，神了'
      };
    } else if (parsed && parsed.userA && parsed.userB) {
      // duo
      replyObj = {
        type: 'duo',
        title: '危险暧昧',
        tagline: '你俩的化学反应有点强',
        who_pays: '谁先说爱谁买单（开玩笑）',
        recommendation: { id: 'sku_duo', name: '双人分享杯 (mock)', reason: '两个人喝正好分量足' },
        screenshot_text: '我们被判定为：危险暧昧',
        animation_hint: 'line_connect -> heart_pulse'
      };
    } else {
      replyObj = { message: 'mock ok' };
    }
  } catch (e) {
    replyObj = { message: 'mock parse error' };
  }

  return res.json({ reply: JSON.stringify(replyObj) });
});

const port = process.env.MOCK_DEEPSEEK_PORT || 5001;
app.listen(port, () => console.log(`Mock DeepSeek server listening on http://localhost:${port}`));
