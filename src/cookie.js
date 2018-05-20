/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

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
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка 'добавить cookie'
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

// Helpers
function clearDOMNode(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
    }
}

function isMatching(full, chunk) {
    return full.toLowerCase().includes(chunk.toLowerCase());
}

// Cookies
function getCookies() {
    return document.cookie.split('; ').reduce((prev, curr) => {
        const [name, value] = curr.split('=');

        prev[name] = value;

        return prev;

    }, {});
}

function setCookie(name, value, options) {
    options = options || {};

    let expires = options.expires;

    if (typeof expires === 'number' && expires) {
        const cookieDate = new Date();

        cookieDate.setTime(cookieDate.getTime() + expires * 1000);
        expires = options.expires = cookieDate;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + '=' + value;

    for (const propName in options) {
        if (options.hasOwnProperty(propName)) {
            const propValue = options[propName];

            updatedCookie += '; ' + propName;
            if (propValue !== true) {
                updatedCookie += '=' + propValue;
            }
        }
    }

    document.cookie = updatedCookie;
}
function deleteCookie(name) {
    setCookie(name, '', { expires: -1 });
}

function createTableRow(name, value) {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    const tdValue = document.createElement('td');
    const tdDelete = document.createElement('td');
    const deleteBtn = document.createElement('button');

    tdName.textContent = name;
    tdValue.textContent = value;

    deleteBtn.textContent = 'Удалить';
    deleteBtn.dataset.cookieName = name;
    deleteBtn.classList.add('delete-btn');

    tdDelete.appendChild(deleteBtn);
    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(tdDelete);

    return tr;
}

function updateTable() {
    const cookies = getCookies();
    const filterValue = filterNameInput.value;

    clearDOMNode(listTable);

    if (document.cookie.length === 0) {
        return;
    }

    const fragment = document.createDocumentFragment();

    Object.keys(cookies).forEach(cookie => {
        if (!filterValue.length || isMatching(cookie, filterValue) || isMatching(cookies[cookie], filterValue)) {
            fragment.appendChild(createTableRow(cookie, cookies[cookie]));
        }
    });

    listTable.appendChild(fragment);
}

function listTableClickHandler(evt) {
    const target = evt.target.closest('.delete-btn');

    if (target) {
        deleteCookie(target.dataset.cookieName);
        updateTable();
    }
}

function addButtonClickHandler() {
    const name = addNameInput.value;
    const value = addValueInput.value;

    if (name && value) {
        setCookie(name, value);
        updateTable();
    } else {
        alert('Введите имя и значение cookie!');
    }
}

updateTable();
addButton.addEventListener('click', addButtonClickHandler);
filterNameInput.addEventListener('keyup', updateTable);
listTable.addEventListener('click', listTableClickHandler);