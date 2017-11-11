var map;
var infoWindow;
var bounds;
var markers = [];

var locations = [
	{
		title: 'Empire State Building',
		location: {
			lat: 40.748541,
			lng: -73.985758 
		}	
	},
	{
		title: 'Chrysler Building',
		location: {
			lat: 40.751758,
			lng: -73.975519
		}
	},
	{
		title: 'New York University',
		location: {
			lat: 40.729513,
			lng: -73.996461 
		}
	},
	{
		title: 'The Museum of Modern Art',
		location: {
			lat: 40.761417,
			lng: -73.97712
		}
	},
	{
		title: 'United Nations Headquarters',
		location: {
			lat: 40.749161,
			lng: -73.967477
		}
	},
	{
		title: 'Central Park Zoo',
		location: {
			lat: 40.767017,
			lng: -73.971966
		}
	},
	{
		title: 'Times Square',
		location: {
			lat: 40.758895,
			lng: -73.985131
		}
	}
];

// Google Maps
function initMap() {
	// Styles variable to style the map 
	var styles = [
		{
			"stylers": [{
				"saturation": -100
			}, {
				"gamma": 1
			}]
		}, {
			"elementType": "labels.text.stroke",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.business",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.business",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.place_of_worship",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.place_of_worship",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "road",
			"elementType": "geometry",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "water",
			"stylers": [{
				"visibility": "on"
			}, {
				"saturation": 50
			}, {
				"gamma": 0
			}, {
				"hue": "#50a5d1"
			}]
		}, {
			"featureType": "administrative.neighborhood",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#333333"
			}]
		}, {
			"featureType": "road.local",
			"elementType": "labels.text",
			"stylers": [{
				"weight": 0.5
			}, {
				"color": "#333333"
			}]
		}, {
			"featureType": "transit.station",
			"elementType": "labels.icon",
			"stylers": [{
				"gamma": 1
			}, {
				"saturation": 50
			}]
		}
	];

    // initialize map
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		// styles: styles,
		center: { lat: 40.7713024, lng: -73.9632393 }
	});

    // initialize bounds variable
    bounds = new google.maps.LatLngBounds();

    // initialize infoWindow
    infoWindow = new google.maps.InfoWindow();

 // 	document.getElementById('recenter-button').addEventListener('click', function() {
	// 	map.fitBounds(bounds);
	// });
	  
	ko.applyBindings(new ViewModel());
}

function googleMapsError() {
    alert('An error occurred with Google Maps!');
}

function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

var Location = function(data) {
	var self = this;
	this.title = data.title;
	this.position = data.location;
	this.wikiLink = '';
	this.wikiStr = '';
	this.visible = ko.observable(true);
	// this.fail = false;
	// Create different icons for normal view and mouse hover.
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + this.title + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
    	self.fail = true;
    }, 4000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function(response) {
            var articleList = response[1];
            articleStr = articleList[0];
            self.wikiLink = 'http://en.wikipedia.org/wiki/' + articleStr;
            self.wikiStr = articleStr;
            clearTimeout(wikiRequestTimeout);
        }
    });

	this.marker = new google.maps.Marker({
		position: this.position,
		title: this.title,
		icon: defaultIcon,
		animation: google.maps.Animation.DROP,
		map: map
	});

	self.filterMarkers = ko.computed(function() {
		if(self.visible() === true) {
			self.marker.setMap(map);
			bounds.extend(self.marker.position);
			map.fitBounds(bounds);
				

		} else {
			self.marker.setMap(null);
							

		}
	});

	this.marker.addListener('click', function() {
		populateInfoWindow(this, self.wikiLink, self.wikiStr, infoWindow);
		toggleBounce(this);
		map.panTo(this.getPosition());
	});

	this.marker.addListener('mouseover', function() {
		this.setIcon(highlightedIcon);
	});

	this.marker.addListener('mouseout', function() {
		this.setIcon(defaultIcon);
	});

	this.show = function(location) {
		google.maps.event.trigger(self.marker, 'click');
	};

	this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};
};

var ViewModel = function() {
    var self = this;

    this.searchTerm = ko.observable('');

    this.places = ko.observableArray([]);

    this.recenterButton = function() {
    	map.fitBounds(bounds);
    };

    // add location markers for each location
    locations.forEach(function(location) {
        self.places.push( new Location(location) );
    });

    // locations viewed on map
    this.locationList = ko.computed(function() {
        var searchFilter = self.searchTerm().toLowerCase();
        if (searchFilter) {
            return ko.utils.arrayFilter(self.places(), function(location) {
                var str = location.title.toLowerCase();
                var result = str.includes(searchFilter);
                location.visible(result);
				return result;
			});
        }
        self.places().forEach(function(location) {
            location.visible(true);
        });
        return self.places();
    }, self);
};

function populateInfoWindow(marker, wikiLink, wikiStr, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
	  // Clear the infowindow content to give the streetview time to load.
	  infowindow.setContent('');
	  infowindow.marker = marker;
	  // Make sure the marker property is cleared if the infowindow is closed.
	  infowindow.addListener('closeclick', function() {
	    infowindow.marker = null;
	  });
	  var streetViewService = new google.maps.StreetViewService();
	  var radius = 50;

	  var windowContent = '<div id="info-window"><h5>' + marker.title + '</h5>' + '<p>Wikipedia Link: <a href="' + wikiLink + '">' + wikiStr + '</a></p>';
	  // In case the status is OK, which means the pano was found, compute the
	  // position of the streetview image, then calculate the heading, then get a
	  // panorama from that and set the options
	  var getStreetView = function(data, status) {
	    if (status == google.maps.StreetViewStatus.OK) {
	      var nearStreetViewLocation = data.location.latLng;
	      var heading = google.maps.geometry.spherical.computeHeading(
	        nearStreetViewLocation, marker.position);
	        infowindow.setContent(windowContent + '<div id="pano"></div></div>');
	        var panoramaOptions = {
	          position: nearStreetViewLocation,
	          pov: {
	            heading: heading,
	            pitch: 30
	          }
	        };
	      var panorama = new google.maps.StreetViewPanorama(
	        document.getElementById('pano'), panoramaOptions);
	    } else {
	      infowindow.setContent('<div>' + marker.title + '</div>' +
	        '<div>No Street View Found</div>');
	    }
	  }
	  // Use streetview service to get the closest streetview image within
	  // 50 meters of the markers position
	  streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
	  // Open the infowindow on the correct marker.
	  infowindow.open(map, marker);
	}
}

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1400);
  }
}

