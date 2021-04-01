import './index.html';
import './main.css';

const date = new Date();
const dateNow = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
const storage = localStorage;
const coords = [];
const reviews = storage.data ? [JSON.parse(storage.data)] : [];
// console.log(reviews);

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
    const collection = new ymaps.GeoObjectCollection(null, {
        preset: 'islands#yellowIcon'
    });
    coords.forEach((item) => {
        addCollection(item.coord);
    })

    const balloonContent = [
        '<h2>Отзыв:</h2>',
        '<input type="text" class="name input" placeholder="Укажите ваше имя">',
        '<input type="text" class="place input" placeholder="Укажите место">',
        '<textarea class="textarea input" placeholder="Оставить отзыв"></textarea>',
        '<button class="save-btn">Добавить</button>',
        '<button class="del" style="margin-left: 10px">очитстить память</button>',
    ];

    console.log('localStorage', storage.data);
    myMap.events.add('click', (e) => {
        const coord = e.get('coords');
        coords.push(coord);
        myMap.balloon.open(coord, balloonContent.join(''));

        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('save-btn')) {
                const comment = e.target.previousSibling.value;
                const place = e.target.previousSibling.previousSibling.value;
                const name = e.target.previousSibling.previousSibling.previousSibling.value;
                const geocoder = await ymaps.geocode(coord);
                const address = geocoder.geoObjects.get(0).properties.getAll().text;
                if (comment !== '' && place !== '' && name !== '') {
                    reviews.push({
                        name,
                        place,
                        comment,
                        coord,
                        address,
                    });
                    console.log(reviews[0])
                    storage.data = JSON.stringify(reviews);
                    addCollection(coord);
                    myMap.geoObjects.add(collection);
                    myMap.balloon.close();
                }
            }
            if (e.target.classList.contains('del')) {
                storage.clear();
                console.log('del', storage.data);
            }
        })
    })
    myMap.geoObjects.add(collection);

    function addCollection(a) {
        reviews.forEach((item) => {
            let commetnLayout = ['<div class="reviews">',
                `<span class="reviews__name">${item.name}</span>`,
                `<span class="reviews__place">${item.place}, ${dateNow}</span>`,
                `<div class="reviews__text">${item.comment}</div>`,
                '</div>'
            ];
            let placemark = new ymaps.Placemark(a, {
                balloonContentHeader: commetnLayout.join(''),
                balloonContentBody: balloonContent.join(''),
                hintContent: `${item.address}`,
            });
            collection.add(placemark);
        });
    }
}
ymaps.ready(init);
