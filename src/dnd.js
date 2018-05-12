/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
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
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    const div = document.createElement('div');

    div.style.position = 'absolute';
    div.textContent = 'drag';
    div.style.userSelect = 'none';
    div.style.cursor = 'move';

    div.classList.add('draggable-div');
    div.style.backgroundColor = `#${getRandomColor()}`;
    div.style.top = `${getRandomNumber(0, 300)}px`;
    div.style.left = `${getRandomNumber(0, 300)}px`;
    div.style.width = `${getRandomNumber(50, 200)}px`;
    div.style.height = `${getRandomNumber(50, 100)}px`;

    return div;
}

function getRandomNumber(max, min, accuracy) {
    min = min || 0;
    accuracy = accuracy || 1;

    return Math.round((Math.random() * (max - min) + min) * accuracy) / accuracy;
}

function getRandomColor() {
    return ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {
    let lastCoords = {
        x: null,
        y: null
    };

    target.addEventListener('mousedown', targetMouseDownHandler);

    function targetMouseDownHandler(evt) {
        target.textContent = 'drop';
        // Чтобы выбранный элемент находился над остальными
        if (target !== target.parentNode.lastElementChild) {
            target.parentNode.appendChild(target);
        }

        lastCoords = {
            x: evt.clientX,
            y: evt.clientY
        };

        document.addEventListener('mousemove', targetMouseMoveHandler);
        document.addEventListener('mouseup', targetMouseUpHandler, { once: true });
    }

    function targetMouseMoveHandler(evt) {
        const shift = {
            x: lastCoords.x - evt.clientX,
            y: lastCoords.y - evt.clientY
        };

        target.style.top = `${target.offsetTop - shift.y}px`;
        target.style.left = `${target.offsetLeft - shift.x}px`;

        lastCoords = {
            x: evt.clientX,
            y: evt.clientY
        };
    }

    function targetMouseUpHandler() {
        target.textContent = 'drag';
        document.removeEventListener('mousemove', targetMouseMoveHandler);
        lastCoords = {
            x: null,
            y: null
        };
    }
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
