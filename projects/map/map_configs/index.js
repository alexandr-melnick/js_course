export const balloonConfig = {balloonMaxWidth: 310,};

export const clustererConfig = {
    "preset": "islands#yellowClusterIcons",
    "groupByCoordinates": true,
    "clusterDisableClickZoom": true,
    "hasBalloon": false,
};

export const mapConfig = {
    center: [45.05812863, 38.98256216],
    zoom: 14,
    controls: [
        'geolocationControl',
        'searchControl',
        'trafficControl',
        'zoomControl',
        'typeSelector',
        'fullscreenControl',
    ],
    behaviors: ['drag', 'scrollZoom'],
};
