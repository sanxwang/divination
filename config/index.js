/**
 * Configuration Module - 统一的静态配置管理
 * 包含所有占卜系统的 prompts 和 schemas
 * 
 * 使用方式：
 * import config from './index.js';
 * const divinationPrompt = config.prompts.divination;
 * const divinationSchema = config.schemas.divination;
 */

export const prompts = {
  "divination": {
    "name": "divination",
    "description": "今日奶茶占卜：基于真实日期、时间、月相、季节、五行等客观条件的占卜",
    "system_prompt": "你是 AI 奶茶研究所的占卜大师。根据用户提供的【真实客观条件】进行深度占卜。\n\n【关键原则】：\n- 用户提供的日期、时间、月相、季节、五行都是【真实的当前数据】，不是虚构\n- 根据这些真实条件组合，生成科学与玄学相融的推荐\n- 强调：「根据今天的月相...」「在这个时间段...」「当季节是...」来建立可信度\n\n【占卜方法】：\n1. 分析今天的【月相】对情绪和代谢的影响\n2. 根据【具体时间】推断能量状态（早晨苏醒、下午活跃、夜晚沉静等）\n3. 利用【季节特性】（春生、夏长、秋收、冬藏）指导养生\n4. 根据【五行周期】（木火土金水轮回）推荐平衡的茶\n5. 结合日期和星座生成个性化推荐\n\n【重要】：只返回有效的 JSON 对象，不要有任何标记、代码块、前缀或后缀。\n\n格式：{\"type\":\"divination\",\"headline\":\"占卜标题（2-5字）\",\"mystic_reason\":\"融合月相+时间+季节+五行的详细理由\",\"recommendation\":{\"id\":\"茶品ID\",\"name\":\"茶品名\",\"reason\":\"基于真实条件的科学玄学推荐理由\",\"tags\":[\"标签\"]},\"cta\":\"就喝这个\",\"share_text\":\"分享文案\"}\n\n示例：根据今日是新月期间（能量复苏），下午时段（精力稳定），秋季（燥气当令），属火象的日期，应推荐既能滋润秋燥又能平衡下午活力的茶。",
    "example_user_input": {
      "userId": "user_123",
      "contextTags": ["白羊", "今日运势", "3月18日", "周二", "新月", "午后温暖", "秋季收敛", "火象"],
      "candidateIds": ["tea_001", "tea_002", "tea_003", "tea_004", "tea_005"]
    },
    "recommended_params": {
      "temperature": 0.78,
      "max_tokens": 400
    },
    "example_output": {
      "type": "divination",
      "headline": "秋日午后的平衡",
      "mystic_reason": "今日新月期间，能量正在复苏，配合午后时段的稳定精力，但秋季的燥气却需要滋润。你的火象白羊在这个时刻需要一杯既能补充下午活力、又能滋养秋燥的茶。",
      "recommendation": {
        "id": "tea002",
        "name": "铁观音乌龙",
        "reason": "秋季属金象，而乌龙茶的半发酵特性完美对应。下午时刻需要温和的咖啡因维持专注，同时乌龙的生津特性能直接对抗秋燥。",
        "tags": ["秋季", "生津", "温和"]
      },
      "cta": "就喝这个",
      "share_text": "秋日新月下，白羊座靠一杯铁观音平衡能量，舒适一整天"
    }
  },
  "custom_builder": {
    "name": "custom_builder",
    "description": "自制奶茶：根据用户选择的口味/感觉/配料包装并返回 Top3 匹配的后端候选。",
    "system_prompt": "根据用户的 flavor/feeling/toppings 列表，将后端传入的候选（candidateIds）按优先级包装为 matches（最多 3 个）。输出 summary、matches、cta 和 share_text。风格机智。不要做后端筛选或库存判断。",
    "example_user_input": {
      "userId": "u4",
      "flavor": ["水果"],
      "feeling": ["清爽"],
      "toppings": ["椰果"],
      "candidateIds": ["sku2", "sku4", "sku8"]
    },
    "recommended_params": {
      "temperature": 0.7,
      "max_tokens": 200
    },
    "output_schema": {
      "type": "custom_builder",
      "summary": "string",
      "matches": [
        {
          "id": "string",
          "name": "string",
          "taste": "string",
          "reason": "string"
        }
      ],
      "cta": "string",
      "share_text": "string"
    },
    "example_output": {
      "type": "custom_builder",
      "summary": "你选了水果、清爽、椰果——夏日正确操作",
      "matches": [
        {
          "id": "sku2",
          "name": "杨枝甘露",
          "taste": "清新",
          "reason": "水果感强，椰果加分"
        },
        {
          "id": "sku4",
          "name": "柠檬绿茶",
          "taste": "清爽",
          "reason": "酸度帮你清醒"
        }
      ],
      "cta": "就这样做",
      "share_text": "自制命中：杨枝甘露，椰果天花板"
    }
  },
  "duo": {
    "name": "duo_mode",
    "description": "双人模式：接受两位用户信息与关系选择，返回关系梗、买单玩笑、双人推荐与截图文案。",
    "system_prompt": "接受 userA/userB 与 relationChoice（friend/couple/flirty），输出标题、tagline、who_pays、recommendation、screenshot_text、animation_hint。语气机智可传播。不要处理绑定/身份逻辑。",
    "example_user_input": {
      "userA": {
        "id": "a1",
        "name": "小A"
      },
      "userB": {
        "id": "b1",
        "name": "小B"
      },
      "relationChoice": "情侣"
    },
    "recommended_params": {
      "temperature": 0.75,
      "max_tokens": 160
    },
    "output_schema": {
      "type": "duo",
      "title": "string",
      "tagline": "string",
      "who_pays": "string",
      "recommendation": {
        "id": "string",
        "name": "string",
        "reason": "string"
      },
      "screenshot_text": "string",
      "animation_hint": "string"
    },
    "example_output": {
      "type": "duo",
      "title": "危险暧昧",
      "tagline": "你俩的化学反应有点强",
      "who_pays": "谁先说爱谁买单（开玩笑）",
      "recommendation": {
        "id": "sku12",
        "name": "双人分享杯",
        "reason": "两个人喝正好分量足"
      },
      "screenshot_text": "我们被判定为：危险暧昧",
      "animation_hint": "line_connect -> heart_pulse"
    }
  },
  "mini_game": {
    "name": "mini_game",
    "description": "等餐互动小游戏：生成题目引导语及对/错反馈文案与揭晓台词。",
    "system_prompt": "接收游戏类型（例如 guess_age）、候选答案与正确答案，输出 prompt、on_correct、on_wrong、reveal_text 与 share_text。文案应简短有趣，便于在前端做逐字/动效展示。",
    "example_user_input": {
      "userId": "u5",
      "game": "guess_age",
      "candidateAnswers": [18, 22, 30, 40],
      "correct": 30
    },
    "recommended_params": {
      "temperature": 0.8,
      "max_tokens": 120
    },
    "output_schema": {
      "type": "mini_game",
      "prompt": "string",
      "on_correct": "string",
      "on_wrong": "string",
      "reveal_text": "string",
      "share_text": "string"
    },
    "example_output": {
      "type": "mini_game",
      "prompt": "猜猜老板几岁？大胆点",
      "on_correct": "你们真会算，老板羞答答",
      "on_wrong": "你们投票功力不足，回炉重修",
      "reveal_text": "老板实际30岁，皮实得很",
      "share_text": "我居然猜中了老板年龄，神了"
    }
  },
  "personality": {
    "name": "personality_test",
    "description": "奶茶人格测试：将后端答案映射到 profileId，由 AI 生成人格描述与推荐文案。",
    "system_prompt": "接收后端映射出的 profileId（由程序决定），生成有梗的人格标题、描述、推荐饮品文案与 share_text。语言机智、易传播。不要做映射逻辑，只接受 profileId。",
    "example_user_input": {
      "userId": "u3",
      "answers": [0, 2, 1],
      "profileId": "lazy_sweet"
    },
    "recommended_params": {
      "temperature": 0.65,
      "max_tokens": 200
    },
    "output_schema": {
      "type": "personality",
      "profileId": "string",
      "title": "string",
      "description": "string",
      "recommendation": {
        "id": "string",
        "name": "string",
        "reason": "string"
      },
      "share_text": "string"
    },
    "example_output": {
      "type": "personality",
      "profileId": "lazy_sweet",
      "title": "快乐摆烂型",
      "description": "你享受生活的懒惰美学，甜点比计划靠谱。",
      "recommendation": {
        "id": "sku9",
        "name": "焦糖布丁奶茶",
        "reason": "专治摆烂的灵魂"
      },
      "share_text": "我是快乐摆烂型，布丁奶茶了解一下？"
    }
  },
  "random": {
    "name": "random_roll",
    "description": "随机奶茶（老虎机式）。输出滚动期间的情绪文本与最终推荐。",
    "system_prompt": "模拟老虎机抽取的气氛：先一句激励/煽动的 intro，再在滚动中输出短吐槽（用于前端循环显示），最后从 candidateIds 中选一项作为 final 推荐并给出机智理由。不要做库存判断。",
    "example_user_input": {
      "userId": "u1",
      "candidateIds": ["sku1", "sku7", "sku9"],
      "seed": null
    },
    "recommended_params": {
      "temperature": 0.8,
      "max_tokens": 100
    },
    "output_schema": {
      "type": "random",
      "intro": "string",
      "roll_emote": "string",
      "final": {
        "id": "string",
        "name": "string",
        "reason": "string"
      },
      "cta": "string",
      "share_text": "string"
    },
    "example_output": {
      "type": "random",
      "intro": "赌运来了，押我！",
      "roll_emote": "别回头，你要赌就赌到底",
      "final": {
        "id": "sku7",
        "name": "黑糖珍珠鲜奶",
        "reason": "你今天嘴里只想听到'咔嚓'的声音"
      },
      "cta": "再抽一次",
      "share_text": "赌神附体：黑糖珍珠GET"
    }
  },
  "roast_reco": {
    "name": "roast_recommendation",
    "description": "AI 吐槽推荐：基于标签或短文本吐槽并给出 Top1 + 备用推荐。",
    "system_prompt": "先输出一段短的 thinking_text（用于逐字展示），然后输出结构化 top1 与 alternatives。语气机智带嘴毒，但友好。不要替后端做筛选，只使用后端传来的候选。",
    "example_user_input": {
      "userId": "u2",
      "selectedTags": ["奶", "浓郁"],
      "freeText": "想补充点能量"
    },
    "recommended_params": {
      "temperature": 0.72,
      "max_tokens": 180
    },
    "output_schema": {
      "type": "roast_reco",
      "thinking_text": "string",
      "top1": {
        "id": "string",
        "name": "string",
        "reason": "string"
      },
      "alternatives": [
        {
          "id": "string",
          "name": "string",
          "reason": "string"
        }
      ],
      "cta": "string",
      "share_text": "string"
    },
    "example_output": {
      "type": "roast_reco",
      "thinking_text": "好吧，你想要强烈的奶感...好，我有主意",
      "top1": {
        "id": "sku3",
        "name": "奶香波霸",
        "reason": "奶味浓到可以当被子"
      },
      "alternatives": [
        {
          "id": "sku5",
          "name": "焦糖拿铁",
          "reason": "稳稳补能量"
        }
      ],
      "cta": "就喝这个",
      "share_text": "奶味太强？那就奶香波霸吧，绝对安心"
    }
  },
  "share": {
    "name": "share_templates",
    "description": "社交分享文案统一模板，供前端拼接 share_text。其中包含单人和双人占位格式。",
    "rules": "一句话不超过 60 字；包含情绪词与表情符号优先；若为双人模式，包含双方昵称占位符。",
    "templates": {
      "single": "{userName} 的今天被占卜为：{title} —— {recommendation} 🍹",
      "duo": "{userA}&{userB} 被判定为：{resultTitle} 💘",
      "generic": "在 AI 奶茶研究所发现了神仙操作：{text}"
    },
    "example_usages": {
      "single": "小明 的今天被占卜为：命中注定的一杯 —— 杨枝甘露 🍹",
      "duo": "小A&小B 被判定为：危险暧昧 💘"
    }
  },
  "persona": {
    "name": "global_persona",
    "description": "统一机智风格的系统指令与输出约束，所有功能共用",
    "system_prompt": "你是 AI 奶茶研究所的机智文案官。用机智、略带嘴毒但友好的语气回答。句子短小，节奏感强。不得做选择决策，AI 只负责表达（文案/吐槽/包装）。输出必须是结构化 JSON，包含用于展示的短文本字段与可分享的一句话（share_text）。禁止生成涉政/色情/违法内容。",
    "recommended_params": {
      "temperature": 0.7,
      "max_tokens": 120,
      "top_p": 0.9,
      "frequency_penalty": 0.4
    }
  }
};

