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
  log("Error...")
  log(error);
}

printNames = function(response) {
  var entitySetCollection = response.value.results;

  for (var i = 0; i < entitySetCollection.length; i++) {
    var entitySet = entitySetCollection[i];
    log(entitySet.name);
  }

  newline();
}

printEachCategory = function(response) {
  var categories = response.value.results;

  for (var i = 0; i < categories.length; i++) {
    log(categories[i].CategoryName);
  }
}

handleCustomerSubset = function(response) {
  var customers = response.value.results;

  for (var i = 0; i < customers.length; i++) {
    log(customers[i].CustomerID);
  }

  var pathForNextCustomer = response.__next;
  if (pathForNextCustomer == null) {
    log('Got all customers');
  } else {
    printCustomers(pathForNextCustomer);
  }
}

/*
 ***** Low level API *****
 */

 read = function(path, callback) {
  if (path != null && path.charAt(0)) {
    path = '/' + path;
  }

  var completeUrl = serviceRoot + path;
  OData.read(completeUrl, callback);
}

readEntitySet = function(entitySetName, callback) {
  read(entitySetName, callback);
}

getEntitySets = function(callback) {
  read('', callback);
}

getCategories = function(callback) {
  readEntitySet('Categories', callback);
}

/*
 ***** High level API *****
 */

printAllEntitySetNames = function() {
  log("Entity sets:")
  getEntitySets(printNames);
}

printCategories = function() {
  log("Categories:");
  getCategories(printEachCategory);
}

printCustomers = function(path) {
  path = path || 'Customers';

  readEntitySet(path, handleCustomerSubset);
}

/*
 ***** Runner *****
 */
log("Starting", 1);

//configuration();

breeze.config.initializeAdapterInstance('dataService', 'odata', true);

var ajaxAdapter = breeze.config.getAdapterInstance('ajax');
 
ajaxAdapter.defaultSettings = {
   beforeSend: function(xhr, settings) {
      xhr.setRequestHeader("x-Test-Before-Send-Header", "foo");
      console.log('set headers');
   }
};

var ds = new breeze.DataService({
  serviceName: serviceRoot, // the URL endpoint
  hasServerMetadata: true,
  useJsonp: false           // request data using the JSONP protocol
  //,jsonResultsAdapter: jsonResultsAdapter
});
 
var manager = new breeze.EntityManager({dataService: ds});
//manager.fetchMetadata(ds, success, error);

manager.fetchMetadata()
  .then(function() {
    var metadataStore = em1.metadataStore;
    // do something with the metadata
    log('success!')
    log(metadataStore);
  })
  .fail(function(exception) {
    // handle exception here
    log('failed...');
    log(exception);
  });

var query = breeze.EntityQuery.from("Customers");
/*manager.executeQuery(query)
  .then(success)
  .fail(error);*/
