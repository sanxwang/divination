-- Seed products for demo
INSERT INTO products(id, name, price_cents, tags, available, metadata)
VALUES
  ('sku1','杨枝甘露',2200, ARRAY['水果','甜'], TRUE, '{"image":"/img/yangzhi.png"}'),
  ('sku2','黑糖珍珠鲜奶',1800, ARRAY['甜','奶盖'], TRUE, '{"image":"/img/brown_sugar.png"}'),
  ('sku3','柠檬绿茶',1500, ARRAY['清爽','茶'], TRUE, '{"image":"/img/lemon_tea.png"}');
