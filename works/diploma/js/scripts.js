// Google Map
var map;

// markers for map
var markers = [];

// info window
var info = new google.maps.InfoWindow();

// execute when the DOM is fully loaded
$(function() {
    // styles for map
    var styles = [
        {
            featureType: "all",
            stylers: [{ saturation: 25 }]
        },
        {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ];

    // options for map
    var options = {
        center: { lat: 48.56, lng: 31.509 },
        zoom: 6,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 12,
        minZoom: 6,
        panControl: true,
        styles: styles
    };

    // get DOM node in which map will be instantiated
    var canvas = $("#map-canvas").get(0);

    // instantiate map
    map = new google.maps.Map(canvas, options);

    // configure UI once Google Map is idle
    google.maps.event.addListenerOnce(map, "idle", configure);
});

/**
 * Adds marker for place to map.
 */
function addMarker(place) {
    console.log(place);
    var latlng = new google.maps.LatLng(place.latitude, place.longitude);
    var marker = new MarkerWithLabel({
        position: latlng,
        map: map,
        labelContent: place.place_name,
        labelAnchor: new google.maps.Point(75, 0),
        labelClass: "label",
        icon: "img/icon.png"
    });

    google.maps.event.addListener(marker, "click", function() {
        // auto center map on marker click
        map.panTo(marker.getPosition());

        // show ajax indicator
        showInfo(marker);

        $.when(
            $.getJSON("http://api.openweathermap.org/data/2.5/weather", {
                lat: place.latitude,
                lon: place.longitude,
                appid: "a41d1d46e2d9075acbe27655af273216",
                units: "metric"
            }),
            $.getJSON("articles.php", { geo: place.place_name })
        ).then(function(weather_data, news_data) {
            // if no data
            if (news_data[0].length === 0) {
                var iconUrl = "img/" + weather_data[0].weather[0].icon + ".png";
                var infowindow =
                    '<div id="infoWindow">' +
                    '<table class="weatherInfo">' +
                    "<tr>" +
                    "<td>" +
                    '<img id="weatherIcon" src=' +
                    iconUrl +
                    ">" +
                    "</td>" +
                    "<td>" +
                    "<b>" +
                    place.place_name_rus +
                    "</b>" +
                    "<p>" +
                    '<span class="badge">' +
                    Math.round(Number(weather_data[0].main.temp)) +
                    "" +
                    " &#8451" +
                    "</span>" +
                    "  вітер " +
                    weather_data[0].wind.speed +
                    " м/с," +
                    "  тиск " +
                    Math.round(Number(weather_data[0].main.pressure * 0.75)) +
                    " мм.рт.ст" +
                    "</p>" +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    '<p align="center">' +
                    "Новин не знайдено" +
                    "</p>" +
                    "</div>";

                showInfo(marker, infowindow);
            } else {
                // else build list of links to articles
                // start ul
                var ul = "<ul>";

                // template for li
                var template = _.template(
                    "<li><a href='<%- link %>' target='_blank'><%- title %></a></li>"
                );

                // iterate over articles
                for (var i = 0; i < news_data[0].length; i++) {
                    // add li to ul
                    ul += template({
                        link: news_data[0][i].link,
                        title: news_data[0][i].title
                    });
                }

                // end ul
                ul += "</ul>";

                var iconUrl = "img/" + weather_data[0].weather[0].icon + ".png";
                var infowindow =
                    '<div id="infoWindow">' +
                    '<table class="weatherInfo">' +
                    "<tr>" +
                    "<td>" +
                    '<img id="weatherIcon" src=' +
                    iconUrl +
                    ">" +
                    "</td>" +
                    "<td>" +
                    "<b>" +
                    place.place_name +
                    "</b>" +
                    "<p>" +
                    '<span class="badge">' +
                    Math.round(Number(weather_data[0].main.temp)) +
                    "" +
                    " &#8451" +
                    "</span>" +
                    "  вітер " +
                    weather_data[0].wind.speed +
                    " м/с," +
                    "  тиск " +
                    Math.round(Number(weather_data[0].main.pressure * 0.75)) +
                    " мм.рт.ст" +
                    "</p>" +
                    "</td>" +
                    "</tr>" +
                    "</table>" +
                    "<div>" +
                    ul +
                    "</div>" +
                    "</div>";

                // show info window at marker with content
                showInfo(marker, infowindow);
            }
        });
    });

    markers.push(marker);
}

/**
 * Configures application.
 */
function configure() {
    // configure typeahead
    $("#q").typeahead(
        {
            autoselect: true,
            highlight: true,
            minLength: 1
        },
        {
            source: search,
            templates: {
                empty: "Нічого не знайдено",
                suggestion: _.template(
                    "<p><%- place_name %>, <%- admin_name1 %></p>"
                )
            }
        }
    );

    // re-center map after place is selected from drop-down
    $("#q").on("typeahead:selected", function(eventObject, suggestion, name) {
        // ensure coordinates are numbers
        var latitude = _.isNumber(suggestion.latitude)
            ? suggestion.latitude
            : parseFloat(suggestion.latitude);
        var longitude = _.isNumber(suggestion.longitude)
            ? suggestion.longitude
            : parseFloat(suggestion.longitude);

        // set map's center
        map.setCenter({ lat: latitude, lng: longitude });
        map.setZoom(11);

        // update UI
        update();
    });

    // hide info window when text box has focus
    $("#q").focus(function(eventData) {
        hideInfo();
    });

    // update UI
    update();
}

/**
 * Hide info window.
 */
function hideInfo() {
    info.close();
}

/**
 * Searches database for typeahead's suggestions.
 */
function search(query, cb) {
    // get places matching query (asynchronously)
    var parameters = {
        geo: query
    };
    $.getJSON("search.php", parameters)
        .done(function(data, textStatus, jqXHR) {
            // call typeahead's callback with search results (i.e., places)
            cb(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            // log error to browser's console
            console.log(errorThrown.toString());
        });
}

/**
 * Shows info window at marker with content.
 */
function showInfo(marker, content) {
    // start div
    var div = "<div class='info'>";
    if (typeof content === "undefined") {
        div += "<img src='img/loader.gif' alt='loading' class='ajax'/>";
        div += "Завантаження новин";
    } else {
        // $(content).find;
        div += content;
    }

    // end div
    div += "</div>";

    // set info window's content
    info.setContent(div);

    // open info window (if not already open)
    info.open(map, marker);
}

/**
 * Updates UI's markers.
 */
function update() {
    // get map's bounds
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    // get places within bounds (asynchronously)
    var parameters = {
        ne: ne.lat() + "," + ne.lng(),
        q: $("#q").val(),
        sw: sw.lat() + "," + sw.lng()
    };
    $.getJSON("update.php", parameters)
        .done(function(data, textStatus, jqXHR) {
            // add new markers to map
            for (var i = 0; i < data.length; i++) {
                addMarker(data[i]);
            }

            var mcOptions = { gridSize: 80, maxZoom: 10, imagePath: "img/m" };
            var markerCluster = new MarkerClusterer(map, markers, mcOptions);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            // log error to browser's console
            console.log(errorThrown.toString());
            console.warn(jqXHR.responseText);
        });
}
