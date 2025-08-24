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
  "高校生": { "男性": { energy:2500, protein:55, fat:70, carb:350, calcium:750, iron:13, vitaminA:900, vitaminC:90, salt:4 },
               "女性": { energy:2200, protein:50, fat:60, carb:300, calcium:750, iron:13, vitaminA:900, vitaminC:90, salt:4 }},
  "成人": { "男性": { energy:2600, protein:60, fat:70, carb:350, calcium:800, iron:12, vitaminA:900, vitaminC:100, salt:7 },
             "女性": { energy:2000, protein:50, fat:60, carb:300, calcium:800, iron:12, vitaminA:900, vitaminC:100, salt:6 }},
  "高齢者": { "男性": { energy:2200, protein:50, fat:60, carb:300, calcium:800, iron:10, vitaminA:900, vitaminC:100, salt:6 },
               "女性": { energy:1800, protein:45, fat:50, carb:250, calcium:800, iron:10, vitaminA:900, vitaminC:100, salt:5 }}
};

// JSON読み込み
fetch('foods.json')
  .then(res => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then(data => {
    FOODS = data;
    populateCategory();
    renderFoodList(FOODS);
  })
  .catch(err => console.error('JSON取得失敗:', err));

// カテゴリ選択肢生成
function populateCategory() {
  const categories = [...new Set(FOODS.map(f => f.category))];
  const select = document.getElementById('category');
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// 食品リスト描画
function renderFoodList(list) {
  const container = document.getElementById('food-list');
  container.innerHTML = list.map(f => `
    <div class="food-item category-${f.category}">
      ${f.name} (${f.category})
      <input type="number" min="1" value="100" data-id="${f.id}" class="grams">
      <button onclick="addFood(${f.id})">追加</button>
    </div>
  `).join('');
}

// フィルター
function filterFoods() {
  const category = document.getElementById('category').value;
  const keyword = document.getElementById('keyword').value.toLowerCase();
  const filtered = FOODS.filter(f =>
    (category === 'all' || f.category === category) &&
    f.name.toLowerCase().includes(keyword)
  );
  renderFoodList(filtered);
}

// 食品追加
function addFood(id) {
  const food = FOODS.find(f => f.id === id);
  const grams = parseFloat(document.querySelector(`input[data-id='${id}']`).value);
  state.selected.push({ ...food, grams });
  renderSelected();
}

// 選択食品描画
function renderSelected() {
  const tbody = document.getElementById('selected-list');
  tbody.innerHTML = state.selected.map((f, i) => `
    <tr>
      <td>${f.name}</td>
      <td><input type="number" min="1" value="${f.grams}" onchange="updateGrams(${i}, this.value)"></td>
      <td>${(f.energy * f.grams / 100).toFixed(1)}</td>
      <td>${(f.protein * f.grams / 100).toFixed(1)}</td>
      <td>${(f.fat * f.grams / 100).toFixed(1)}</td>
      <td>${(f.carb * f.grams / 100).toFixed(1)}</td>
      <td>${(f.calcium * f.grams / 100).toFixed(1)}</td>
      <td>${(f.iron * f.grams / 100).toFixed(1)}</td>
      <td>${(f.vitaminA * f.grams / 100).toFixed(1)}</td>
      <td>${(f.vitaminC * f.grams / 100).toFixed(1)}</td>
      <td>${(f.salt * f.grams / 100).toFixed(2)}</td>
      <td><button onclick="removeFood(${i})">削除</button></td>
    </tr>
  `).join('');
  updateTotals();
  updateChart();
}

// グラム変更
function updateGrams(index, grams) {
  state.selected[index].grams = parseFloat(grams);
  renderSelected();
}

// 食品削除
function removeFood(index) {
  state.selected.splice(index, 1);
  renderSelected();
}

// 合計計算
function updateTotals() {
  const totals = { energy:0, protein:0, fat:0, carb:0, calcium:0, iron:0, vitaminA:0, vitaminC:0, salt:0 };
  state.selected.forEach(f => {
    totals.energy += f.energy*f.grams/100;
    totals.protein += f.protein*f.grams/100;
    totals.fat += f.fat*f.grams/100;
    totals.carb += f.carb*f.grams/100;
    totals.calcium += f.calcium*f.grams/100;
    totals.iron += f.iron*f.grams/100;
    totals.vitaminA += f.vitaminA*f.grams/100;
    totals.vitaminC += f.vitaminC*f.grams/100;
    totals.salt += f.salt*f.grams/100;
  });

  document.getElementById('totals').innerHTML = `
    <strong>合計:</strong>
    エネルギー: ${totals.energy.toFixed(1)} kcal /
    タンパク質: ${totals.protein.toFixed(1)} g /
    脂質: ${totals.fat.toFixed(1)} g /
    炭水化物: ${totals.carb.toFixed(1)} g /
    カルシウム: ${totals.calcium.toFixed(1)} mg /
    鉄: ${totals.iron.toFixed(1)} mg /
    ビタミンA: ${totals.vitaminA.toFixed(1)} μg /
    ビタミンC: ${totals.vitaminC.toFixed(1)} mg /
    塩分: ${totals.salt.toFixed(2)} g
  `;
}

// グラフ更新
function updateChart() {
  const totals = { energy:0, protein:0, fat:0, carb:0, calcium:0, iron:0, vitaminA:0, vitaminC:0, salt:0 };
  state.selected.forEach(f => {
    totals.energy += f.energy*f.grams/100;
    totals.protein += f.protein*f.grams/100;
    totals.fat += f.fat*f.grams/100;
    totals.carb += f.carb*f.grams/100;
    totals.calcium += f.calcium*f.grams/100;
    totals.iron += f.iron*f.grams/100;
    totals.vitaminA += f.vitaminA*f.grams/100;
    totals.vitaminC += f.vitaminC*f.grams/100;
    totals.salt += f.salt*f.grams/100;
  });

  const age = document.getElementById('age-category').value;
  const sex = document.getElementById('sex').value;
  const goal = NUTRI_GOALS[age][sex];

  const ctx = document.getElementById('nutritionChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'エネルギー', 'タンパク質', '脂質', '炭水化物',
        'カルシウム', '鉄', 'ビタミンA', 'ビタミンC', '塩分'
      ],
      datasets: [
        {
          label: '合計栄養素',
          data: [
            totals.energy, totals.protein, totals.fat, totals.carb,
            totals.calcium, totals.iron, totals.vitaminA, totals.vitaminC, totals.salt
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: '目標値',
          data: [
            goal.energy, goal.protein, goal.fat, goal.carb,
            goal.calcium, goal.iron, goal.vitaminA, goal.vitaminC, goal.salt
          ],
          type: 'line',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// 検索バーの表示/非表示切り替え
function toggleSearch() {
  const search = document.getElementById('search-area');
  if (search.style.display === 'none' || search.style.display === '') {
    search.style.display = 'flex';
  } else {
    search.style.display = 'none';
  }
}
