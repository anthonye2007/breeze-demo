/*
 * This is a sample client sdk that accesses the Northwind database. 
 *
 * Anthony Elliott: anthonye2007@gmail.com
 */

const protocol = "http://";
const serviceHost = 'services.odata.org';
const root = '/V4/Northwind/Northwind.svc';
const serviceRoot = protocol + serviceHost + root;
const extendedRoot = root + '/';

/*
 ***** Helpers *****
 */

configuration = function() {
  OData.defaultHttpClient.enableJsonpCallback = true;
  OData.defaultError = error;
  OData.defaultSuccess = success;
}

log = function(msg, numNewLines) {
  console.log(msg);

  for (var i = 0; i < numNewLines; i++) {
    newline();
  }
}

newline = function() {
	console.log('');
}

success = function(response) {
  log("success!");
  log(response);
}

error = function(error) {
  log("Error: " + error.message);
  log(error);
}

execute = function(query) {
  manager.executeQuery(query)
	  .then(function(results) {
	  	log('query was successful!');
	  	log(results);
	  })
	  .catch(function(error) {
	  	log('query error: ' + error.message);
	  	log(error);
	  });
}

enableJson = function() {
	odataNet.defaultHttpClient.enableJsonpCallback = true;
	odataNet.defaultHttpClient.formatQueryString = "$format=json";
}

disableJson = function() {
	odataNet.defaultHttpClient.enableJsonpCallback = false;
	odataNet.defaultHttpClient.formatQueryString = "$format=xml";
}

/*
 ***** Runner *****
 */
log("Starting", 1);

disableJson();

breeze.config.initializeAdapterInstance('dataService', 'odata', true);
//breeze.config.initializeAdapterInstance('dataService', 'webApiOData', true);

var ds = new breeze.DataService({
  //serviceName: "http://localhost:55802/odata",
  serviceName: serviceRoot, // the URL endpoint
  hasServerMetadata: true,
  useJsonp: true           // request data using the JSONP protocol
  //,jsonResultsAdapter: jsonResultsAdapter
});
 
var manager = new breeze.EntityManager({dataService: ds});
log("Service: " + manager.serviceName);

/*manager.fetchMetadata()
  .then(function() {
    var metadataStore = manager.metadataStore;
    log('metadata success!')
    log(metadataStore);
  })
  .fail(function(exception) {
    log('metadata error: ' + exception.message);
    log(exception);
  });*/

//enableJson();

var query = breeze.EntityQuery.from("Orders").take(5);
execute(query);
