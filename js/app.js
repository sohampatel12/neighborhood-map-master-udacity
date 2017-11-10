var map;

var markers = [];

var locations = [
	{
		title: 'Park Ave Penthouse',
		location: {
			lat: 40.7713024,
			lng: -73.9632393
		}
	},
	{
		title: 'Chelsea Loft',
		location: {
			lat: 40.7444883,
			lng: -73.9949465
		}
	},
	{
		title: 'Union Square Open Floor Plan',
		location: {
			lat: 40.7347062,
			lng: -73.9895759
		}
	},
	{
		title: 'East Village Hip Studio',
		location: {
			lat: 40.7281777,
			lng: -73.984377
		}
	},
	{
		title: 'TriBeCa Artsy Bachelor Pad',
		location: {
			lat: 40.7195264,
			lng: -74.0089934
		}
	},
	{
		title: 'Chinatown Homey Space',
		location: {
			lat: 40.7180628,
			lng: -73.9961237
		}
	}
];

var Location = function(location) {
	var self = this;
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
	// Create default and highlighted icons for when the mouse hovers over the icon.
	var defaultIcon = makeMarkerIcon('0091ff');
	var highlightedIcon = makeMarkerIcon('FFFF24');

	// Get the position from the location array.
	self.position = ko.observable(location.location);
	self.title = ko.observable(location.title);
	self.active = ko.observable(false);

	self.getContent = function(callback) {
        // if self.content has already been set, return its value
        if (self.content){
            return self.content();
        }

        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.name() + '&format=json&callback=wikiCallback';

        jQuery.ajax({
            url: wikiUrl,
            dataType: 'jsonp',
        })
        .done(function(response) {
            var wikiContent = '';
            if (response){
                if (typeof response[1] !=="undefined" && typeof response[3] !=="undefined"){
                    for (var i = 0; i < 3; i++) {
                        if (typeof response[1][i] !=="undefined" && typeof response[3][i] !=="undefined"){
                            wikiContent += '<a href="' + response[3][i] + '" target"_blank">' + response[1][i] + '</a><br>';
                        }
                    }
                }
            }
            if (wikiContent !== '') {
                self.content = ko.observable('<h4>Wikipedia results for "' + self.name() + '"</h4><p>' + wikiContent + '</p>');                 
            } else {
                self.content = ko.observable('<h4>Wikipedia results for "' + self.name() + '"</h4><p>There was a problem reaching wikipedia, sorry =/</p>');                 
            }
        })
        .fail(function() {
            console.log("error in ajax call to wikipedia's api");
            self.content = ko.observable('<h4>Wikipedia results for "' + self.name() + '"</h4><p>There was a problem reaching wikipedia, sorry =/</p>');                 
        })
        .always(function() {
            if (typeof callback !== "undefined"){
                callback(self);
            }
        });

        // return a spinner for while the external API is still loading
        return '<h4>Wikipedia results for "' + self.name() + '"</h4><p><span class="spinner"></span></p>';
    };


	// Create a marker per location, and put into markers array.
	self.createMarker = (function() {
		self.marker = new google.maps.Marker({
			position: self.position,
			title: self.title,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
		});

		map.bounds.extend(self.marker.position);

		self.marker.addListener('click', function() {
			selectLocation(self);

		self.marker.addListener('mouseover', function() {
			self.setIcon(highlightedIcon);
		});
		
		self.marker.addListener('mouseout', function() {
			self.setIcon(defaultIcon);
		});

		});
	})();	

};

// function initMap() {

// 	var styles = [
// 		{
// 			"stylers": [{
// 				"saturation": -100
// 			}, {
// 				"gamma": 1
// 			}]
// 		}, {
// 			"elementType": "labels.text.stroke",
// 			"stylers": [{
// 				"visibility": "off"
// 			}]
// 		}, {
// 			"featureType": "poi.business",
// 			"elementType": "labels.text",
// 			"stylers": [{
// 				"visibility": "off"
// 			}]
// 		}, {
// 			"featureType": "poi.business",
// 			"elementType": "labels.icon",
// 			"stylers": [{
// 				"visibility": "off"
// 			}]
// 		}, {
// 			"featureType": "poi.place_of_worship",
// 			"elementType": "labels.text",
// 			"stylers": [{
// 				"visibility": "off"
// 			}]
// 		}, {
// 			"featureType": "poi.place_of_worship",
// 			"elementType": "labels.icon",
// 			"stylers": [{
// 				"visibility": "off"
// 			}]
// 		}, {
// 			"featureType": "road",
// 			"elementType": "geometry",
// 			"stylers": [{
// 				"visibility": "simplified"
// 			}]
// 		}, {
// 			"featureType": "water",
// 			"stylers": [{
// 				"visibility": "on"
// 			}, {
// 				"saturation": 50
// 			}, {
// 				"gamma": 0
// 			}, {
// 				"hue": "#50a5d1"
// 			}]
// 		}, {
// 			"featureType": "administrative.neighborhood",
// 			"elementType": "labels.text.fill",
// 			"stylers": [{
// 				"color": "#333333"
// 			}]
// 		}, {
// 			"featureType": "road.local",
// 			"elementType": "labels.text",
// 			"stylers": [{
// 				"weight": 0.5
// 			}, {
// 				"color": "#333333"
// 			}]
// 		}, {
// 			"featureType": "transit.station",
// 			"elementType": "labels.icon",
// 			"stylers": [{
// 				"gamma": 1
// 			}, {
// 				"saturation": 50
// 			}]
// 		}
// 	];

