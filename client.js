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

execute = function(query, successCallback, errorCallback) {
  manager.executeQuery(query)
		.then(successCallback)
		.catch(function(error) {
			log('query error: ' + error.message);
			errorCallback();
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

gotFirstFiveOrders = function(response) {
	log('\nFirst five Orders:');

	var results = response.results;
	for (var i = 0; i < results.length; i++) {
		log(results[i].CustomerID);
	}
}

getOrders = function() {
	enableJson();

	var query = breeze.EntityQuery.from("Orders").take(5);
	execute(query, gotFirstFiveOrders);
}

/*
 ***** Runner *****
 */
log("Starting", 1);

disableJson();
breeze.config.initializeAdapterInstance('dataService', 'odata', true);

var ds = new breeze.DataService({
  serviceName: serviceRoot, // the URL endpoint
  hasServerMetadata: true,
  useJsonp: true           
});
 
var manager = new breeze.EntityManager({dataService: ds});
log("Service: " + manager.serviceName);

var query = breeze.EntityQuery.from("Orders").take(5);
execute(query, gotFirstFiveOrders, getOrders);
