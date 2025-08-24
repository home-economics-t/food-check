let FOODS = [];
let state = { selected: [] };
let chart = null;

const FOOD_GROUPS = {
  "主食":1, "乳製品":2, "卵・大豆製品":3, "野菜":4, "果物":5, "肉・魚":6
};

const NUTRI_GOALS = {
  "幼児": { "男性": { energy:1200, protein:20, fat:30, carb:150, calcium:500, iron:5, vitaminA:300, vitaminC:40, salt:2 },
            "女性": { energy:1100, protein:18, fat:28, carb:140, calcium:500, iron:5, vitaminA:300, vitaminC:40, salt:2 }},
  // 他の年齢層も同様に
};

fetch('foods.json')
  .then(res => res.json())
  .then(data => {
    FOODS = data;
    populateCategory();
    renderFoodList(FOODS);
  })
  .catch(err => console.error('JSON取得失敗:', err));
function populateCategory(){
  const categories = [...new Set(FOODS.map(f => f.category))];
  const select = document.getElementById('category');
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function renderFoodList(list){
  const container = document.getElementById('food-list');
  container.innerHTML = list.map(f=>{
    const groupClass = FOOD_GROUPS[f.category] ? 'group-' + FOOD_GROUPS[f.category] : '';
    return `<div class="food-item ${groupClass}">
      <span>${f.name} (${f.category})</span>
      <input type="number" min="1" value="100" data-id="${f.id}" class="grams">
      <button onclick="addFood(${f.id})">追加</button>
    </div>`;
  }).join('');
}

function filterFoods(){
  const category = document.getElementById('category').value;
  const keyword = document.getElementById('keyword').value.toLowerCase();
  renderFoodList(FOODS.filter(f =>
    (category === 'all' || f.category === category) &&
    f.name.toLowerCase().includes(keyword)
  ));
}
function addFood(id){
  const food = FOODS.find(f => f.id === id);
  const grams = parseFloat(document.querySelector(`input[data-id='${id}']`).value);
  state.selected.push({...food, grams});
  renderSelected();
}

function renderSelected(){
  const tbody = document.getElementById('selected-list');
  tbody.innerHTML = state.selected.map((f,i)=>`
    <tr>
      <td>${f.name}</td>
      <td><input type="number" min="1" value="${f.grams}" onchange="updateGrams(${i}, this.value)"></td>
      <td>${(f.energy*f.grams/100).toFixed(1)}</td>
      <td>${(f.protein*f.grams/100).toFixed(1)}</td>
      <td>${(f.fat*f.grams/100).toFixed(1)}</td>
      <td>${(f.carb*f.grams/100).toFixed(1)}</td>
      <td>${(f.calcium*f.grams/100).toFixed(1)}</td>
      <td>${(f.iron*f.grams/100).toFixed(1)}</td>
      <td>${(f.vitaminA*f.grams/100).toFixed(1)}</td>
      <td>${(f.vitaminC*f.grams/100).toFixed(1)}</td>
      <td>${(f.salt*f.grams/100).toFixed(2)}</td>
      <td><button onclick="removeFood(${i})">削除</button></td>
    </tr>
  `).join('');
  updateTotals();
  updateChart();
}

function updateGrams(index, grams){
  state.selected[index].grams = parseFloat(grams);
  renderSelected();
}

function removeFood(index){
  state.selected.splice(index, 1);
  renderSelected();
}
function updateTotals(){
  const totals = {energy:0, protein:0, fat:0, carb:0, calcium:0, iron:0, vitaminA:0, vitaminC:0, salt:0};
  state.selected.forEach(f => {
    totals.energy += f.energy * f.grams / 100;
    totals.protein += f.protein * f.grams / 100;
    totals.fat += f.fat * f.grams / 100;
    totals.carb += f.carb * f.grams / 100;
    totals.calcium += f.calcium * f.grams / 100;
    totals.iron += f.iron * f.grams / 100;
    totals.vitaminA += f.vitaminA * f.grams / 100;
    totals.vitaminC += f.vitaminC * f.grams / 100;
    totals.salt += f.salt * f.grams / 100;
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

function updateChart(){
  const totals = {energy:0, protein:0, fat:0, carb:0, calcium:0, iron:0, vitaminA:0, vitaminC:0, salt:0};
  state.selected.forEach(f => {
    totals.energy += f.energy * f.grams / 100;
    totals.protein += f.protein * f.grams / 100;
    totals.fat += f.fat * f.grams / 100;
    totals.carb += f.carb * f.grams / 100;
    totals.calcium += f.calcium * f.grams / 100;
    totals.iron += f.iron * f.grams / 100;
    totals.vitaminA += f.vitaminA * f.grams / 100;
    totals.vitaminC += f.vitaminC * f.grams / 100;
    totals.salt += f.salt * f.grams / 100;
  });

  const age = document.getElementById('age-category').value;
  const sex = document.getElementById('sex').value;
  const goal = NUTRI_GOALS[age][sex];

  const ctx = document.getElementById('nutritionChart').getContext('2d');
  if(chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['エネルギー','タンパク質','脂質','炭水化物','カルシウム','鉄','ビタミンA','ビタミンC','塩分'],
      datasets: [
        {
          label: '合計栄養素',
          data: [totals.energy, totals.protein, totals.fat, totals.carb, totals.calcium, totals.iron, totals.vitaminA, totals.vitaminC, totals.salt],
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: '目標値',
          data: [goal.energy, goal.protein, goal.fat, goal.carb, goal.calcium, goal.iron, goal.vitaminA, goal.vitaminC, goal.salt],
          type: 'line',
          borderColor: 'rgba(255, 99, 132, 0.7)',
          borderWidth: 2,
          borderDash: [5,5],   // 点線
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
function toggleSearch(){
  const panel = document.getElementById('search-food-panel');
  if(panel.style.display === 'none' || panel.style.display === ''){
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}
