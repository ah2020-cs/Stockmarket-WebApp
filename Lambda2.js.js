const request = require('request');
var data =[];
var marketNews;
var movers;
exports.handler = async (event) => {
  
 
   marketNews = await getMarketNews();
   movers = await getMovers();
   data.push(marketNews);
   data.push(movers);


    // TODO implement
    const response = {
         headers: {
            'Access-Control-Allow-Headers' : 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
             },
        statusCode: 200,
        body: JSON.stringify(data)
    };
    console.log(response);
    return response;
};


  
  
  function getMarketNews() {
    //var self = this;
    return new Promise(function(resolve, reject) {
     
     request(' https://finnhub.io/api/v1/news?category=general&token=c215q1qad3i99lc0d710', { json: true }, (err, res, body) => {
  if (err) { reject(err); }
   resolve(body);
  
}); 
     
    });
  }

   
   function getMovers() {
    //var self = this;
    
  const options = {
  method: 'GET',
  url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-movers',
  qs: {region: 'US', lang: 'en-US', count: '6', start: '0'},
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
   
   
