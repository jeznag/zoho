var http  = require('http'),
    https = require('https');

// Invoice
var Invoice = function (options) {
  options = options || {};

  this.protocol = options.protocol || 'https';
  this.host = options.host || 'invoice.zoho.com';
  this.port = options.port || (this.protocol === 'https' ? 443 : 80);

  if (!options.authtoken) {
    return console.log('Error: Zoho Invoice instance requires the parameter `authtoken` to be initialized correctly');
  }

  this.authtoken = options.authtoken;
};

// Create
Invoice.prototype.createRecord = function (module, params, callback) {

};

// Get Records
Invoice.prototype.getRecords = function (module, params, callback) {
  params = params || {};

  if (typeof params === 'function') {
    params();
  } else {
    callback();
  }
};

// Get Record By Id
Invoice.prototype.getRecordById = function () {};

// Delete Record
Invoice.prototype.deleteRecord = function () {};


/* Private functions */

// Request
Invoice.prototype._request = function (method, endpoint, params, callback) {
  var options = {
    host: this.host,
    port: this.port,
    path: '/api/v3/' + endpoint,
    method: method,
    headers: {
      'Content-Length': JSON.stringify(params).length
    }
  };

  var protocol = this.protocol === 'https' ? https : http;

  var req = protocol.request(options, function (res) {
    var data = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) { data += chunk; });
    res.on('end', function () {
      if (data) {
        data = JSON.parse(data);
        return callback(null, data);
      }

      return callback({ error: 'No content data' }, null);
    });
  });

  req.on('error', function (e) {
    return callback(e, null);
  });

  req.write(JSON.stringify(params));
  req.end();
};


module.exports = Invoice;