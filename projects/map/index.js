import './index.html';
import './main.css';
import template from './templates/popup.hbs';
import {
    mapConfig,
    clustererConfig,
    balloonConfig,
} from './map_configs/';

function init() {
    const date = new Date();
    const dateNow = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    const reviews = localStorage.data ? JSON.parse(localStorage.data) : [];

    function formDataToJson(form) {
        const formData = new FormData(form);
        return Array.from(formData.entries()).reduce((memo, pair) => ({
            ...memo,
            [pair[0]]: pair[1],
        }), {});
    }

    const filterReviews = (coords) => reviews.filter((review) => review.coords === coords);

    let myMap = new ymaps.Map('map', mapConfig, balloonConfig);

    const clusterer = new ymaps.Clusterer(clustererConfig);
    myMap.geoObjects.add(clusterer);

    reviews.forEach(({
        address,
        coords
    }) => {
        const placemark = new ymaps.Placemark(JSON.parse(coords), {
            balloonContent: template({
                address,
                coords,
                dateNow,
                items: filterReviews(coords)
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
            const items = filterReviews(strCoords);
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
            localStorage.data = JSON.stringify(reviews);

            const placemark = new ymaps.Placemark(JSON.parse(data.coords), {
                balloonContent: template({
                    address: data.address,
                    coords: data.coords,
                    items: filterReviews(data.coords)
                })
            })
            clusterer.add(placemark);
            myMap.balloon.close()
        }
    })
}
ymaps.ready(init);
