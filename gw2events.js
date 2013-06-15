// WSH scripts must instantiate this with local = true
function GW2EVENTS(local,lang)
{
	// Constants
	var _TIMEOUT = 4000; // set timeout to 4s
	var _SUPPORTED_LANGUAGES = ["en", "fr", "de", "es"];
	var _USE_JQUERY = false;   // use $.ajax or XHR/XDR directly
	var DEFAULT_LANGUAGE = 'en'; // default language is 'en'
	var DEFAULT_WORLD = 1009; // Fort Aspenwood as my default world
	var UNKNOWN_NAME = "Unknown";  // should probably localize this but...

	// ArenaNet Guild Wars 2 API Constants
	var URL = "https://api.guildwars2.com/v1/";
	var EVENT_API = 'events.json?';
	var WORLD_NAMES_API = 'world_names.json?';
	var MAP_NAMES_API = 'map_names.json?';
	var EVENT_NAMES_API = 'event_names.json?';
	var LANG_PARA = 'lang=';
	var WORLD_ID_PARA = 'world_id=';
	var MAP_ID_PARA = 'map_id=';
	var EVENT_ID_PARA = 'event_id=';

	// member variables
	var _xxr;
	var _worldNames = _mapNames = _eventNames = null;
	var _data = {};
	var _callback, _callback_obj;
	var _blocked = false;   // if true, it means we have a pending web call
	var _isLocal = false;   // if true, means we are executing locally in WSH rather than the browser

    // Expose as Public Methods
    this.EventNames = getEventNames;
	this.MapNames = getMapNames;
	this.WorldNames = getWorldNames;
	this.Events = getEvents;
	this.IsUSWorld = IsUSWorld;
	this.IsEuropeWorld = IsEuropeWorld;
	this.WorldName = getWorldName;
	this.MapName = getMapName;
	this.EventName = getEventName;
	this.IsLocal = IsLocal;

	// set the language and _isLocal settings
	_lang = (typeof lang !== 'undefined' && IsSupportedLanguage(lang)) ? lang : DEFAULT_LANGUAGE;
	IsLocal(local);

	// Public Methods

	function IsLocal(local)
	{
		if (typeof local != 'undefined') 
		{
			_isLocal = local;
		}
		_xxr = createCrossDomainRequest();  // we instantiate the XHR/XDR component here!
		return _isLocal;
	}

	function IsUSWorld(worldId)
	{
		worldId = typeof worldId == "object" ? worldId.id : worldId;
		return (worldId.charAt(0) == '1');
	}

	function IsEuropeWorld(worldId)
	{
		worldId = typeof worldId == "object" ? worldId.id : worldId;
		return (worldId.charAt(0) == '2');
	}

	// This function will not work in XDR because it uses synchronous access to its NAMES function counterpart.
	// Workaround: Make sure to call its Names function counterpart first before calling this function, in XDR, so that 
	// NAMES would be cached and this function would not need to fetch NAMES from the web.
	function getEventName (eventId)
	{
		eventId = typeof eventId == "object" ? eventId.id : eventId;
		var eventNames = getEventNames(null);
		if (eventNames)
		{
			return getName(eventNames, eventId);
		}
		return false;
	}
	
	// if callback is null, it will attempt to perform a synchronous call unless we are using XDR where only async calls are supported
	// if callback is not null, it will attempt to perform an async call and after the call completes, performs a callback 
	// on the function parameter with the JSON data as its parameter.
    function getEventNames(callback)
	{
		if (!_eventNames)
		{
			_eventNames = new Object();
			_callback_obj = _eventNames;
			_request(callback, EVENT_NAMES_API, LANG_PARA + _lang);
		}
		else
		{
			if (callback != null) callback(_eventNames.data);	
		} 
		return _eventNames.data;
	}

	// This function will not work in XDR because it uses synchronous access to its NAMES function counterpart.
	// Workaround: Make sure to call its Names function counterpart first before calling this function, in XDR, so that 
	// NAMES would be cached and this function would not need to fetch NAMES from the web.
	function getMapName (mapId)
	{
		mapId = typeof mapId == "object" ? mapId.id : mapId;
		var mapNames = getMapNames(null);
		if (mapNames)
		{
			return getName(mapNames, mapId);
		}
		return false;
	}
	
	// if callback is null, it will attempt to perform a synchronous call unless we are using XDR where only async calls are supported
	// if callback is not null, it will attempt to perform an async call and after the call completes, performs a callback 
	// on the function parameter with the JSON data as its parameter.
	function getMapNames(callback)
	{
		if (!_mapNames)
		{
			_mapNames = new Object();
			_callback_obj = _mapNames;
			_request(callback, MAP_NAMES_API, LANG_PARA + _lang);
		}
		else
		{
			if (callback != null) callback(_mapNames.data);	
		} 
		return _mapNames.data;
	}
	
	// This function will not work in XDR because it uses synchronous access to its NAMES function counterpart.
	// Workaround: Make sure to call its Names function counterpart first before calling this function, in XDR, so that 
	// NAMES would be cached and this function would not need to fetch NAMES from the web.
	function getWorldName (worldId)
	{
		worldId = typeof worldId == "object" ? worldId.id : worldId;
		var worldNames = getWorldNames(null);
		if (worldNames)
		{
			return getName(worldNames, worldId);
		}
		return false;
	}

	// if callback is null, it will attempt to perform a synchronous call unless we are using XDR where only async calls are supported
	// if callback is not null, it will attempt to perform an async call and after the call completes, performs a callback 
	// on the function parameter with the JSON data as its parameter.
    function getWorldNames(callback)
    {
		if (!_worldNames)
		{
			_worldNames = new Object();
			_callback_obj = _worldNames;
			_request(callback, WORLD_NAMES_API, LANG_PARA + _lang);
		}
		else
		{
			if (callback != null) callback(_worldNames.data);	
		}    		
		return _worldNames.data;
    }

	// if callback is null, it will attempt to perform a synchronous call unless we are using XDR where only async calls are supported
	// if callback is not null, it will attempt to perform an async call and after the call completes, performs a callback 
	// on the function parameter with the JSON data as its parameter.
	function getEvents(callback, worldId, eventId, mapId)
	{
		var param = "", param1 = "", param2 = "";

		if (typeof worldId == "undefined") {
			worldId = DEFAULT_WORLD;
		}
		param = WORLD_ID_PARA + worldId; // we will always supply a world id
		
		switch (arguments.length)
		{
			case 0:
			case 1:
				// Fall through
			case 2:
				return _request(callback, EVENT_API, param);
				break;
				
			case 3:
				return _request(callback, EVENT_API, param, EVENT_ID_PARA + eventId);
				break;
				
			default:
				return _request(callback, EVENT_API, param, EVENT_ID_PARA + eventId, MAP_ID_PARA + mapId);
				break;
		}
	}
	
	// Private Methods

	function PrivateCallback(data)
	{
		if (_callback_obj != null) _callback_obj.data = data;
		_callback_obj = null; // remember to reset this

		_blocked = false; // remember to turn off blocking BEFORE calling back to the client
		if (_callback != null) _callback(_data);
	}

	function IsSupportedLanguage(lang)
	{		
		for(var i = 0; i < _SUPPORTED_LANGUAGES.length; i++) {
			if(_SUPPORTED_LANGUAGES[i] === lang) {
				return true;
			}
		}
		return false;
	}
	
	function getName(list, id)
	{
		for (var i in list) {
			if (list[i].id == id) return list[i].name;
		}
		return UNKNOWN_NAME;
	}

	// Functions to create xhrs
	function createStandardXHR() {
		try {
			return new window.XMLHttpRequest();
		} catch( e ) {}
	}

	function createActiveXHR() {
		try {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} catch( e ) {}
	}

	function createCrossDomainRequest()
    {
        var request;

        if (_isLocal)
        {
        	request = new ActiveXObject("Msxml2.XMLHTTP");
        }
        else if ('withCredentials' in new XMLHttpRequest()) 
        {
        	/* supports cross-domain requests */
        	request = window.ActiveXObject ?
	        	/* Microsoft failed to properly
				 * implement the XMLHttpRequest in IE7 (can't request local files),
				 * so we use the ActiveXObject when it is available
				 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
				 * we need a fallback.
				 */
				function() {
					return createStandardXHR() || createActiveXHR();
				} :
				// For all other browsers, use the standard XMLHttpRequest object
				createStandardXHR();
        }
        else
        {
        	if (window.XDomainRequest)
        	{
        		//Use IE-specific "CORS" code with XDR
            	request = new window.XDomainRequest();
        	}
        	else
        	{
        		//Time to retreat with a fallback or polyfill
        		alert ("Your browser is not supported!");
        		request = false;
        	}
        }
        return request;
    }
	
	function _request(callback, arg2)
	{
		var args;
		if (arguments.length > 2)
			args = Array.prototype.slice.call(arguments, 2);

		_HttpGet(callback, arg2, args);			

         return(_data);
	}

	function _HttpGet(callback, arg2, args)
	{
		_callback = callback;
		if (_USE_JQUERY)
		{
			_blocked = true;	
			$.ajax({url: URL + arg2 + args.join("&"), 
				async: callback != null && !_isLocal,
				dataType: "json"
			}).done(function(d) {
				_data = d;
				PrivateCallback(_data);
			});
		}
		else
		{
			// Because the Desktop Window Manager detects a hang after 5 seconds of unresponsiveness, and IE9 Hang Resistance after 8, 
			// I would set the timeout property to something under 5 seconds. 
			if (!_isLocal) _xxr.timeout = _TIMEOUT;
			if (window.XDomainRequest && !_isLocal)
			{
				// IMPORTANT!: XDR does NOT support synchronous web access!
				_xxr.onload = _JSONParse;
				_xxr.open("GET", URL + arg2 + args.join("&"));	
			}
			else
			{
				// Use synchronous call if (we are _blocked, or no callback is specified) or we are local
				_xxr.open("GET", URL + arg2 + args.join("&"), (!_blocked && callback != null) && !_isLocal);	
				_xxr.onreadystatechange = handler;
			}

			_blocked = true;			
			_xxr.send();	
		}
	}

	function handler()
	{
		if (_xxr.readyState == 4)
		{
			if (_xxr.status == 200)
			{
				_JSONParse();
			}
			else
			{
				alert("Invocation Errors Occured: " + _xxr.statusText);
			}
		}
	}

	function _JSONParse()
	{
		var parseString = _xxr.responseText;
		_data = JSON.parse(parseString);
		PrivateCallback(_data);		
	}
}
