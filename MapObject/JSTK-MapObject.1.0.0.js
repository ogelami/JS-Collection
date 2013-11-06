var mapObject;

$(function()
{
	mapObject = 
	{
		mapDiv : null,
		map : null,
		markers: [],
		isInitialized : false,
		initialize : function(mapDiv, lat, lon)
		{
			this.isInitialized = true;
			
			if(this.map != null)
			{
				this.clearMarkers();
				this.center(lat, lon);
				$(this.mapDiv).show();
				
				return false;
			}
				
			this.mapDiv = document.getElementById(mapDiv);
			$(this.mapDiv).html('').show();
		
			var myLatlng = new google.maps.LatLng(lat, lon);
		
			var options =
			{
   	   	  		mapTypeId         : google.maps.MapTypeId.ROADMAP,
   	   	  		zoom              : 11,
   	   	  		center            : myLatlng,
   		     	scrollwheel       : false,
	   	     	keyboardShortcuts : false,
			}
		
			this.map = new google.maps.Map(this.mapDiv, options);
		},
		placeMarker : function(imgSrc, lon, lat, onClick)
		{
			var myLatlng = new google.maps.LatLng(lon, lat);
			
			var normImgWidth = 25;
			var normImgHeight = 41;

			var image = new google.maps.MarkerImage(imgSrc,
				new google.maps.Size(normImgWidth, normImgHeight),
				new google.maps.Point(0,0),
				new google.maps.Point(normImgWidth/2, normImgHeight));
				
			var shadow = new google.maps.MarkerImage('/_images/pin_shadow.png',
				new google.maps.Size(35, 32),
				new google.maps.Point(0,0),
				new google.maps.Point(2, 30));

			var shape =
			{
				coord: [normImgWidth/2, normImgHeight/2, normImgWidth],
				type: 'circle'
			};
	
			marker = new google.maps.Marker(
			{
	    		position: myLatlng,
			    map: this.map,
			    icon: image,
			    shape: shape,
			    shadow: shadow,
			    optimized: false,
		  		animation: null
			});
			
			if(typeof onClick !== 'undefined')
				google.maps.event.addListener(marker, 'click', onClick);
			
			this.markers.push(marker);
			
			return marker;
		},
		clearMarkers : function()
		{
			for(var i = 0; i < this.markers.length; i++)
				this.markers[i].setMap(null);

			this.markers = [];
		},
		center : function(lat, lng)
		{
			var myLatlng = new google.maps.LatLng(lat, lng);
		
			this.map.panTo(myLatlng);
		},
		getMarker : function(id)
		{
			for(var i = 0; i < this.markers.length; i++)
				if(this.markers[i].id == id)
					return this.markers[i];
					
			return false;
		},
		setMarkerOnclick : function(marker, callback)
		{
			google.maps.event.addListener(marker, 'click', callback);
		},
		centerMarkers : function()
		{
			var bounds = new google.maps.LatLngBounds();
			
			for(var i = 0; i < this.markers.length; i++)
				bounds.extend(this.markers[i].getPosition());
				
			this.map.setCenter(bounds.getCenter());
			this.map.fitBounds(bounds);
		}
	}
});