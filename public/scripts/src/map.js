var app = angular.module("app", []);

app.controller("SearchCtrl", function ($scope) {

    
    console.log('Youre in the map.js');
    
    // current location
    $scope.loc = { lat: 40, lon: -73 };
    $scope.gotoCurrentLocation = function () {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var c = position.coords;
                $scope.gotoLocation(c.latitude, c.longitude);
            });
            return true;
        }
        return false;
    };
    $scope.gotoLocation = function (lat, lon) {
        if ($scope.lat != lat || $scope.lon != lon) {
            $scope.loc = { lat: lat, lon: lon };
            if (!$scope.$$phase) $scope.$apply("loc");
        }
    };

    // geo-coding
    $scope.search = "";
    $scope.geoCode = function () {
        if ($scope.search && $scope.search.length > 0) {
            if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
            this.geocoder.geocode({ 'address': $scope.search }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var loc = results[0].geometry.location;
                    $scope.search = results[0].formatted_address;
                    $scope.gotoLocation(loc.lat(), loc.lng());
                } else {
                    alert("Sorry, this search produced no results.");
                }
            });
        }
    };

    // some points of interest to show on the map
    // to be user as markers, objects should have "lat", "lon", and "name" properties
    $scope.airports = [
        { "name": "Hartsfield Jackson Atlanta", "code": "ATL", "city": "Atlanta", "state": "GA", "lat": 33.64, "lon": -84.444, "vol2011": 44414121 },
        { "name": "O'Hare", "code": "ORD", "city": "Chicago", "state": "IL", "lat": 41.9794, "lon": -87.9044, "vol2011": 31892301 },
        { "name": "Los Angeles", "code": "LAX", "city": "Los Angeles", "state": "CA", "lat": 33.9425, "lon": -118.4081, "vol2011": 30528737 },
        { "name": "Dallas/Fort Worth", "code": "DFW", "city": "Dallas/Fort Worth", "state": "TX", "lat": 32.8974, "lon": -97.0407, "vol2011": 27518358 },
        { "name": "Denver", "code": "DEN", "city": "Denver", "state": "CO", "lat": 39.8631, "lon": -104.6736, "vol2011": 25667499 },
        { "name": "ATR @ 60180850", "code": "JFK", "city": "60180850", "state": "NY", "lat": 40.6438, "lon": -73.782, "vol2011": 23664830 },
        { "name": "San Francisco", "code": "SFO", "city": "San Francisco", "state": "CA", "lat": 37.6152, "lon": -122.39, "vol2011": 20038679 },
        { "name": "McCarran", "code": "LAS", "city": "Las Vegas", "state": "NV", "lat": 36.085, "lon": -115.1511, "vol2011": 19854759 },
        { "name": "Phoenix Sky Harbor", "code": "PHX", "city": "Phoenix", "state": "AZ", "lat": 33.4365, "lon": -112.0073, "vol2011": 19750306 },
        { "name": "George Bush", "code": "IAH", "city": "Houston", "state": "TX", "lat": 29.9867, "lon": -95.3381, "vol2011": 19306660 },
    ];
});

// formats a number as a latitude (e.g. 40.46... => "40°27'44"N")
app.filter('lat', function () {
    return function (input, decimals) {
        if (!decimals) decimals = 0;
        input = input * 1;
        var ns = input > 0 ? "N" : "S";
        input = Math.abs(input);
        var deg = Math.floor(input);
        var min = Math.floor((input - deg) * 60);
        var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
        return deg + "°" + min + "'" + sec + '"' + ns;
    }
});

// formats a number as a longitude (e.g. -80.02... => "80°1'24"W")
app.filter('lon', function () {
    return function (input, decimals) {
        if (!decimals) decimals = 0;
        input = input * 1;
        var ew = input > 0 ? "E" : "W";
        input = Math.abs(input);
        var deg = Math.floor(input);
        var min = Math.floor((input - deg) * 60);
        var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
        return deg + "°" + min + "'" + sec + '"' + ew;
    }
});

