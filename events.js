
var worldNames, eventNames;
var api = new GW2EVENTS();
var eventIdToCheck = "DFBFF5FE-5AF0-4B65-9199-B7CACC945ABD"; // "Ensure that the Pact holds the Gates of Arah." - Arah
var worldIndex = 0;

function processWorld(events)
{
	var vText = document.getElementById("msg");
	events = events.events;
	for (var j in events) {
		if (events[j].state != "Fail" && events[j].state != "Inactive") {
			vText.innerHTML += api.WorldName(events[j].world_id) + " " + events[j].state + " \"" + api.EventName(eventIdToCheck) + "\"<br>";
		}
	}
	fetchNextWorld();
}

function fetchNextWorld()
{
	if (worldIndex < worldNames.length)
	{		
		if (api.IsUSWorld(worldNames[worldIndex])) {
			api.Events(processWorld, worldNames[worldIndex].id, eventIdToCheck)
			worldIndex++;
		}
		else
		{
			worldIndex++;
			fetchNextWorld();
		}
	}
}

function start(data)
{
	worldNames = data;
	fetchNextWorld();
}

$(document).ready(function() {
	api.WorldNames(start);
})
	