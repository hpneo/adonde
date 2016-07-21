var request = require('request'),
    jar = request.jar(),
    request = request.defaults({ jar: jar }),
    cheerio = require('cheerio'),
    AdondeVivir = {},
    LABELS = {
      Dormitorio: 'bedrooms',
      Dormitorios: 'bedrooms',
      Baños: 'restrooms',
      Baño: 'restrooms',
      'Área total': 'area'
    };

AdondeVivir.get = function(url) {
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
      propertyDetails = body.find('.aviso-datos-principales').eq(0),
      data = {};

  data.description = body.find('title').eq(0).text().replace(' - AdondeVivir', '');
  data.pricePEN = body.find('.precios .venta').eq(0).text();
  data.address = body.find('.list-directions li').eq(0).text().trim();

  propertyDetails.find('li').get().forEach(function(item) {
    var item = $(item),
        key = item.find('.datos-nombre').eq(0).text().trim(),
        value = item.find('.datos-valor').eq(0).text().trim();

    if (LABELS[key]) {
      data[LABELS[key]] = value;
    }
  });

  return data;
}

module.exports = AdondeVivir;