define(['angular'], function (angular) {
    'use strict';

    var mainAppControllers = angular.module('mainAppControllers', []);
    mainAppControllers.controller('NavCtrl', ['$location', 'localStorageService', 'AuthenticationService', NavCtrl]);
    mainAppControllers.controller('LoginCtrl', ['$location', 'ResourceService' ,'CryptoJSService', 'localStorageService', 'toastr' ,LoginCtrl]);
    mainAppControllers.controller('RegistrationCtrl', ['ResourceService', 'CryptoJSService', 'toastr', RegistrationCtrl]);
    mainAppControllers.controller('HomeCtrl', ['ResourceService', 'data', 'toastr', HomeCtrl]);
    mainAppControllers.controller('PersonCtrl', ['ResourceService', 'toastr', PersonCtrl]);
    mainAppControllers.controller('ThingCtrl', ['ResourceService', 'toastr', ThingCtrl]);
    mainAppControllers.controller('ProvaCtrl', [ProvaCtrl]);
    mainAppControllers.controller('SearchCtrl', ['$scope', '$http',  '$timeout', function($scope, $http,  $timeout) {
        $scope.cities = [];
        $scope.map;

        $scope.infoBox = new google.maps.InfoWindow();

        $scope.options = {scrollwheel: false,
        };
        $scope.coordsUpdates = 0;
        $scope.dynamicMoveCtr = 0;

        var mapContainer = document.getElementById('map');
        mapContainer.style.width = '70%';
        mapContainer.style.height = '500px';

        $http.get('data.json').success(function(data) {

            $scope.cities = data;
        });



        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info){

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.place
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '<br />' + info.lat + ' E,' + info.long +  ' N, </div>';

            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent('<h2>' + marker.title + '</h2>' +
                    marker.content);
                infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);

        }

        
        for (var i = 0; i < cities.length; i++){
            createMarker(cities[i]);
        }



        $scope.initialize = function() {
            var mapOptions = {
                center: new google.maps.LatLng(50.5, 30.5),
                zoom: 4,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.map = new google.maps.Map(mapContainer, mapOptions);
        }

        $scope.showCity = function(city) {
            console.log('1' + city.city + ' '+ city.lat + ' ' + city.long);

            for(var i=0; i<city.city.length; ++i)
            {
                console.log(city.city[i]);

            }
            console.log('length' + city.city.length);

            var mapOptions = {
                center: new google.maps.LatLng(city.lat[0], city.long[0]),
                zoom: 7,
                mapTypeId: google.maps.MapTypeId.ROADMAP,

            };

            $scope.map = new google.maps.Map(mapContainer, mapOptions);

            for(var i=0; i<city.city.length+1; ++i) {

                $scope.infoBox.setContent(city.city[i] + ' - ' + city.desc[i]);

                new google.maps.Marker({position: {lat: city.lat[i], lng: city.long[i]}, map: $scope.map});
                $scope.infoBox.open($scope.map);
            }

            $scope.map.setCenter({position: {lat: city.lat[0], lng: city.long[0]}, map: $scope.map});

            //$scope.markers.push(marker);
        }

        $scope.loadMarkers = function(locations)
        {
            console.log(locations);
            $scope.markers = _map(locations, function(location, key){
                return{
                    latitude:parseFloat(location.lat),
                    longitude: parseFloat(location.lng),
                    maxWidth: 300,

                }

            })

        }

        // function to fill array of markers
        $scope.createMarkers = function() {
            for (var i = 0; i < $scope.locations.spots.length; i++) {
                var marker = $scope.createMarker($scope.locations.spots[i]);
                $scope.markers.push(marker);
            }
        };
        // call upon controller initialization


/*
        $scope.marker = {
            id: 0,
            coords: {
                latitude: 40.1451,
                longitude: -99.6680
            },
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {
                    $log.log('marker dragend');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    $log.log(lat);
                    $log.log(lon);

                    $scope.marker.options = {
                        draggable: true,
                        labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                        labelAnchor: "100 0",
                        labelClass: "marker-labels"
                    };
                }
            }
        };

        $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
            if (_.isEqual(newVal, oldVal))
                return;
            $scope.coordsUpdates++;
        });

        $timeout(function () {
            $scope.marker.coords = {
                latitude: 42.1451,
                longitude: -100.6680
            };
            $scope.dynamicMoveCtr++;
            $timeout(function () {
                $scope.marker.coords = {
                    latitude: 43.1451,
                    longitude: -102.6680
                };
                $scope.dynamicMoveCtr++;
            }, 2000);
        }, 1000);
*/
    }]);

    function ProvaCtrl() {
        var vm = this;
        vm.user = "";
    }

    ProvaCtrl.prototype.printHello = function()
    {
        var vm = this;
        return "Hello World "+vm.user;
    };


    function SearchCtrl ()
    {
        console.log("In search ctrl");
    }

    SearchCtrl.prototype.search= function($scope)
    {

    };





    function NavCtrl($location, localStorageService, AuthenticationService)
    {
        var vm = this;
        vm.$location = $location;
        vm.localStorageService = localStorageService;
        vm.isAuthenticated = AuthenticationService.isLogged()
    }

    NavCtrl.prototype.logout = function ()
    {
        var vm = this;
        vm.localStorageService.clearAll();
        vm.$location.path("/login");
    };



    function LoginCtrl ($location, ResourceService, CryptoJS, localStorageService, toastr)
    {
        console.log("In login ctrl");
        var vm = this;
        vm.$location = $location;
        vm.ResourceService = ResourceService;
        vm.CryptoJS = CryptoJS;
        vm.localStorageService = localStorageService;
        vm.toastr = toastr;

        vm.failed_login = "";
    }

    LoginCtrl.prototype.submit = function()
    {
        console.log("In login ctrl 22222222222");
        var vm = this;
        var salt = vm.username;


        var enc_password = CryptoJS.PBKDF2(vm.password, salt, { keySize: 256/32 });

        var user = {"username": vm.username, "password": enc_password.toString()};

        if(vm.username!==undefined || vm.password !==undefined){

            vm.ResourceService.login(user).then(function(data){
                vm.localStorageService.set("auth_token",data.auth_token);
                vm.$location.path("/home");
            },function(data, status) {
                if(status===401){
                    vm.toastr.error('Wrong username and/or password!');
                }else{
                    vm.toastr.error(data);
                }
            });

        }else{
            noty({text: 'Username and password are mandatory!',  timeout: 2000, type: 'error'});
        }
    };

    function RegistrationCtrl (ResourceService, CryptoJS, toastr)
    {
        var vm = this;
        vm.ResourceService = ResourceService;
        vm.CryptoJS = CryptoJS;
        vm.toastr = toastr;
    }

    RegistrationCtrl.prototype.signup = function()
    {
        var vm = this;
        var salt = vm.username;

        var enc_password = CryptoJS.PBKDF2(vm.password, salt, { keySize: 256/32 });
        var enc_check_password = CryptoJS.PBKDF2(vm.check_password, salt, { keySize: 256/32 });

        var user = {"username": vm.username, "password": enc_password.toString(), "check_password" : enc_check_password.toString() };

 

        if(vm.username!==undefined || vm.password !==undefined || vm.check_password !==undefined){
            if(vm.password !== vm.check_password){
                vm.toastr.warning('password and check_password must be the same!');
            }

            else {



                var adr=vm.username;
                var adr_pattern=/[0-9a-z_]+@[0-9a-z_]+\.[a-z]{2,5}/i;
                var prov=adr_pattern.test(adr);

                console.log('Here');

                console.log(adr);
                console.log(prov);
                
                if (prov!=true)
                {
                    vm.toastr.warning('write valid email!');
                }
                else
                if (vm.password.length < 5) {
                    vm.toastr.warning('password must be with minimum 5 elements!');
                }
                else{
                vm.ResourceService.signup(user).then(function () {
                    vm.toastr.success('User successfully registered!');
                    vm.username = null;
                    vm.password = null;
                    vm.check_password = null;
                }, function (data) {
                    vm.toastr.error(data.message);
                });
            }
            }
        }else{
            noty({text: 'Username and password are mandatory!',  timeout: 2000, type: 'warning'});
        }
    };


    function HomeCtrl(ResourceService, data, toastr)
    {
        var vm = this;
        vm.ResourceService = ResourceService;
        vm.data = data;
        vm.toastr = toastr;

        vm.people = data[0].people;
        vm.things = data[1].things;
    }

    HomeCtrl.prototype.updatePerson = function(index, modify)
    {
        var vm = this;
        var person = vm.people[index];

        if(modify){
            vm.people[index].modify=true;
        }else{
            vm.ResourceService.updatePerson(person).then(function(){
                vm.people[index].modify=false;
                vm.toastr.success("Person successfully updated!");
            },function(data, status) {
                if(status!==401){
                    vm.toastr.error(data);
                }
            });
        }
    };

    HomeCtrl.prototype.updateThing = function(index, modify)
    {
        var vm = this;
        var thing = vm.things[index];

        if(modify){
            vm.things[index].modify=true;
        }else{

            vm.ResourceService.updateThing(thing).then(function(){
                vm.things[index].modify=false;
                vm.toastr.success("Thing successfully updated!");
            },function(data, status) {
                if(status!==401){
                    vm.toastr.error(data);
                }
            });
        }
    };

    HomeCtrl.prototype.deleteThing = function(index)
    {
        var vm = this;
        var thing = vm.things[index];

        vm.ResourceService.deleteThing(thing).then(function(){
            vm.things.splice(index, 1);
            vm.toastr.success("Thing successfully deleted!");
        },function(data, status) {
            if(status!==401){
                vm.toastr.error(data);
            }
        });
    };

    HomeCtrl.prototype.deletePerson = function(index)
    {
        var vm = this;
        var person = vm.people[index];

        vm.ResourceService.deletePerson(person).then(function(){
            vm.people.splice(index, 1);
            vm.toastr.success("Person successfully deleted!");
        },function(data, status) {
            if(status!==401){
                vm.toastr.error(data);
            }
        });
    };

    function PersonCtrl(ResourceService, toastr) {
        var vm = this;
        vm.person = null;
        vm.ResourceService = ResourceService;
        vm.toastr = toastr;
    }

    PersonCtrl.prototype.createPerson = function()
    {
        var vm = this;
        var person = {person: vm.person};

        vm.ResourceService.createPerson(person).then(function(data){
            vm.person = null;
            vm.toastr.success(data.message);
        },function(data, status) {
            if(status!==401){
                vm.toastr.error(data);
            }
        });
    };


    function ThingCtrl(ResourceService, toastr)
    {
        var vm = this;
        vm.thing = null;
        vm.ResourceService = ResourceService;
        vm.toastr = toastr;
    }

    ThingCtrl.prototype.createThing = function()
    {
        var vm = this;
        var thing = {thing: vm.thing};

        vm.ResourceService.createThing(thing).then(function(data){
            vm.thing = null;
            vm.toastr.success(data.message);
        },function(data, status) {
            if(status!==401){
                vm.toastr.error(data);
            }
        });
    };

    return mainAppControllers;

});