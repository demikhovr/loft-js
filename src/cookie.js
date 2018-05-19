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
    return full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1;
}

// Cookies
function getCookies() {
    return document.cookie.split('; ').reduce((prev, curr) => {
        const [name, value] = curr.split('=');

        prev[name] = value;

        return prev;

    }, {});
}

function createCookie(name, value) {
    document.cookie = `${name}=${value}`;
}

function deleteCookie(name) {
    document.cookie = `${name}=''; expires=${new Date(0).toUTCString()}`;
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
    deleteBtn.addEventListener('click', deleteBtnClickHandler);

    tdDelete.appendChild(deleteBtn);
    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(tdDelete);

    listTable.appendChild(tr);
}

function updateTable() {
    const cookies = getCookies();
    const filterValue = filterNameInput.value;

    clearDOMNode(listTable);

    Object.keys(cookies).forEach(cookie => {
        if (!filterValue.length || isMatching(cookie, filterValue) || isMatching(cookies[cookie], filterValue)) {
            createTableRow(cookie, cookies[cookie]);
        }
    });
}

function deleteBtnClickHandler() {
    const currentTr = this.closest('tr');
    const currentCookie = currentTr.querySelector('td:first-child');

    currentTr.remove();
    deleteCookie(currentCookie.textContent);
}

function addButtonClickHandler() {
    const name = addNameInput.value;
    const value = addValueInput.value;

    if (name.length && value.length) {
        createCookie(name, value);
        updateTable();
    } else {
        alert('Введите имя и значение cookie!');
    }
}

updateTable();
addButton.addEventListener('click', addButtonClickHandler);
filterNameInput.addEventListener('keyup', updateTable);
