var request = require('request'),
    jar = request.jar(),
    request = request.defaults({ jar: jar }),
    cheerio = require('cheerio'),
    Urbania = {},
    LABELS = {
      Dormitorios: 'bedrooms',
      Baños: 'restrooms',
      'Área Total': 'area'
    };

Urbania.get = function(url) {
  var promise = new Promise(function(resolve, reject) {
    request.get(url, function(err, httpResponse, body) {
      var data = processRequest(body);

      resolve(data);
    });
  });

  return promise;
}

function processRequest(body) {
  var $ = cheerio.load(body),
      body = $('html'),
      propertyDetails = body.find('.property_detail').eq(0),
      data = {};

  data.description = body.find('title').eq(0).text().replace(' | Urbania.pe', '');
  data.pricePEN = body.find('.property_price p').eq(1).text().replace(/\(|\)/g, '');
  data.address = body.find('.address_ficha').eq(0).text().trim();

  propertyDetails.find('li').get().forEach(function(item) {
    var item = $(item),
        key = item.find('span').eq(0).text().trim(),
        value = item.find('p').eq(0).text().trim();

    if (LABELS[key]) {
      data[LABELS[key]] = value;
    }
  });

  return data;
}

module.exports = Urbania;