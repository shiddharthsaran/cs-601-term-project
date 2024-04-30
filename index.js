import {getStockSearch} from './modules/functions.js';
import {formatDate} from './modules/functions.js';
import {getStockPrices} from './modules/functions.js';
import PortfolioClass from './modules/functions.js';

document.addEventListener("DOMContentLoaded", function(){
const searchInput = document.getElementById("searchInput");
const searchTitle = document.getElementById("searchTitle");
const searchSuggestions = document.getElementById("searchSuggestions");
const searchBtn = document.getElementById("searchBtn");
const portfolioValue = document.getElementById("portfolioValue");
const userAmount = document.getElementById("userAmount");
const addPortfolio = document.getElementById("addPortfolio");




let portfolioDetails = {
    "currentPortfolioId":1,
    "portfolioId":2,
    1:new PortfolioClass().getDetails()
    
};

searchInput.addEventListener("keyup", function(){
    const userInput = searchInput.value;
    getStockSearch(userInput);
    
    
})

let localPortfolioDetails = JSON.parse(localStorage.getItem('portfolioDetails'));
if(localPortfolioDetails == null){
    localStorage.setItem('portfolioDetails',JSON.stringify(portfolioDetails));
    localPortfolioDetails = JSON.parse(localStorage.getItem('portfolioDetails'));
}
let currentPortfolioId;
const portfolioLis = document.getElementById("portfolioLis");
Object.keys(localPortfolioDetails).forEach( keyVal => {
    if(keyVal == 'currentPortfolioId' || keyVal == 'portfolioId'){
        currentPortfolioId = localPortfolioDetails['currentPortfolioId'];
    }

    else{
        const li = document.createElement("li");
        li.id = "portfolio" + keyVal;
        if(keyVal == localPortfolioDetails['currentPortfolioId']){
            const span = document.createElement("span");
            span.innerText = "Porfolio " + keyVal;
            span.classList.add('currentPortfolioHighlight');
            span.addEventListener("click", function(){
                localPortfolioDetails["currentPortfolioId"] = keyVal;
                localStorage.setItem("portfolioDetails", JSON.stringify(localPortfolioDetails));
                location.reload();
            })
            li.appendChild(span);


        }
        else{
            const span = document.createElement("span");
            span.innerText = "Porfolio " + keyVal;
            span.addEventListener("click", function(){
                localPortfolioDetails["currentPortfolioId"] = keyVal;
                localStorage.setItem("portfolioDetails", JSON.stringify(localPortfolioDetails));
                location.reload();
            })
            span.addEventListener("mouseover", () => {
                span.classList.add("portfolioHighlight");
            })
            span.addEventListener("mouseout", () => {
                span.classList.remove("portfolioHighlight");
            })
            const delBtn = document.createElement("button");
            delBtn.classList.add("btn");
            delBtn.classList.add("btn-danger");
            delBtn.innerText = "Del";
            li.appendChild(span);
            li.appendChild(delBtn);
            delBtn.addEventListener("click", function(){
                const delLiId = Number(this.parentElement.id.replace("portfolio", ""));
                delete localPortfolioDetails[delLiId];
                localStorage.setItem("portfolioDetails", JSON.stringify(localPortfolioDetails));
                
                portfolioLis.removeChild(this.parentElement);

            })

        }
        portfolioLis.appendChild(li);

    }
})
addPortfolio.addEventListener("click", () => {
    if(Object.keys(localPortfolioDetails).length < 5){
        localPortfolioDetails[localPortfolioDetails['portfolioId']] = new PortfolioClass().getDetails();
            const li = document.createElement("li");
    li.id = "portfolio" + localPortfolioDetails['portfolioId'];
    const span = document.createElement("span");
    const tempId = localPortfolioDetails['portfolioId'];
    span.innerText = "Porfolio " + tempId;
    span.addEventListener("click", function(){
        localPortfolioDetails["currentPortfolioId"] = tempId;
        localStorage.setItem("portfolioDetails", JSON.stringify(localPortfolioDetails));
        location.reload();
    })
    span.addEventListener("mouseover", () => {
        span.classList.add("portfolioHighlight");
    })
    span.addEventListener("mouseout", () => {
        span.classList.remove("portfolioHighlight");
    })
    const delBtn = document.createElement("button");
    delBtn.classList.add("btn");
    delBtn.classList.add("btn-danger");
    delBtn.innerText = "Del";
    li.appendChild(span);
    
    delBtn.addEventListener("click", function(){
        const delLiId = Number(this.parentElement.id.replace("portfolio", ""));
        delete localPortfolioDetails[delLiId];
        localStorage.setItem("portfolioDetails", JSON.stringify(localPortfolioDetails));
        portfolioLis.removeChild(this.parentElement);
        

    })
    li.appendChild(delBtn);
    portfolioLis.appendChild(li);
    localPortfolioDetails['portfolioId'] += 1;
    localStorage.setItem("portfolioDetails", JSON.stringify(localPortfolioDetails))

    }
    
    
    
    
    
})

let userStocks = localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'];
userAmount.innerText = "Amount Left: $" + localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userAmount'].toFixed(2);
portfolioValue.innerText = "Portfolio Value: $" + localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['portfolioValue'].toFixed(2);
let totalPortfolioVal = 0;

let chartDates = [];
let chartDataPromises = [];
let currentDate = new Date();
let dateIter = 1;
while(chartDates.length < 5){
    let tempDate = new Date(currentDate);
    tempDate.setDate(tempDate.getDate() - dateIter);
    if(tempDate.getDay() >= 1 && tempDate.getDay() <= 5){
    chartDates.push(formatDate(tempDate));
    }
    dateIter++;

}
chartDates.reverse();
let chartData = [{
    type:"scatter",
    mode:"lines",
    name:"",
    x:chartDates,
    y:[null,null,null,null,null]
}]
Plotly.newPlot('portfolioGraph', chartData);
if(Object.keys(userStocks).length > 0){
    Object.keys(userStocks).forEach(ticker => {
    if(userStocks[ticker] > 0){
        chartDataPromises.push(getStockPrices(ticker, chartDates, userStocks[ticker]));
    }
    
    
    })
    Promise.all(chartDataPromises)
    .then(chartData => {
    Plotly.newPlot('portfolioGraph', chartData);
    })          
}


})