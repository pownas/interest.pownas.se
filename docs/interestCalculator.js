const inputAmount = document.getElementById('amount')
const inputRate = document.getElementById('rate')
const inputYears = document.getElementById('years')
const inputRadioOnce = document.getElementById('once')
const inputRadioWeekly = document.getElementById('weekly')
const inputRadioMonthly = document.getElementById('monthly')
const inputRadioYearly = document.getElementById('yearly')
const outputResult = document.getElementById('hiddenResult')
const outputSummary = document.getElementById('summary')
const sliderRate = document.getElementById('rateRange');
const sliderYears = document.getElementById('yearsRange');

let result = 0
let amount = 0
let rate = 1.00
let years = 1
let frequency = "once"
let xValues = []
let yValues = []

var localJsonObject = JSON.parse(localStorage.getItem('savedJsonObject'));

if (localJsonObject != null){
  loadJsonToForm(localJsonObject)
}

function getInputValues() {
  amount = parseFloat(inputAmount.value)
  rate = parseFloat(inputRate.value)
  years = parseFloat(inputYears.value)

  if(inputRadioYearly.checked)
    frequency = "once"
  if(inputRadioYearly.checked)
    frequency = "yearly"
  if(inputRadioMonthly.checked)
    frequency = "monthly"
  if(inputRadioWeekly.checked)
    frequency = "weekly"
}

function submitForm() {
  result = 0
  getInputValues()

  var resultData = []
  
  for (let i = 0; i < years; i++) {
    if(inputRadioYearly.checked || inputRadioOnce.checked && i < 1)
      result = result + amount
    if(inputRadioMonthly.checked)
      result = result + (amount*12)
    if(inputRadioWeekly.checked)
      result = result + (amount*52) 

    result = (result * (rate/100)) + result

    resultData.push(result)
  }
  outputSummary.innerHTML = result.toLocaleString('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  })

  yValues = resultData

  saveToJSON()
}

function resetForm() {
  loadJsonToForm(JSON.parse(localStorage.getItem('savedJsonObject')))
}

function loadJsonToForm(getJson){
  inputAmount.value = getJson.amount != null ? getJson.amount : 0
  inputRate.value = getJson.rate != null ? getJson.rate : 0
  inputYears.value = getJson.years != null ? getJson.years : 0
  outputResult.value = getJson.result != null ? getJson.result : 0
  outputSummary.innerHTML = (getJson.result).toLocaleString('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  })

  sliderRate.value = inputRate.value
  sliderYears.value = inputYears.value
  
  if(getJson.frequency == "once")
    inputRadioOnce.checked = true
  else
    inputRadioOnce.checked = false
  
  if(getJson.frequency == "yearly")
    inputRadioYearly.checked = true
  else
    inputRadioYearly.checked = false

  if(getJson.frequency == "monthly")
    inputRadioMonthly.checked = true
  else
    inputRadioMonthly.checked = false

  if(getJson.frequency == "weekly")
    inputRadioWeekly.checked = true
  else
    inputRadioWeekly.checked = false
  
}

function saveToJSON() { 
  getInputValues()
  amount = parseFloat(inputAmount.value)
  rate = parseFloat(inputRate.value)
  years = parseFloat(inputYears.value)

  var jsonObject = { 
    'amount': amount,
    'frequency': frequency,
    'rate': rate,
    'years': years,
    'result': result,
    'resultData': yValues,
  };

  //Lagrar ned jsonObject i localStorage med namnet: "savedJsonObject" på användarens dator. 
  localStorage.setItem('savedJsonObject', JSON.stringify(jsonObject));
}


sliderRate.oninput = function() {
  inputRate.value = sliderRate.value
  submitForm()
}

inputRate.oninput = function() {
  sliderRate.value = inputRate.value
  submitForm()
}

sliderYears.oninput = function() {
  inputYears.value = sliderYears.value
  submitForm()
}

inputYears.oninput = function() {
  sliderYears.value = inputYears.value
  submitForm()
}

inputAmount.oninput = function() {
  submitForm()
}

// Visar grafen: 
document.addEventListener("DOMContentLoaded", function () {

  const jsonData = JSON.parse(localStorage.getItem('savedJsonObject'))

  const ctx = document.getElementById('myChart');
  let labels = [];

  function getLabels(){
    labels = []
    for (let i = 1; i < jsonData.years+1; i++) {
      labels.push("År " + i);
    }
    return labels
  }

  //Från: https://www.chartjs.org/docs/latest/charts/line.html#line-chart
  const data = {
    labels: getLabels(),
    datasets: [{
      label: 'Ränta på ränta',
      data: jsonData.resultData,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      pointStyle: 'rectRot', //'rectRot', 'triangle' or 'circle'
      pointRadius: 10, //size
      pointHoverRadius: 20, //hoverSize
      tension: 0.1
    }]
  };

  //Från: https://www.chartjs.org/docs/latest/charts/line.html#stacked-area-chart
  const stackedLine = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        scales: {
            y: {
                stacked: true
            }
        }
    }
  });
});