// 	map = new google.maps.Map(document.getElementById('map'), {
// 		zoom: 10,
// 		styles: styles,
// 	});

// 	// Earlier locations was initialised here.

// 	// var largeInfowindow = new google.maps.InfoWindow();

// 	// // The following group uses the location array to create an array of markers on initialize.

// 	var bounds = new google.maps.LatLngBounds();

// 	// for (var i = 0; i < locations.length; i++) {
// 	// 	// Get the position from the location array.
// 	// 	var position = locations[i].location;
// 	// 	var title = locations[i].title;
// 	// 	// Create a marker per location, and put into markers array.
// 	// 	var marker = new google.maps.Marker({
// 	// 		position: position,
// 	// 		title: title,
// 	// 		animation: google.maps.Animation.DROP,
// 	// 		icon: defaultIcon,
// 	// 		id: i
// 	// 	});

// 	// 	marker.setMap(map);
// 	// 	bounds.extend(marker.position);

// 	// 	// Push the marker to our array of markers.
// 	// 	markers.push(marker);
// 	// 	// Create an onclick event to open the large infowindow at each marker.
// 	// 	marker.addListener('click', function() {
// 	// 		populateInfoWindow(this, largeInfowindow);
// 	// 	});
// 	// 	// Two event listeners - one for mouseover, one for mouseout,
// 	// 	// to change the colors back and forth.
// 	// 	marker.addListener('mouseover', function() {
// 	// 		this.setIcon(highlightedIcon);
// 	// 	});
// 	// 	marker.addListener('mouseout', function() {
// 	// 		this.setIcon(defaultIcon);
// 	// 	});
// 	// }

// 	map.fitBounds(bounds);

	

// 	document.getElementById('recenter-button').addEventListener('click', function() {
// 		map.fitBounds(bounds);
// 	});
// }

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
		zoom: 10,
		styles: styles
	});

    // initialize bounds variable
    map.bounds = new google.maps.LatLngBounds();

    // initialize infoWindow
    infoWindow = new google.maps.InfoWindow({
        content: ''
    });

    google.maps.event.addListener(infoWindow, 'closeclick', function(){
        resetActiveState();
    });

    // add eventlistener to resize map when the browser resizes
    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(map.bounds);
    });

    document.getElementById('recenter-button').addEventListener('click', function() {
		map.fitBounds(map.bounds);
	});
}

// function populateInfoWindow(marker, infowindow) {
// 	// Check to make sure the infowindow is not already opened on this marker.
// 	if (infowindow.marker != marker) {
// 		// Clear the infowindow content to give the streetview time to load.
// 		infowindow.setContent('');
// 		infowindow.marker = marker;
// 		// Make sure the marker property is cleared if the infowindow is closed.
// 		infowindow.addListener('closeclick', function() {
// 			infowindow.marker = null;
// 		});
// 		var streetViewService = new google.maps.StreetViewService();
// 		var radius = 50;
// 		// In case the status is OK, which means the pano was found, compute the
// 		// position of the streetview image, then calculate the heading, then get a
// 		// panorama from that and set the options
// 		function getStreetView(data, status) {
// 			if (status == google.maps.StreetViewStatus.OK) {
// 				var nearStreetViewLocation = data.location.latLng;
// 				var heading = google.maps.geometry.spherical.computeHeading(
// 					nearStreetViewLocation, marker.position);
// 				infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
// 				var panoramaOptions = {
// 					position: nearStreetViewLocation,
// 					pov: {
// 						heading: heading,
// 						pitch: 30
// 					}
// 				};
// 				var panorama = new google.maps.StreetViewPanorama(
// 					document.getElementById('pano'), panoramaOptions);
// 			} else {
// 				infowindow.setContent('<div>' + marker.title + '</div>' +
// 					'<div>No Street View Found</div>');
// 			}
// 		}
// 		// Use streetview service to get the closest streetview image within
// 		// 50 meters of the markers position
// 		streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
// 		// Open the infowindow on the correct marker.
// 		infowindow.open(map, marker);
// 	}
// }

var viewModel = {
	// var self = this;

	markers : ko.observableArray([]),

	locations : ko.observableArray([]),
	searchTerm : ko.observable(''),

	search: function(value) {
		viewModel.locations.removeAll();
		viewModel.markers.removeAll();

		if(value == '') return;

		for (var location in locations) {
			if(locations[location].title.toLowerCase().indexOf(value.toLowerCase()) >=0 ) {
				viewModel.locations.push(locations[location]);
				// viewModel.markers.push(markers[location]);
			// } else {
			// 	marker.setVisible(false);
			}
		}
	},

	resetActiveState: function() {
		currentLocation().active(false);
		currentLocation().marker.setAnimation(null);
		infoWindow.close();
	}

	// selectLocation: function(value) {
	// 	markers
	// }
};

viewModel.searchTerm.subscribe(viewModel.search);

ko.applyBindings(viewModel);
