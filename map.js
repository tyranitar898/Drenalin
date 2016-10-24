function start() {


    var x = retrieveFirebaseLocations();

}
/**/


function retrieveFirebaseLocations() {
    var rootRef = new Firebase('https://sportnetwork.firebaseio.com');



    var firebasemapboxob = new Object();
    eventRef = rootRef.child('Events')
    eventRef.on("value", function(snapshot) {
        mapboxgl.accessToken = 'pk.eyJ1IjoidHlyYW5pdGFyODk4IiwiYSI6ImNpa2wwejE3aDBmZHV2dGttdmZ2ZTRrNGIifQ.SyupoKOS5h9mTNrmiUQ78g';
        var map = new mapboxgl.Map({
            container: 'map',
            center: [121.276029722167, 31.2069089106785],
            zoom: 14,
            style: 'mapbox://styles/tyranitar898/cipi8t7hn004ebbm6ymguz6st',

        });

        var LLArray = new Array();

        firebasemapboxob = snapshot.val();
        $.each(firebasemapboxob, function(index, value) {

            var featureOBJ = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [value.Longitude, value.Latitude]
                },
                "properties": {
                    "title": value.Name,
                    "marker-symbol": "golf-15"
                }
            };
            LLArray.push(featureOBJ);
        });

        console.log(LLArray);
        map.on('load', function() {

            map.addSource("markers", {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",

                    "features": LLArray
                }
            });

            map.addLayer({
                "id": "eventPoints",
                "type": "symbol",
                "maxzoom": 21,
                "minzoom": 0,
                "source": "markers",
                "layout": {
                    "icon-image": "{marker-symbol}",
                    "text-field": "{title}",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 0.6],
                    "text-anchor": "top",


                }
            });

        });

    });


}



window.onload = start();
