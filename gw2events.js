function GW2EVENTS(local,lang)
{
	//var _xxr = (window._xxrRequest) ? new window._xxrRequest() : new window.ActiveXObject("Microsoft._xxr");
	var _xxr;
	var _supportedLanguages = ["en", "fr", "de", "es"];
	var _worldNames = _mapNames = _eventNames = null;
	var _data = {};
	var _callback, _callback_obj;
	var _blocked = false;
	var _UseJQuery = true;
	var _isLocal = false;

	//_xxr = createCrossDomainRequest();

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

	_lang = (typeof lang !== 'undefined' && IsSupportedLanguage(lang)) ? lang : 'en';
	IsLocal(local);

	function IsLocal(local)
	{
		if (typeof local != 'undefined') 
		{
			//var temp = _isLocal;
			_isLocal = local;
		}
		_xxr = createCrossDomainRequest();
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

	function getEventName (eventId)
	{
		eventId = typeof eventId == "object" ? eventId.id : eventId;
		var eventNames = getEventNames(null);
		if (eventNames)
		{
			return getName(eventNames, eventId);
		}
		return false;
		//return getName(_eventNames.data, eventId);
	}
	
    function getEventNames(callback)
	{
		if (!_eventNames)
		{
			_eventNames = new Object();
			_callback_obj = _eventNames;
			_request(callback, 'event_names.json?', "lang=" + _lang);
		}
		else
		{
			if (callback != null) callback(_eventNames.data);	
		} 
		return _eventNames.data;
	}

	function getMapName (mapId)
	{
		mapId = typeof mapId == "object" ? mapId.id : mapId;
		var mapNames = getMapNames(null);
		if (mapNames)
		{
			return getName(mapNames, mapId);
		}
		return false;
		//return getName(_mapNames.data, mapId);
	}
	
	function getMapNames(callback)
	{
		if (!_mapNames)
		{
			_mapNames = new Object();
			_callback_obj = _mapNames;
			_request(callback, 'map_names.json?', "lang=" + _lang);
		}
		else
		{
			if (callback != null) callback(_mapNames.data);	
		} 
		return _mapNames.data;
	}
	
	function getWorldName (worldId)
	{
		worldId = typeof worldId == "object" ? worldId.id : worldId;
		var worldNames = getWorldNames(null);
		if (worldNames)
		{
			return getName(worldNames, worldId);
		}
		return false;
		//return getName(_worldNames.data, worldId);
	}

    function getWorldNames(callback)
    {
		if (!_worldNames)
		{
			_worldNames = new Object();
			_callback_obj = _worldNames;
			_request(callback, 'world_names.json?', "lang=" + _lang);
		}
		else
		{
			if (callback != null) callback(_worldNames.data);	
		}    		
		return _worldNames.data;
    }

	function getEvents(callback, worldId, eventId, mapId)
	{
		var param = "", param1 = "", param2 = "";

		if (typeof worldId == "undefined") {
			worldId = 1009;
		}
		param = "world_id=" + worldId;
		
		switch (arguments.length)
		{
			case 0:
			case 1:
				// Fall through
			case 2:
				return _request(callback, 'events.json?', param);
				break;
				
			case 3:
				return _request(callback, 'events.json?', param, "event_id=" + eventId);
				break;
				
			default:
				return _request(callback, 'events.json?', param, "event_id=" + eventId, "map_id=" + mapId);
				break;
		}
	}
	
	function PrivateCallback(data)
	{
		if (_callback_obj != null) _callback_obj.data = data;
		_callback_obj = null;
	}

	function IsSupportedLanguage(lang)
	{		
		for(var i = 0; i < _supportedLanguages.length; i++) {
			if(_supportedLanguages[i] === lang) {
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
		return "Unknown";
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
        else if ('withCredentials' in new window.XMLHttpRequest()) 
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
		if (_UseJQuery)
		{
			_blocked = true;	
			$.ajax({url: "https://api.guildwars2.com/v1/" + arg2 + args.join("&"), 
				async: callback != null,
				dataType: "json"
			}).done(function(d) {
				_data = d;
				PrivateCallback(_data);
				_blocked = false;
				if (_callback != null) _callback(_data);
			});
		}
		else
		{
			if (!_isLocal) _xxr.timeout = 4000; // set timeout to 4s
			if (window.XDomainRequest && !_isLocal)
			{
				_xxr.onload = _JSONParse;
				_xxr.open("GET", "https://api.guildwars2.com/v1/" + arg2 + args.join("&"));	
			}
			else
			{
				_xxr.open("GET", "https://api.guildwars2.com/v1/" + arg2 + args.join("&"), (!_blocked && callback != null) || (window.XDomainRequest && !_isLocal));	
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
		_blocked = false;
		if (_callback != null) _callback(_data);		
	}
}
