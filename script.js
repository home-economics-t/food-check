// script.js
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


// Chart.js更新
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


const ctx = document.getElementById('nutritionChart').getContext('2d');
if(chart) chart.destroy();


chart = new Chart(ctx, {
type: 'bar',
data: {
labels: ['エネルギー','タンパク質','脂質','炭水化物','カルシウム','鉄','ビタミンA','ビタミンC','塩分'],
datasets: [{
label: '摂取量',
data: [totals.energy, totals.protein, totals.fat, totals.carb, totals.calcium, totals.iron, totals.vitaminA, totals.vitaminC, totals.salt],
backgroundColor: 'rgba(54, 162, 235, 0.6)'
}]
},
options: {
responsive: true,
scales: {
y: { beginAtZero: true }
}
}
});
}