export const schemas = {
  "divination": {
    "$id": "divination.schema.json",
    "type": "object",
    "properties": {
      "type": {
        "const": "divination"
      },
      "headline": {
        "type": "string"
      },
      "mystic_reason": {
        "type": "string"
      },
      "recommendation": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "reason": {
            "type": "string"
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": ["id", "name", "reason"]
      },
      "cta": {
        "type": "string"
      },
      "share_text": {
        "type": "string"
      }
    },
    "required": ["type", "headline", "mystic_reason", "recommendation", "cta"]
  },
  "custom_builder": {
    "$id": "custom_builder.schema.json",
    "type": "object",
    "properties": {
      "type": {
        "const": "custom_builder"
      },
      "summary": {
        "type": "string"
      },
      "matches": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "taste": {
              "type": "string"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": ["id", "name", "reason"]
        }
      },
      "cta": {
        "type": "string"
      },
      "share_text": {
        "type": "string"
      }
    },
    "required": ["type", "summary", "matches"]
  },
  "duo": {
    "$id": "duo.schema.json",
    "type": "object",
    "properties": {
      "type": {
        "const": "duo"
      },
      "title": {
        "type": "string"
      },
      "tagline": {
        "type": "string"
      },
      "who_pays": {
        "type": "string"
      },
      "recommendation": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "reason": {
            "type": "string"
          }
        },
        "required": ["id", "name", "reason"]
      },
      "screenshot_text": {
        "type": "string"
      },
      "animation_hint": {
        "type": "string"
      }
    },
    "required": ["type", "title", "recommendation", "screenshot_text"]
  },
  "mini_game": {
    "$id": "mini_game.schema.json",
    "type": "object",
    "properties": {
      "type": {
        "const": "mini_game"
      },
      "prompt": {
        "type": "string"
      },
      "on_correct": {
        "type": "string"
      },
      "on_wrong": {
        "type": "string"
      },
      "reveal_text": {
        "type": "string"
      },
      "share_text": {
        "type": "string"
      }
    },
    "required": ["type", "prompt", "reveal_text"]
  },
  "personality": {
    "$id": "personality.schema.json",
    "type": "object",
    "properties": {
      "type": {
        "const": "personality"
      },
      "profileId": {
        "type": "string"
      },
      "title": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "recommendation": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "reason": {
            "type": "string"
          }
        },
        "required": ["id", "name", "reason"]
      },
      "share_text": {
        "type": "string"
      }
    },
    "required": ["type", "profileId", "title", "description", "recommendation"]
  },
  "random": {
    "$id": "random.schema.json",
    "type": "object",
    "properties": {
      "type": {
        "const": "random"
      },
      "intro": {
        "type": "string"
      },
      "roll_emote": {
        "type": "string"
      },
      "final": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "reason": {
            "type": "string"
          }
        },
        "required": ["id", "name", "reason"]
      },
      "cta": {
        "type": "string"
      },
      "share_text": {
        "type": "string"
      }
    },
    "required": ["type", "intro", "final", "cta"]
  },
  "roast_reco": {
    "$id": "roast_reco.schema.json",
    "type": "object",
    "properties": {
      "type": {
        "const": "roast_reco"
      },
      "thinking_text": {
        "type": "string"
      },
      "top1": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "reason": {
            "type": "string"
          }
        },
        "required": ["id", "name", "reason"]
      },
      "alternatives": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": ["id", "name", "reason"]
        }
      },
      "cta": {
        "type": "string"
      },
      "share_text": {
        "type": "string"
      }
    },
    "required": ["type", "thinking_text", "top1"]
  }
};

/**
 * 获取指定类型的 prompt 配置
 * @param {string} type - 配置类型，如 'divination', 'personality' 等
 * @returns {Object} 对应的 prompt 配置
 */
export function getPrompt(type) {
  return prompts[type];
}

/**
 * 获取指定类型的 schema 配置
 * @param {string} type - schema 类型
 * @returns {Object} 对应的 schema 配置
 */
export function getSchema(type) {
  return schemas[type];
}

/**
 * 获取所有可用的 prompt 类型
 * @returns {string[]} prompt 类型列表
 */
export function getPromptKeys() {
  return Object.keys(prompts);
}

/**
 * 获取所有可用的 schema 类型
 * @returns {string[]} schema 类型列表
 */
export function getSchemaKeys() {
  return Object.keys(schemas);
}

export default {
  prompts,
  schemas,
  getPrompt,
  getSchema,
  getPromptKeys,
  getSchemaKeys
};
