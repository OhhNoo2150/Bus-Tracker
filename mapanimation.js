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
// trying to see if I can add the bus stops
const busStops = [
    [-71.093729, 42.359244],
    [-71.094915, 42.360175],
    [-71.0958, 42.360698],
    [-71.099558, 42.362953],
    [-71.103476, 42.365248],
    [-71.106067, 42.366806],
    [-71.108717, 42.368355],
    [-71.110799, 42.369192],
    [-71.113095, 42.370218],
    [-71.115476, 42.372085],
    [-71.117585, 42.373016],
    [-71.118625, 42.374863],
];
let counter = 0;

function move() {
    setTimeout(() => {
        if (counter >= busStops.length) return;
        marker.setLngLat(busStops[counter]);
        counter++;
        move();
    }, 1000);
}