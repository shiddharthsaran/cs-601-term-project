const API_KEY = "UqR1AwHB4eIRO0pUzjG8IxuMlFHeJczI"
const requestHeader = new Headers();
requestHeader.set("Content-Type", "application/json");
export function getStockSearch(userInput){
    if(userInput.length > 0){
        const url = "https://api.polygon.io/v3/reference/tickers?search="+ userInput +"&active=true&limit=5&apiKey="+API_KEY;
        fetch(url,{url:url, headers:requestHeader})
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json()

        })
        .then(data=>{
            const ul = document.getElementById("searchSuggestions");

            while (ul.firstChild) {
                ul.removeChild(ul.lastChild);
                }
            if(data.results.length > 0){
                document.getElementById("searchBtn").href = "stockDetails.html?ticker="+data.results[0].ticker;


            }

            data.results.forEach(element => {
                const li = document.createElement("li");
                
                li.innerText = element.ticker;
                li.addEventListener("click", function(){
                    document.getElementById("searchInput").value = li.innerText;
                    document.getElementById("searchBtn").href = "stockDetails.html?ticker="+li.innerText;
                    while (ul.firstChild) {
                        ul.removeChild(ul.lastChild);
                        }
                })
                li.addEventListener("mouseover", () => {
                    li.classList.add("searchHighlight");
                })
                li.addEventListener("mouseout", () => {
                    li.classList.remove("searchHighlight");
                })
                ul.appendChild(li);
            });

            return data;
        })

    }
    else{
        const ul = document.getElementById("searchSuggestions");

        while (ul.firstChild) {
            ul.removeChild(ul.lastChild);
            }

    }
    
}

class PortfolioClass {
    

    getDetails() {
        return {

            "userAmount":1000,
            "userStocks":{},
            "userFriends":{},
            "portfolioValue":0

            };
    }
}

export default PortfolioClass;


export const formatDate = function(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}

export const checkStartEndDate = (sDate, eDate) =>{
    if(sDate.length ==0 || eDate.length == 0){
        document.getElementById("timeSeriesError").innerText = "Enter Dates."
        return false;
    }
    const startDate = new Date(sDate);
    const endDate = new Date(eDate);
    const daysdiff = Math.round((endDate.getTime() - startDate.getTime())/ (1000 * 3600 * 24));
    if(daysdiff<0){
        document.getElementById("timeSeriesError").innerText = "It appears your dates are inverted. Please correct."
        return false;
    }
    else if(daysdiff == 0){
        document.getElementById("timeSeriesError").innerText = "Star and End Date are the same. Please make sure this is correct."
        return false;

    }
    else if(daysdiff > 365){
        document.getElementById("timeSeriesError").innerText = "The duration is greater then 1 year. Please make sure this is correct."
        return false;
    }
    else if(daysdiff > 30){
        document.getElementById("timeSeriesError").innerText = "You have a 30+ day duration. Please make sure your dates are correct."
        return true;
    }
    else{
        document.getElementById("timeSeriesError").innerText = "Your dates are correct"
        return true;
    }
}

export function getStockTimeSeries(url, flag) {

    
    fetch(url,{url:url, headers:requestHeader})
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json()

    })
    .then(data=>{

        const timeSeriesData = data.results;
        timeSeriesData.forEach(element => {
            element.t = new Date(element.t).toISOString().slice(0, 10);
        })
        timeSeriesData.reverse();
        if (flag){
            let latestStockPrice = timeSeriesData[0];
        
            document.getElementById('date').innerText = 'Date: ' + latestStockPrice.t;
            document.getElementById('hp').innerText = 'Highest Price: ' + latestStockPrice.h;
            document.getElementById('op').innerText = 'Open Price: ' + latestStockPrice.o;
            document.getElementById('lp').innerText = 'Lowest Price: ' + latestStockPrice.l;
            document.getElementById('cp').innerText = 'Close Price: ' + latestStockPrice.c;
            
        }
        const dates = timeSeriesData.map(data => data.t);
        const opens = timeSeriesData.map(data => data.o);
        const highs = timeSeriesData.map(data => data.h);
        const lows = timeSeriesData.map(data => data.l);
        const closes = timeSeriesData.map(data => data.c);

        const trace = {
            x: dates,
            close: closes,
            high: highs,
            low: lows,
            open: opens,
            type: 'candlestick',
            increasing: {line: {color: 'green'}},
            decreasing: {line: {color: 'red'}}
        };
        const chartData = [trace];
        Plotly.newPlot('candlestickChartContainer', chartData);

        return data;
    })

}

export function getLogoImage(ticker){
    const reqHeaders = new Headers();
    reqHeaders.set("Content-Type", "application/json");
    reqHeaders.set('X-Api-Key', 'G/2qY/PHtg4XnsqAAjYEaw==i6SuCgt2h6RWpmrw')
    const url = 'https://api.api-ninjas.com/v1/logo?ticker=' + ticker
    fetch(url,{url:url, headers:reqHeaders})
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(data.length >0){
            const imgSrc = data[0].image;
            const stockLogo = document.getElementById("stockLogo");
            stockLogo.src = imgSrc;

        }
        
    })
}

export function getStockDetails(userInput){
    if(userInput.length > 0){
        const url = "https://api.polygon.io/v3/reference/tickers/" + userInput + "?apiKey=" + API_KEY;
        fetch(url,{url:url, headers:requestHeader})
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json()

        })
        .then(data=>{
            const stockResults = data.results;
            const currDate = new Date();
            const thirtyDaysAgo = new Date(currDate.getTime() - (30 * 24 * 60 * 60 * 1000));
            const formattedCurrDate = formatDate(currDate);
            const formattedThirtyDaysAgo = formatDate(thirtyDaysAgo);
            const urlTimeSeries = "https://api.polygon.io/v2/aggs/ticker/"+ userInput +"/range/1/day/"+ formattedThirtyDaysAgo +"/" + formattedCurrDate + "?adjusted=true&sort=desc&limit=30&apiKey=" + API_KEY;
            getStockTimeSeries(urlTimeSeries, true);
            getLogoImage(userInput);
            document.getElementById('stockName').innerText = stockResults.name;
            document.getElementById('listDate').innerText = "List Date: " + stockResults.list_date;
            document.getElementById('tickerSymbol').innerText = "Ticker Symbol: " + stockResults.ticker;
            document.getElementById('marketCap').innerText = "Market Cap: " + stockResults.market_cap;
            document.getElementById('description').innerText = stockResults.description;
            
            return data;
        })
    }
}


export function getStockPrices(ticker, chartDates, tickerUnits){
    const url = "https://api.polygon.io/v2/aggs/ticker/"+ ticker +"/range/1/day/"+ chartDates[0] +"/"+ chartDates[chartDates.length - 1] +"?adjusted=true&sort=asc&apiKey="+API_KEY;
    // let chartData = [];
    return fetch(url, {url:url, headers:requestHeader})
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json()
    })
    .then(data => {
        let stockPrices = [];
        data.results.forEach(result => {
            stockPrices.push(result.c);
        })
    
        return {
            type:"scatter",
            mode:"lines",
            name:ticker,
            x:chartDates,
            y:stockPrices
        }
        
    })

    

}