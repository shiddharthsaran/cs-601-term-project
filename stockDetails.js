import {getStockDetails} from './modules/functions.js'
import {getStockTimeSeries} from './modules/functions.js'
import {checkStartEndDate} from './modules/functions.js'

document.addEventListener("DOMContentLoaded", function(){
    const timeSeriesBtn = document.getElementById('timeSeriesBtn');
    const buyBtn = document.getElementById("buyBtn");
    const sellBtn = document.getElementById("sellBtn");
    const buySellBtns = document.getElementById("buySellBtns");
    const buyDiv = document.getElementById("buyDiv");
    const sellDiv = document.getElementById("sellDiv");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const homeBtn = document.getElementById("homeBtn");
    const buyBackBtn = document.getElementById("buyBackBtn");
    const sellBackBtn = document.getElementById("sellBackBtn");
    const stockSellQuantity = document.getElementById("stockSellQuantity");
    const sellConfirmBtn = document.getElementById("sellConfirmBtn");
    const stockSellMsg = document.getElementById("stockSellMsg");
    const stockLogo = document.getElementById("stockLogo");
    let localPortfolioDetails = JSON.parse(localStorage.getItem('portfolioDetails'));
    
    let params = new URLSearchParams(window.location.search);
    let ticker = params.get("ticker");
    getStockDetails(ticker);
    if(localPortfolioDetails == null){
        let portfolioDetails = {
            "currentPortfolioId":1,
            1:{

                "userAmount":1000,
                "userStocks":{},
                "userFriends":{}

            }
        };
        localStorage.setItem('portfolioDetails',JSON.stringify(portfolioDetails));
        localPortfolioDetails = JSON.parse(localStorage.getItem('portfolioDetails'));
    }

    timeSeriesBtn.addEventListener("click", function(){
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    if(checkStartEndDate(startDate, endDate)){
        const urlTimeSeries = "https://api.polygon.io/v2/aggs/ticker/"+ ticker +"/range/1/day/"+ startDate +"/" + endDate + "?adjusted=true&sort=desc&limit=30&apiKey=" + "UqR1AwHB4eIRO0pUzjG8IxuMlFHeJczI";
        getStockTimeSeries(urlTimeSeries, false);
    }

    })

    buyBtn.addEventListener("click",() => {
        buySellBtns.style.display = "none";
        buyDiv.style.display = "block";
    })
    homeBtn.addEventListener("click", () => {

    })
    if(localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'].hasOwnProperty(ticker)){
        if(localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'][ticker] <= 0){
            sellBtn.style.display = "none";
        }
    }
    else{
        sellBtn.style.display = "none";	
    }
    checkoutBtn.addEventListener("click", function(){
        const stockQuantityVal = Number(stockQuantity.value);
        const latestClosePrice = Number(document.getElementById("cp").innerText.replace("Close Price: ",""));
        if (stockQuantityVal <= 0){
            stockBuyMsg.innerText = "Enter a value greater than 0.";
        }
        else{
            if((localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'].hasOwnProperty(ticker)) || Object.keys(localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks']).length < 5){
                let totalBuyAmount = stockQuantityVal * latestClosePrice;
                if((totalBuyAmount) < Number(localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userAmount'])){
                    localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userAmount'] = localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userAmount'] - totalBuyAmount;
                    if(localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'].hasOwnProperty(ticker)){
                        localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'][ticker] += stockQuantityVal;
                        
                    }
                    else{
                        localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'][ticker] = stockQuantityVal;
                    }
                    localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['portfolioValue'] += totalBuyAmount;
                    localStorage.setItem('portfolioDetails',JSON.stringify(localPortfolioDetails));
                    stockBuyMsg.innerText = "Transaction Completed Successfully.";
                    
                }
                else{
                    stockBuyMsg.innerText = "Amount not enough to buy the number of stock units selected.";
                }

            }else{
                stockBuyMsg.innerText = "Max number of stocks added to portfolio."
            }
            
            
        }
    })

    buyBackBtn.addEventListener("click", function(){
        buySellBtns.style.display = "flex";
        buyDiv.style.display = "none";
        if(localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'].hasOwnProperty(ticker)){
            if(localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'][ticker] > 0){
                sellBtn.style.display = "inline";
            }
        }
        stockBuyMsg.innerText = "";
        
        stockQuantity.value = 0.1;

    })

    sellBackBtn.addEventListener("click", function(){
        buySellBtns.style.display = "flex";
        sellDiv.style.display = "none";
        if(localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'].hasOwnProperty(ticker)){
            if(localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'][ticker] <= 0){
                sellBtn.style.display = "none";
                stockSellQuantity.value = 0;
            }
            else{
                stockSellQuantity.value = localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'][ticker];
            }
        }
        else{
            sellBtn.style.display = "none";
        }
        stockSellMsg.innerText = "";
        
    })

    sellBtn.addEventListener("click", () => {
        buySellBtns.style.display = "none";
        sellDiv.style.display = "block";
        stockSellQuantity.value = localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'][ticker];

    })
    sellConfirmBtn.addEventListener("click", function(){
        const stockSellQuantityVal = Number(stockSellQuantity.value);
        const latestClosePrice = Number(document.getElementById("cp").innerText.replace("Close Price: ",""));
        
        if(stockSellQuantityVal <= localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'][ticker]){
            localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'][ticker] -= stockSellQuantityVal;
            localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userAmount'] += stockSellQuantityVal * latestClosePrice;
            if(localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'][ticker] == 0){
                delete localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['userStocks'][ticker];
            }
            localPortfolioDetails[localPortfolioDetails['currentPortfolioId']]['portfolioValue'] -= stockSellQuantityVal * latestClosePrice;
            localStorage.setItem('portfolioDetails',JSON.stringify(localPortfolioDetails));
            stockSellMsg.innerText = "Transaction Completed Successfully.";
        }
        else{
            stockSellMsg.innerText = "Selected number of stock units is greater than avaible stock units in user portfolio."
        }

    })




})