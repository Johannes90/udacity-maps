// Defining Initial map variables.

var map;
var markers = [];
var stockholm = { lat: 59.32, lng: 18.07 };

function initMap() {
  // Error handling
  if (typeof google !== 'undefined') {

    // Create initial map

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: stockholm
    });

    var infoWindow = new google.maps.InfoWindow();
    // Creating markers for each location and loading them into the observable Knockout Array.

    for (var i = 0; i < locations.length; i++) {
      (function () {
        var place = locations[i];
        var marker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          name: place.name,
          animation: google.maps.Animation.DROP
        });
        markers.push(marker);
        mapsApplication.locationArray()[i].marker = marker;

        marker.addListener('click', function () {
          populateInfoWindow(this, infoWindow);
          map.setCenter(marker.getPosition());
        });

        // Populating the info window

        function populateInfoWindow(marker, infoWindow) {
          if (infoWindow.marker != marker) {
            infoWindow.marker = marker;
            console.log(marker);
            infoWindow.setContent('<div class="title">' + marker.name + marker.contentString + '</div>');
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
              marker.setAnimation(null);
            }, 1400);
            infoWindow.open(map, marker);

            infoWindow.addListener('closelick', function () {
              infoWindow.setMarker(null);
            });
          }
        }

        // Variables for the Foursquare call
        var fsClientId = 'O5DTF5Y2B3KPIGN15CBVHJZ11JQYMGHVKU2GHQAX1VRYKNBJ';
        var fsClientSecret = 'Q0VCJC0ZFHLEI3S5XTFU3ZJT0S31MS1OHEAIU3ARGI2LYNLE';
        var fsURL = 'https://api.foursquare.com/v2/venues/search';
        var restaurant;
        var type;
        var locURL;

        // Foursquare Ajax call to retrieve additional info
        $.ajax({
          url: fsURL,
          dataType: 'json',
          data: {
            client_id: fsClientId,
            client_secret: fsClientSecret,
            v: 20161016,
            near: 'stockholm',
            query: marker.name
          },
          success: function (res) {
            try {
              restaurant = res.response.venues[0];
              type = restaurant.categories[0].name;
              locURL = 'https://foursquare.com/v/' + restaurant.id;
              contentString = '<p>' + type + '<p>' + '<p>Link to Foursquare:' + '<a href="' + locURL + '">' + locURL + '</a>' + '</p>';
              marker.contentString = contentString;
            } catch (error) {
              contentString = '<p>Cannot receive more information for this venue.</p>';
              marker.contentString = contentString;
            }
          },
          error: function (res) {
            contentString = '<p>Cannot connect to foursquare. Please try again.</p>';
            marker.contentString = contentString;
          }
        });
      })(i);
    }
  }
  else {
    console.log('google is undefined');
    mapError();
  }
}



var Location = function (data) {
  var self = this;
  this.name = data.name;
  this.location = data.geometry.location;
  this.show = ko.observable(true);
};


// Creating the Knockout functionality

var MapsApplication = function () {
  var self = this;
  this.locationArray = ko.observableArray();
  this.filterInput = ko.observable('');

  for (var i = 0; i < locations.length; i++) {
    var place = new Location(locations[i]);
    self.locationArray.push(place);
  }
  console.log(self.locationArray());

  // This is defining the filter function and setting correct visibility for the map.
  this.searchFilter = ko.computed(function () {
    var filter = self.filterInput().toLowerCase();

    for (var i = 0; i < self.locationArray().length; i++) {
      if (self.locationArray()[i].name.toLowerCase().indexOf(filter) > -1) {
        self.locationArray()[i].show(true);
        if (self.locationArray()[i].marker) {
          self.locationArray()[i].marker.setVisible(true);
        }
      } else {
        self.locationArray()[i].show(false);
        if (self.locationArray()[i].marker) {
          self.locationArray()[i].marker.setVisible(false);
        }
      }
    }
  });

  this.showLocation = function (locationInput) {
    google.maps.event.trigger(locationInput.marker, 'click');
  };
};

// New instance of the mapsApplication Knockout function.
mapsApplication = new MapsApplication();
ko.applyBindings(mapsApplication);

// Error handeler for Google Maps

function mapError() {
  alert("Map could not be loaded at this moment. Please try again");
}