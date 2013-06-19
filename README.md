#### What is this?
A Javascript library to access ArenaNet's Guild Wars 2 Events API.  This library supports both XmlHttpRequest and XDomainRequest for IE8, although I have not tested the latter.  Cross scheme access is not allowed in XDomainRequest so make sure that you are hosting this at a web site that is accessed through https.  Both synchronous and asynchronous calls are supported if using XmlHttpRequest.  Only asynchronous calls are supported for XDomainRequest.

The library also supports Windows Scripting Host Javascripts, which use XmlHttpRequest.

#### Installation
Just copy all the files into the same directory.

* events.wsf - a Windows Scripting Host Javascript that demos how to use the library from WSH.
* test.htm - a demo web page that uses the library
* events.js - a demo javascript that uses the library.  This is used in conjuction with test.htm above.
* gw2events.js - the javascript library itself.

* json2.js           - json file (not written by me)
* jquery-1.9.1.js    - jquery file (not written by me)

#### Calling the library from WSH
Look at events.wsf for an example.  **Remember to instantiate the GW2EVENTS library with a boolean value of true as the first parameter.**

#### Calling the library from a web page
Look at test.htm and events.js for an example.

If the browser allows the use of XmlHttpRequest, then you can choose to call the library synchronously by supplying a null to the callback parameter.
Otherwise, supply a function parameter for asynchronous callback.  If the browser only allows the use of XDomainRequest then you are stuck with only making 
asynchronous calls.

#### Licenses

Refer to the LICENSE.md file for license information

#### Author

David Teo
dspirit@gmail.com
