var geoFinder =
{
	geoLocationTimeout : 15000,
	onSuccess    : false,
	onFailure    : function(){ alert('Tyvärr gick det inte att hämta din nuvarande position, är du säker att du har platstjänster aktiverat på din enhet?'); },
	completed    : false,
	hasFailed    : false,
	timeout      : false,
	watchHandler : false,
	data :
	{
		longitude : false,
		latitude  : false,
		accuracy  : false
	},
	_onSuccess : function(results)
	{
		if(!geoFinder.hasFailed)
		{
			geoFinder.completed = true;
		
			navigator.geolocation.clearWatch(geoFinder.watchHandler);
			clearTimeout(geoFinder.timeout);
			geoFinder.timeout = false;
	
			geoFinder.data.longitude = results.coords.longitude;
			geoFinder.data.latitude  = results.coords.latitude;
			geoFinder.data.accuracy  = results.coords.accuracy;
		
			geoFinder.onSuccess(geoFinder.data);
		}
	},
	_onFailure : function()
	{
		navigator.geolocation.clearWatch(geoFinder.watchHandler);
		clearTimeout(geoFinder.timeout);
	
		geoFinder.hasFailed = true;
		geoFinder.onFailure();
	},
	getLocation : function(onSuccess, onFailure)
	{
		if(typeof onFailure !== 'undefined')
			geoFinder.onFailure = onFailure;
		
		if(!navigator.geolocation || geoFinder.hasFailed || geoFinder.timeout)
		{
			geoFinder._onFailure();
			return false;
		}
		
		geoFinder.onSuccess = onSuccess;
		
		if(geoFinder.completed)
		{
			geoFinder.onSuccess(geoFinder.data);
			return true;
		}
		
		geoFinder.timeout = setTimeout(function()
		{
			if(!geoFinder.completed)
			{
				geoFinder._onFailure();
			}
		}, geoFinder.geoLocationTimeout);
		
		geoFinder.watchHandler = navigator.geolocation.watchPosition(geoFinder._onSuccess, geoFinder._onFailure, { timeout : geoFinder.geoLocationTimeout });
		
		return true;
	}
}