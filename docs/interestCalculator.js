const inputStartingAmount = document.getElementById('startingAmount')
const inputAmount = document.getElementById('amount')
const inputRate = document.getElementById('rate')
const inputYears = document.getElementById('years')
const inputRadioOnce = document.getElementById('once')
const inputRadioWeekly = document.getElementById('weekly')
const inputRadioMonthly = document.getElementById('monthly')
const inputRadioYearly = document.getElementById('yearly')
const outputResult = document.getElementById('hiddenResult')
const outputSummary = document.getElementById('summary')
const outputResultDataTable = document.getElementById('resultTable');
const sliderRate = document.getElementById('rateRange');
const sliderYears = document.getElementById('yearsRange');

let result = 0
let startingAmount = 0
let amount = 0
let rate = 1.00
let years = 1
let frequency = "once"
let xValues = []
let yValues = [{total: 0, depositedAmount: 0, yearlyInterest: 0, totalInterest: 0}]

var localJsonObject = JSON.parse(localStorage.getItem('savedJsonObject'));

if (localJsonObject != null){
  loadJsonToForm(localJsonObject)
}

function getInputValues() {
  startingAmount = parseFloat(inputStartingAmount.value)
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
  getInputValues();

  result = startingAmount;
  let resultData = [];
  let interest = 0;

  for (let i = 0; i < years; i++) {
    if(inputRadioYearly.checked || (inputRadioOnce.checked && i < 1))
      result = result + amount;
    if(inputRadioMonthly.checked)
      result = result + (amount*12);
    if(inputRadioWeekly.checked)
      result = result + (amount*52);

    interest = result * (rate/100);

    result = result + interest;

    if(inputRadioYearly.checked || (inputRadioOnce.checked && i < 1))
      deposit = startingAmount + (amount * i);
    if(inputRadioMonthly.checked)
      deposit = startingAmount + (amount * 12 * i);
    if(inputRadioWeekly.checked)
      deposit = startingAmount + (amount * 52 * i);

    resultData.push({total: result, depositedAmount: deposit, yearlyInterest: interest, totalInterest: result - deposit});
  }

  outputSummary.innerHTML = result.toLocaleString('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  });

  yValues = resultData;

  saveToJSON();
}

function resetForm() {
  loadJsonToForm(JSON.parse(localStorage.getItem('savedJsonObject')))
}

function loadJsonToForm(getJson){
  inputStartingAmount.value = getJson.startingAmount != null ? getJson.startingAmount : 0
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
  startingAmount = parseFloat(inputStartingAmount.value)
  amount = parseFloat(inputAmount.value)
  rate = parseFloat(inputRate.value)
  years = parseFloat(inputYears.value)

  var jsonObject = { 
    'startingAmount': startingAmount,
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


// Create a HTML-table for jsonData and visualize it in outputResultDataTable 
function createDataTable() {
  const jsonData = JSON.parse(localStorage.getItem('savedJsonObject'))

  let table = document.createElement('table');
  table.classList.add('table');
  table.classList.add('table-striped');

  let tableBody = document.createElement('tbody');

  let tableHead = document.createElement('thead');
  tableBody.appendChild(tableHead);

  let tableHeadRow = document.createElement('tr');
  tableBody.appendChild(tableHeadRow);

  let tableHeadRowYear = document.createElement('th');
  tableHeadRowYear.appendChild(document.createTextNode("År"));
  tableBody.appendChild(tableHeadRowYear);

  let tableHeadRowData = document.createElement('th');
  tableHeadRowData.appendChild(document.createTextNode("Totalt belopp"));
  tableBody.appendChild(tableHeadRowData);

  let tableHeadRowDeposits = document.createElement('th');
  tableHeadRowDeposits.appendChild(document.createTextNode("Insatt belopp"));
  tableBody.appendChild(tableHeadRowDeposits);

  let tableHeadRowInterest = document.createElement('th');
  tableHeadRowInterest.appendChild(document.createTextNode("Total ränta"));
  tableBody.appendChild(tableHeadRowInterest);

  let tableHeadRowYearlyInterest = document.createElement('th');
  tableHeadRowYearlyInterest.appendChild(document.createTextNode("Årets ränta"));
  tableBody.appendChild(tableHeadRowYearlyInterest);

  for (let i = 0; i < jsonData.years; i++) {
    let tableRow = document.createElement('tr');
    let tableRowData = document.createElement('td');
    tableRowData.appendChild(document.createTextNode("År " + (i+1)));
    
    let tdResultData = document.createElement('td');
    let resultCurrency = jsonData.resultData[i].total.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    })
    tdResultData.appendChild(document.createTextNode(resultCurrency));

    let tdDepositedAmountData = document.createElement('td');
    let depositCurrency = jsonData.resultData[i].depositedAmount.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    })
    tdDepositedAmountData.appendChild(document.createTextNode(depositCurrency));

    let tdResultTotalInterest = document.createElement('td');
    let resultTotalInterestCurrency = jsonData.resultData[i].totalInterest.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    })
    tdResultTotalInterest.appendChild(document.createTextNode(resultTotalInterestCurrency));
    
    let tdResultYearlyInterest = document.createElement('td');
    let resultYearlyInterestCurrency = jsonData.resultData[i].yearlyInterest.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    })
    tdResultYearlyInterest.appendChild(document.createTextNode(resultYearlyInterestCurrency));

    tableRow.appendChild(tableRowData);
    tableRow.appendChild(tdResultData);
    tableRow.appendChild(tdDepositedAmountData);
    tableRow.appendChild(tdResultTotalInterest);
    tableRow.appendChild(tdResultYearlyInterest);

    tableBody.appendChild(tableRow);
  }
  table.appendChild(tableBody);

  // Check if outputResultDataTable exists before setting innerHTML
  if (outputResultDataTable) {
    outputResultDataTable.innerHTML = table.outerHTML;
  } else {
    console.error("outputResultDataTable element not found.");
  }
}

