let FOODS = [];
let state = { selected: [] };
let chart = null;

// 年齢/性別ごとの目標値（サンプル、必要に応じて拡張）
const NUTRI_GOALS = {
  "幼児": { "男性": { energy:1200, protein:20, fat:30, carb:150, calcium:500, iron:5, vitaminA:300, vitaminC:40, salt:2 },
            "女性": { energy:1100, protein:18, fat:28, carb:140, calcium:500, iron:5, vitaminA:300, vitaminC:40, salt:2 }},
  "小学生": { "男性": { energy:1800, protein:30, fat:40, carb:220, calcium:600, iron:8, vitaminA:500, vitaminC:60, salt:3 },
               "女性": { energy:1700, protein:28, fat:38, carb:210, calcium:600, iron:8, vitaminA:500, vitaminC:60, salt:3 }},
  "中学生": { "男性": { energy:2200, protein:50, fat:60, carb:300, calcium:700, iron:12, vitaminA:700, vitaminC:80, salt:3.5 },
               "女性": { energy:2000, protein:45, fat:55, carb:270, calcium:700, iron:12, vitaminA:700, vitaminC:80, salt:3.5 }},
  "高校生": { "男性": { energy:2500, protein:55, fat:70, carb:350, calcium:750, iron:13, vitaminA:
