var ticker = 'aapy'

const requestHeader = new Headers();
requestHeader.set("Content-Type", "application/json");
requestHeader.set('X-Api-Key', 'G/2qY/PHtg4XnsqAAjYEaw==i6SuCgt2h6RWpmrw')
const url = 'https://api.api-ninjas.com/v1/logo?ticker=' + ticker
fetch(url,{url:url, headers:requestHeader})
.then(response => {
    return response.json();
})
.then(data => {
    console.log(data);
})

document.addEventListener("DOMContentLoaded", function (){
    const stockSearch = document.getElementById("stockSearch");
    const userSearch = document.getElementById("userSearch");
    const stockDetails = document.getElementById('stockDetails');
    const timeSeriesBtn = document.getElementById('timeSeriesBtn');
    stockSearch.addEventListener("keyup",  ()=>{
      const userInput = stockSearch.value;
      getStockSearch(userInput);
      
    })
    userSearch.addEventListener("keyup",  ()=>{
      const userInput = userSearch.value;
      getUserSearch(userInput);
      
      
      
    })
    const stockSearchBtn = document.getElementById("stockSearchBtn");
    stockSearchBtn.addEventListener("click", function(){
      const firstSuggestion = document.getElementById("stockSuggestions").firstChild;
      let userInput;
      if(firstSuggestion == null){
        userInput = stockSearch.value;
      }
      else{
        userInput = firstSuggestion.innerText;
      }
      if (userInput.length > 0){
        getStockDetails(userInput);
        stockDetails.style.display = "block";
        const ul = document.getElementById("stockSuggestions");
        while (ul.firstChild) {
            ul.removeChild(ul.lastChild);
            }
        stockSearch.value = "";

      }
      else{
        stockDetails.style.display = "none";
      }
      
      

    })

    timeSeriesBtn.addEventListener("click", function(){
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;
      if(checkStartEndDate(startDate, endDate)){
        const ticker = document.getElementById("tickerSymbol").innerText.replace("Ticker Symbol: ","");
        const urlTimeSeries = "https://api.polygon.io/v2/aggs/ticker/"+ ticker +"/range/1/day/"+ startDate +"/" + endDate + "?adjusted=true&sort=desc&limit=30&apiKey=" + "UqR1AwHB4eIRO0pUzjG8IxuMlFHeJczI";
        getStockTimeSeries(urlTimeSeries, false);

      }
    })

    
  })