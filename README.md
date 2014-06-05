Breeze:  Getting Started Guide
=======
## Overview
Breeze.js is a client library that enables developers to handle server data in a rich and clean way.  Breeze actually has great documentation on their [website](http://www.breezejs.com/documentation/introduction) and I will refer you there for almost everything.  I followed their introduction, then configured breeze for OData according to this [guide](http://www.breezejs.com/documentation/odata).

## Running This Demo
I used the Northwind sample [service](http://services.odata.org/V4/Northwind/Northwind.svc) for an example. To run the demo, open the `index.html` file in your favorite modern browser and look at the JavaScript console. It is expected to see a couple failed OPTIONS requests but the demo should continue with the GET requests. You should see results being returned after the failed OPTIONS requests.

## OData 4 Support
Breeze depends on datajs which Apache has taken and begun to extend for OData 4 ([official documentation](http://www.odata.org/documentation/odata-version-4-0/)).  I took a bleeding edge build for the new datajs ([GitHub](https://github.com/apache/olingo-odata4-js)) and told Breeze to use this new version.  This required some minor modifications to the code.

## CORS
The only non-trivial change was due to the Northwind service not supporting Cross Origin Resource Sharing (CORS, explained in detail [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)).  CORS adds some security to HTTP requests when the source is not on the same domain as the destination.  CORS works by *pre-flighting* non-trivial HTTP requests, that is, when your browser detects a request it first executes an HTTP OPTIONS request to see if the server will allow the original request.  If the OPTIONS request is successful then the original request is sent to the server and everything works great.

However, if the OPTIONS request fails, then the original request will not be sent at all.  A viable workaround supported by Breeze is to request data using JSONP (more details about JSONP [here](http://json-p.org/)).  However, Breeze requires the metadata before executing any queries and the metadata can only be provided in XML.  To get around this issue, I created a hack in datajs to recover from the failed OPTIONS request and immediately send a GET request for the metadata.  Note that this is hardcoded in to the demo and should be changed for your purposes.  

### After CORS
Once we get the metadata we just change our format to JSON, tell Breeze to enable JSONP, and continue making requests.  The code for this is below.

> odataNet.defaultHttpClient.enableJsonpCallback = true;
> odataNet.defaultHttpClient.formatQueryString = "$format=json";
