/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    const url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

    return fetch(url)
        .then(handleErrors)
        .then(response => {
            return response.json();
        })
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
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }

    return response;
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    return full.toLowerCase().includes(chunk.toLowerCase());

    // or
    // return full.toLowerCase().indexOf(chunk.toLowerCase(), 0) !== -1;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');
/* Кнопка 'Повторить' */
const reloadButton = document.createElement('button');

reloadButton.style.display = 'none';
reloadButton.textContent = 'Повторить';
reloadButton.addEventListener('click', () => {
    getTowns();
});

homeworkContainer.appendChild(reloadButton);

let cities = null;

getTowns();

function getTowns() {
    return loadTowns()
        .then(
            response => {
                cities = response;
                loadingBlock.style.display = 'none';
                filterBlock.style.display = 'block';
            }
        )
        .catch(() => {
            loadingBlock.style.display = 'block';
            loadingBlock.textContent = 'Не удалось загрузить города';
            reloadButton.style.display = 'block';
        });
}

filterInput.addEventListener('keyup', () => {
    [...filterResult.children].forEach(child => {
        child.remove();
    });

    if (filterInput.value) {
        cities.forEach(city => {
            if (isMatching(city.name, filterInput.value)) {
                const div = document.createElement('div');

                div.textContent = city.name;
                filterResult.appendChild(div);
            }
        });
    }
});

export {
    loadTowns,
    isMatching
};
