var MapsApplication = function () {
  var mapsModel = {
    markers: ko.observableArray([])
  };

  /*Render Google Maps*/
  
  ko.bindingHandlers.mapPanel = {
    init: function(element, valueAccessor) {
      
      var stockholm = new google.maps.LatLng(59.32,18.07)

      var request = {
        location: stockholm,
        radius: '2000',
        query: 'restaurant'
      };
      
      function createMarker(position, icon) {
          
      }

      var map = new google.maps.Map(element, {
        zoom: 13,
        center: stockholm
      });
      var service = new google.maps.places.PlacesService(map)
      var fsClientId = 'O5DTF5Y2B3KPIGN15CBVHJZ11JQYMGHVKU2GHQAX1VRYKNBJ';
      var fsClientSecret = 'Q0VCJC0ZFHLEI3S5XTFU3ZJT0S31MS1OHEAIU3ARGI2LYNLE';
      var fsURL = 'https://api.foursquare.com/v2/venues/search?v=20161016&client_id=' + fsClientId + '&client_secret=' + fsClientSecret + '&near=stockholm&query='
      // Call the google places API to retrieve restaurants
      service.textSearch(request, callback);
      function callback(results, status) {
        if(status == google.maps.places.PlacesServiceStatus.OK) {
          var closestMatch;
          for(var i = 0; i < results.length; i++) {
            $.getJSON(fsURL + results[i].name, function(data) {
              if(data.response.venues.length > 0) {
                mapsModel.markers.push(data.response.venues[0]);
              }
            })
          }
          console.log(mapsModel.markers());
        } else {
          $('locationLoad').show();
        }


        for (var i = 0; i < mapsModel.markers.length; i++) {
          var place = mapsModel.markers[i];
          var infoWindow = new google.maps.InfoWindow({
            content: place.name
          });
          console.log({ lat: place.location.lat, lng: place.location.lng })
          
          var marker = new google.maps.Marker({
            position: { lat: place.location.lat, lng: place.location.lng },
            map: map,
            title: place.name
          });
          
          marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow)
          });
        }

        function populateInfoWindow(marker, infoWindow) {
            if(infoWindow.marker != marker) {
              infoWindow.marker = marker;
              infoWindow.setContent(marker.title);
              infoWindow.open(map, marker);

              infoWindow.addListener('closelick', function(){
                infoWindow.setMarker(null);
              });
            }
          }
      }
    }
  };

  

  var init = function () {
    /* add code to initialize this module */
    ko.applyBindings(MapsApplication);
  };
  
  $(init);

  return {
    mapsModel: mapsModel
  };

}();