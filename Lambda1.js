var AWS = require('aws-sdk');
const request = require('request');
AWS.config.update({region: 'us-east-1'});
const fs = require('fs');

var marketNews;
var newsSentiment;
var stockSymbol;
var chart;
var movers;
var companyNews;
var s3 = new AWS.S3();
var comprehend = new AWS.Comprehend();
exports.handler = async (event) => {

    var symbol = event.queryStringParameters.symbol;
    
   //var symbol ="AAPL";
   //console.log(symbol)
const s3Bucket = 'nyu-project-stock-data'; // replace with your bucket name
  const objectName = 'chart.json'; // File name which you want to put in s3 bucket
  const objectType = 'application/json'; // type of file
  
   var dataOpen = await getData(symbol);
   var openData  = JSON.stringify(dataOpen);
    const paramsS3open = {
       Bucket: 'nyu-project-stock-data',
       Key: 'open.txt',
       Body: openData,
       ContentType:  objectType,
      
    };
    await s3.putObject(paramsS3open).promise();
   
    chart = await getChart(symbol); //--uncomment 
  // marketNews = await getMarketNews();
   //movers = await getMovers();
    //newsSentiment = await getNewsSentiment(symbol);
   // stockSymbol = await getStockSymbol();
   
    
   
  let dataChart = JSON.stringify(chart);
 
   
   
   
   
   
  

    // setup params for putObject
    const paramsS3 = {
       Bucket: s3Bucket,
       Key: objectName,
       Body: dataChart,
       ContentType: objectType,
    };
    await s3.putObject(paramsS3).promise();
    
   
    
 
   
   companyNews = await getCompanyNews(symbol); //uncomment
   
   let dataCompanyNews = JSON.stringify(companyNews);

  const objectName1 = 'companyNews.json'; // File name which you want to put in s3 bucket

    // setup params for putObject
    const paramsS31 = {
       Bucket: s3Bucket,
       Key: objectName1,
       Body: dataCompanyNews,
       ContentType: objectType,
    };
     await s3.putObject(paramsS31).promise();
   
   var data =[];
   data.push(chart);
   data.push(companyNews);

  
  var newstemp="";
  
companyNews = await getCompanyNewsMonth(symbol); //--uncomment
var dataSome =JSON.parse(companyNews);

dataSome.data.forEach(element => {
  newstemp =newstemp + element.attributes.title;
        });

var params = {
  LanguageCode: 'en',
  Text: newstemp
};

  var sentiment =await getSentiment(params);

  
  data.push(sentiment);
  let dataSentiment = JSON.stringify(sentiment);
  const objectName2 = 'sentiment.json'; // File name which you want to put in s3 bucket

    // setup params for putObject
    const paramsS32 = {
       Bucket: s3Bucket,
       Key: objectName2,
       Body: dataSentiment,
       ContentType: objectType,
    };
    await s3.putObject(paramsS32).promise();
  
  
    // TODO implement
    const response = {
         headers: {
            'Access-Control-Allow-Headers' : 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
             },
        statusCode: 200,
        body:  JSON.stringify(data)
    };
  
    return response;
};



function getSentiment(params){
try{ 

return comprehend.detectSentiment(params).promise().then(function(data) {


    
 return data;

});
}
catch (error){
       console.log(error);
   }
}


function getData(symbol) {
    //var self = this;
    return new Promise(function(resolve, reject) {
     
     request('https://finnhub.io/api/v1/stock/candle?symbol='+symbol+'&resolution=D&from=1614573637&to=1621572037&token=c215q1qad3i99lc0d710', { json: true }, (err, res, body) => {

  if (err) { reject(err); }
   resolve(body);
}); 
     
    });
  }
  
  
  function getMarketNews() {
    //var self = this;
    return new Promise(function(resolve, reject) {
     
     request(' https://finnhub.io/api/v1/news?category=general&token=c215q1qad3i99lc0d710', { json: true }, (err, res, body) => {
  if (err) { reject(err); }
   resolve(body);
  
}); 
     
    });
  }
  
  
  
    
  function getNewsSentiment(symbol) {
    //var self = this;
    return new Promise(function(resolve, reject) {
     
     request(' https://finnhub.io/api/v1/news-sentiment?symbol='+symbol+'&token=c215q1qad3i99lc0d710', { json: true }, (err, res, body) => {
  if (err) { reject(err); }
   resolve(body);

}); 
     
    });
  }
  
  
  
  
 
  function getStockSymbol() {
    //var self = this;
    return new Promise(function(resolve, reject) {
     
     request('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=c215q1qad3i99lc0d710', { json: true }, (err, res, body) => {
  if (err) { reject(err); }
   resolve(body.url);

}); 
     
    });
  }
  
   function getChart(symbol) {
    //var self = this;
    
    const options = {
  method: 'GET',
  url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-chart',
   qs: {interval: '1d', symbol: symbol, range: '3mo', region: 'US'},
  headers: {
    'x-rapidapi-key': 'c78177059amsh377bc060e37a852p11f842jsn6c39a38fc19b',
    'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
    useQueryString: true
  }
};
    return new Promise(function(resolve, reject) {
     
    request(options, function (err, response, body) {
  if (err) { reject(err); }
   resolve(body);

}); 
     
    });
   }
   
  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
} 
    function getCompanyNewsMonth(symbol) {
        
        
        
        const options = {
  method: 'GET',
  url: 'https://seeking-alpha.p.rapidapi.com/news/list',
  qs: {id: symbol, until: '0', size: '20'},
  headers: {
    'x-rapidapi-key': '857375c8dbmsh504bfe407ef3abep15788bjsn2b913429e2ed',
    'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com',
    useQueryString: true
  }
};
    //var self = this;
    return new Promise(function(resolve, reject) {
     
    // request('https://finnhub.io/api/v1/company-news?symbol='+symbol+'&from='+formatDate( new Date()- 10*24*60*60*1000)+'&to='+formatDate(new Date())+'&token=c215q1qad3i99lc0d710', { json: true }, (err, res, body) => {
    
     request(options, function (err, response, body) {
  if (err) { reject(err); }
   resolve(body);
  if (err) { reject(err); }
   resolve(body);

}); 
     
    });
  }
  
  
  function getCompanyNews(symbol) {
    //var self = this;
    return new Promise(function(resolve, reject) {
     
     request('https://finnhub.io/api/v1/company-news?symbol='+symbol+'&from='+formatDate( new Date() - 3*24*60*60*1000)+'&to='+formatDate(new Date())+'&token=c215q1qad3i99lc0d710', { json: true }, (err, res, body) => {
  if (err) { reject(err); }
   resolve(body);



}); 
     
    });
  }
  