// Visar grafen: 
document.addEventListener("DOMContentLoaded", function () {

  const jsonData = JSON.parse(localStorage.getItem('savedJsonObject'))

  const ctx = document.getElementById('myChart');
  const ctxYearly = document.getElementById('yearlyChart');
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
    datasets: [
      {
        label: 'Ränta på ränta',
        data: jsonData.resultData.map(x => x.total),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        pointStyle: 'rectRot', //'rectRot', 'triangle' or 'circle'
        pointRadius: 10, //size
        pointHoverRadius: 20, //hoverSize
        tension: 0.1
      },{
        label: 'Insatt belopp',
        data: jsonData.resultData.map(x => x.depositedAmount),
        fill: false,
        borderColor: 'rgb(240, 192, 192)',
        pointStyle: 'rectRot', //'rectRot', 'triangle' or 'circle'
        pointRadius: 10, //size
        pointHoverRadius: 20, //hoverSize
        tension: 0.1
      }
    ]
  };

  const yearlyData = {
    labels: getLabels(),
    datasets: [
      {
        label: 'Årets insättning',
        data: jsonData.amount,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        pointStyle: 'rectRot', //'rectRot', 'triangle' or 'circle'
        pointRadius: 10, //size
        pointHoverRadius: 20, //hoverSize
        tension: 0.1
      },{
        label: 'Årets ränta',
        data: jsonData.resultData.map(x => x.yearlyInterest),
        fill: false,
        borderColor: 'rgb(240, 192, 192)',
        pointStyle: 'rectRot', //'rectRot', 'triangle' or 'circle'
        pointRadius: 10, //size
        pointHoverRadius: 20, //hoverSize
        tension: 0.1
      }
    ]
  };

  //Från: https://www.chartjs.org/docs/latest/charts/line.html#stacked-area-chart
  const stackedLine = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        scales: {
            y: {
                stacked: false
            }
        }
    }
  });

  new Chart(ctxYearly, {
    type: 'line',
    data: yearlyData,
    options: {
        scales: {
            y: {
                stacked: false
            }
        }
    }
  });

  // Skapar resultat-tabellen
  createDataTable();
});