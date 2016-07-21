var AdondeVivir = require('./adondevivir'),
    Urbania = require('./urbania'),
    urls = [
      // put urls here
    ],
    request;

result = Promise.resolve();

urls.forEach(function(url) {
  result = result.then(function() {
    request = url.match('adondevivir') ? AdondeVivir.get(url) : Urbania.get(url);

    return request.then(function(data) {
      console.log(data.address);
    });
  });
});