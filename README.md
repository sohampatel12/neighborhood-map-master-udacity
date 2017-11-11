# Neighborhood Map Project 

This project contains a neighborhood I would like to visit. The map contains a list of locations which are marked on the map view. The markers show info windows when clicked to view further information about the place when clicked. The info window contains a wikipedia link for further information about the place. The window also contains a street view imagery of the place. 

## Usage:
### Online hosting:

The project I had been working on is hosted on GitHubPages. So you can directly visit the below URL and carry out all the page speed tests 

URL : https://sohampatel12.github.io/neighborhood-map-master-udacity/

### For Local usage: 

- To start the app, open index.html in your browser. 

- The javascript code is written in js/app.js

- Styles are given using bootstrap and css/styles.css

## Functions used in the project:

- initMap() function is used to initialize Google Maps object. 
- googleMapsErrors() handles if there has been an error loading the Google Maps object.
- makeMarkerIcon() makes marker icons of different color arguments given to it.
- Location() object creates an object for every location and assigns markers and functions to it.
- ViewModel() is the ViewModel part of the knockout MVVM technique.
- populateInfoWindow() function adds elements to the info windows related to their respective markers.
- toggleBounce() function toggles bounce animation to the marker when clicked. 

## References: 

- Bootstrap documentation: https://getbootstrap.com/docs/4.0/getting-started/introduction/
- Knockout documentation: http://knockoutjs.com/documentation/introduction.html
- YouTube video on knocout: https://www.youtube.com/watch?v=AQbdDLweGxQ
- Udacity FEND - Static Maps and Street View Imagery.
- stackoverflow
- Udacity forums 

## Browser Support

![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
IE 9+ ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

## License

MIT License

Copyright (c) 2017 Soham Patel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
