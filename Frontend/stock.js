getGeneralNews();
//getPrediction();








function getPrediction(symbolName) {

    var stockName = document.getElementById("selectGrp").value;
    if(symbolName == undefined){
        symbolName = stockName;
    }
    var apigClient = apigClientFactory.newClient();
  //apiKey: "Sd26QCMkkUamVeRvRN9wV72SDrxOM9XPLvc0ntAa"
    
  
    var body = {
        "symbol": symbolName
      };
    var params = {
      "symbol": symbolName
    };
    var additionalParams = {
      headers: {
        'Content-Type': "application/json",
      }
    };
    
    var apigClient = apigClientFactory.newClient();
  //apiKey: "Sd26QCMkkUamVeRvRN9wV72SDrxOM9XPLvc0ntAa"
    




  
    apigClient.getPredictionGet(params, body, additionalParams)
      .then(function (result) {
          console.log(result);
         
        //This is where you would put a success callback
        response_data = result.data;
        data=[];
        timestamp=[];
        
        for (i = 0; i < result.data.length; i++) {
          
            timestamp.push(new Date(new Date().getTime()+(i*24*60*60*1000)));
            data.push(result.data[i]);
           
        }
        response_data["timestamp"]=timestamp;
        response_data["predictions"]=data;
        displayChartPrediction(symbolName,response_data);


        
       
      }).catch(function (result) {
        //This is where you would put an error callback
      });
  
  }

function searchSymbol(symbolName) {

    var stockName = document.getElementById("stockName").value;
    if(symbolName == undefined){
        symbolName = stockName;
    }
    var apigClient = apigClientFactory.newClient();
  //apiKey: "Sd26QCMkkUamVeRvRN9wV72SDrxOM9XPLvc0ntAa"
    
  
    var body = {
        "symbol": symbolName
      };
    var params = {
      "symbol": symbolName
    };
    var additionalParams = {
      headers: {
        'Content-Type': "application/json",
      }
    };
  
    apigClient.stockDataGet(params, body, additionalParams)
      .then(function (result) {
          console.log(result);
         
        //This is where you would put a success callback
        response_data = JSON.parse(result.data[0]).chart.result[0];

        
        
        displayChart(symbolName,response_data);

        companyNews= " ";
        //This is where you would put a success callback
     

        
        
        
        result.data[1].forEach(element => {
            companyNews += (element.summary + '<br/>');
        });

        document.getElementById("companyNews").innerHTML = companyNews;
        document.getElementById("sentiment").innerHTML = result.data[2].Sentiment
        
       
      }).catch(function (result) {
        //This is where you would put an error callback
      });
  
  }



  function getGeneralNews() {

   

    var apigClient = apigClientFactory.newClient();
  //apiKey: "Sd26QCMkkUamVeRvRN9wV72SDrxOM9XPLvc0ntAa"
    
  
    var body = {};
    var params = {};
    var additionalParams = {
      headers: {
        'Content-Type': "application/json",
      }
    };
  
    apigClient.getGeneralDataGet(params, body, additionalParams)
      .then(function (result) {
          console.log(result);
          marketNews= " ";
        //This is where you would put a success callback
     

        
        
        
        result.data[0].forEach(element => {
            marketNews += (element.headline +" ");
        });

        var activeStocks=JSON.parse(result.data[1]).finance.result[0].quotes

        var gainers=JSON.parse(result.data[1]).finance.result[1].quotes
        var losers=JSON.parse(result.data[1]).finance.result[2].quotes
        var table = document.getElementById("ActiveDiv");

for(var i =0;i<activeStocks.length ; i++){
  var row = table.insertRow(i+1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);

  cell1.innerHTML = '<a href="javascript:searchSymbol(`'+activeStocks[i].symbol+'`);">'+activeStocks[i].symbol+'</a>';
  cell2.innerHTML = activeStocks[i].exchange;
  cell3.innerHTML = activeStocks[i].fullExchangeName;
  cell4.innerHTML = activeStocks[i].quoteType;


 
}
        
 


var table = document.getElementById("GainerDiv");

for(var i =0;i<gainers.length ; i++){
  var row = table.insertRow(i+1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);

  cell1.innerHTML = '<a href="javascript:searchSymbol(`'+gainers[i].symbol+'`);">'+gainers[i].symbol+'</a>';
  cell2.innerHTML = gainers[i].exchange;
  cell3.innerHTML = gainers[i].fullExchangeName;
  cell4.innerHTML = gainers[i].quoteType;


 
}

var table = document.getElementById("LoserDiv");

for(var i =0;i<losers.length ; i++){
  var row = table.insertRow(i+1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);

  cell1.innerHTML = '<a href="javascript:searchSymbol(`'+losers[i].symbol+'`);">'+losers[i].symbol+'</a>';
  cell2.innerHTML = losers[i].exchange;
  cell3.innerHTML = losers[i].fullExchangeName;
  cell4.innerHTML = losers[i].quoteType;


 
}
        document.getElementById("marketNews").innerHTML = marketNews;
       
      
       
      }).catch(function (result) {
        //This is where you would put an error callback
      });
  
  }




  function displayChart(stockName,response)
{

  var arrayA = response['timestamp'];
  var xData = arrayA;
 
   
    const map1 =xData.map(x =>  new Date(x*1000));
    
 var arraydataA = response["indicators"].quote[0].open;
console.log(map1);
console.log(arraydataA);
 

 

  var yaxisData = arraydataA;

  
  



 map1.unshift('x');
 yaxisData.unshift(stockName);

var chart = c3.generate({
     bindto: '#chart',
     point: {
        r: 10
    },
     data: {
         x: 'x',
         xFormat: '%Y-%m-%d',
         columns: [
            map1,
             yaxisData
        ]
    },
    axis: {
        x: {
             type: 'timeseries',
             tick: {
                 format: '%Y-%m-%d',
                 rotate: -20,
                 multiline: false
             }
        }
    },tooltip: {
        show: true
    }


});
}




function displayChartPrediction(stockName,response)
{

  var arrayA = response['timestamp'];
  var xData = arrayA;
 
   
    
 var arraydataA = response["predictions"];


 

  var yaxisData = arraydataA;

  
  



  xData.unshift('x');
 yaxisData.unshift(stockName);

var chart = c3.generate({
      bindto: '#chart1',
      point: {
        r: 8
    },
     data: {
         x: 'x',
         xFormat: '%Y-%m-%d',
         columns: [
            arrayA,
             yaxisData
        ]
    },
    axis: {
        x: {
             type: 'timeseries',
             tick: {
                 format: '%Y-%m-%d',
                 rotate: -20,
                 multiline: false
             }
        }
    }


});
}