// - Documentation: https://developers.google.com/maps/documentation/
app.directive("appMap", function () {
    return {
        restrict: "E",
        replace: true,
        template: "<div></div>",
        scope: {
            center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
            markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
            width: "@",         // Map width in pixels.
            height: "@",        // Map height in pixels.
            zoom: "@",          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
            mapTypeId: "@",     // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
            panControl: "@",    // Whether to show a pan control on the map.
            zoomControl: "@",   // Whether to show a zoom control on the map.
            scaleControl: "@"   // Whether to show scale control on the map.
        },
        link: function (scope, element, attrs) {
            var toResize, toCenter;
            var map;
            var currentMarkers;

            // listen to changes in scope variables and update the control
            var arr = ["width", "height", "markers", "mapTypeId", "panControl", "zoomControl", "scaleControl"];
            for (var i = 0, cnt = arr.length; i < arr.length; i++) {
                scope.$watch(arr[i], function () {
                    cnt--;
                    if (cnt <= 0) {
                        updateControl();
                    }
                });
            }

            // update zoom and center without re-creating the map
            scope.$watch("zoom", function () {
                if (map && scope.zoom)
                    map.setZoom(scope.zoom * 1);
            });
            scope.$watch("center", function () {
                if (map && scope.center)
                    map.setCenter(getLocation(scope.center));
            });

            // update the control
            function updateControl() {

                // update size
                if (scope.width) element.width(scope.width);
                if (scope.height) element.height(scope.height);

                // get map options
                var options =
                {
                    center: new google.maps.LatLng(40, -73),
                    zoom: 6,
                    mapTypeId: "roadmap"
                };
                if (scope.center) options.center = getLocation(scope.center);
                if (scope.zoom) options.zoom = scope.zoom * 1;
                if (scope.mapTypeId) options.mapTypeId = scope.mapTypeId;
                if (scope.panControl) options.panControl = scope.panControl;
                if (scope.zoomControl) options.zoomControl = scope.zoomControl;
                if (scope.scaleControl) options.scaleControl = scope.scaleControl;

                // create the map
                map = new google.maps.Map(element[0], options);

                // update markers
                updateMarkers();

                // listen to changes in the center property and update the scope
                google.maps.event.addListener(map, 'center_changed', function () {

                    // do not update while the user pans or zooms
                    if (toCenter) clearTimeout(toCenter);
                    toCenter = setTimeout(function () {
                        if (scope.center) {

                            // check if the center has really changed
                            if (map.center.lat() != scope.center.lat ||
                                map.center.lng() != scope.center.lon) {

                                // update the scope and apply the change
                                scope.center = { lat: map.center.lat(), lon: map.center.lng() };
                                if (!scope.$$phase) scope.$apply("center");
                            }
                        }
                    }, 500);
                });
            }

            // update map markers to match scope marker collection
            function updateMarkers() {
                if (map && scope.markers) {

                    // clear old markers
                    if (currentMarkers != null) {
                        for (var i = 0; i < currentMarkers.length; i++) {
                            currentMarkers[i] = m.setMap(null);
                        }
                    }

                    // create new markers
                    currentMarkers = [];
                    var markers = scope.markers;
                    if (angular.isString(markers)) markers = scope.$eval(scope.markers);
                    for (var i = 0; i < markers.length; i++) {
                        var m = markers[i];
                        var loc = new google.maps.LatLng(m.lat, m.lon);
                        var mm = new google.maps.Marker({ position: loc, map: map, title: m.name });
                        currentMarkers.push(mm);
                    }
                }
            }

            // convert current location to Google maps location
            function getLocation(loc) {
                if (loc == null) return new google.maps.LatLng(40, -73);
                if (angular.isString(loc)) loc = scope.$eval(loc);
                return new google.maps.LatLng(loc.lat, loc.lon);
            }
        }
    };
});
