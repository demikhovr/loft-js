/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {
    const url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

    return fetch(url)
        .then(handleErrors)
        .then(response => response.json())
        .then(cities => {
            return cities.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name < b.name) {
                    return -1;
                }

                return 0;
            });
        });

    // return new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //
    //     xhr.responseType = 'json';
    //     xhr.open('GET', url);
    //
    //     xhr.addEventListener('load', () => {
    //         if (xhr.status === 200) {
    //             const sortedArr = xhr.response.sort((a, b) => {
    //                 if (a.name > b.name) {
    //                     return 1;
    //                 } else if (a.name < b.name) {
    //                     return -1;
    //                 }
    //
    //                 return 0;
    //             });
    //
    //             resolve(sortedArr);
    //         } else {
    //             reject();
    //         }
    //     });
    //
    //     xhr.addEventListener('error', () => {
    //         reject();
    //     });
    //
    //     xhr.send();
    // });
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }

    return response;
}

export {
    delayPromise,
    loadAndSortTowns
};
