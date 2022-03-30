let markers = [];

mapboxgl.accessToken =
    "pk.eyJ1Ijoib2hobm9vMjE1MCIsImEiOiJjbDEycWpnZ2UxbXd5M2tvMG05ZjZrYXA2In0._v-s_exYYMbqsX_fDCx-4Q";

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-71.091542, 42.358862],
    zoom: 12,
});

async function runTracker() {
    // get bus data
    const locations = await getBusLocations();
    console.log(new Date());
    console.log(locations);
    locations.forEach((bus) => {
        const markerObj = markerId(bus.attributes.label);
        if (markerObj) {
            const marker = Object.values(markerObj)[0];
            updateMarker(marker, bus);
        } else {
            newMarker(bus, bus.attributes.label);
        }
    });
    // timer
    setTimeout(runTracker, 15000);
}

// Request bus data from MBTA
async function getBusLocations() {
    const response = await fetch("https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip");
    const json = await response.json();
    return json.data;
}

// Create new marker and push to array
function newMarker(bus, id) {
    const marker = new mapboxgl.Marker()
        .setLngLat([bus['attributes']['longitude'], bus['attributes']['latitude']])
        .setPopup(
            new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            }).setHTML(bus.attributes.label)
        )
        .addTo(map);
    const item = {
        "marker": marker,
        "id": id,
    };
    markers.push(item);
}

// Update marker location
function updateMarker(marker, bus) {
    marker.setLngLat([bus['attributes']['longitude'], bus['attributes']['latitude']]);
}

// Get marker by bus label
function markerId(label) {
    const result = markers.find((item) => item['id'] === label);
    return result;
}
