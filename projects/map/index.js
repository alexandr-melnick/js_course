import './index.html';
import './main.css';
import template from './templates/popup.hbs';


const date = new Date();
const dateNow = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
const storage = localStorage;
const reviews = storage.data ? JSON.parse(storage.data) : [];

function formDataToJson(form) {
    console.log(form);
    const formData = new FormData(form);
    return Array.from(formData.entries()).reduce((memo, pair) => ({
        ...memo,
        [pair[0]]: pair[1],
    }), {});
}

function init() {
    let myMap = new ymaps.Map(
        'map', {
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
        }, {
            balloonMaxWidth: 310,
        }
    );

    const clusterer = new ymaps.Clusterer({
        "preset": "islands#yellowClusterIcons",
        "groupByCoordinates": true,
        "clusterDisableClickZoom": true,
        "hasBalloon": false,
    });

    myMap.geoObjects.add(clusterer);

    reviews.forEach((review) => {
        const placemark = new ymaps.Placemark(JSON.parse(review.coords), {
            balloonContent: template({
                address: review.address,
                coords: review.coords,
                dateNow,
                items: reviews.filter((reviewItem) => reviewItem.coords === review.coords)
            })
        })
        clusterer.add(placemark);
    })

    myMap.events.add('click', async (e) => {
        const coord = e.get('coords');
        const geocoder = await ymaps.geocode(coord);
        const address = geocoder.geoObjects.get(0).properties.getAll().text;
        myMap.balloon.open(coord, template({
            dateNow,
            address,
            coords: JSON.stringify(coord)
        }));
    });

    clusterer.events.add('click', (e) => {
        const coords = e.get('target').geometry.getCoordinates();
        const strCoords = JSON.stringify(coords);
        if (e.get('target').options.getName() === 'cluster') {
            const items = reviews.filter((reviewItem) => reviewItem.coords === strCoords);
            myMap.balloon.open(coords, template({
                coords: strCoords,
                address: items[0].address,
                dateNow,
                items,
            }));
        }
    })

    document.addEventListener('submit', (e) => {
        e.preventDefault();
        if (e.target.dataset.role === "added") {
            const data = formDataToJson(e.target);
            reviews.push(data);
            storage.data = JSON.stringify(reviews);

            const placemark = new ymaps.Placemark(JSON.parse(data.coords), {
                balloonContent: template({
                    address: data.address,
                    coords: data.coords,
                    items: reviews.filter((review) => review.coords === data.coords)
                })
            })

            clusterer.add(placemark);
            myMap.balloon.close()
        }
    })

}


ymaps.ready(init);
