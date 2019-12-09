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
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

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
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(
            'GET',
            'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json'
        );
        xhr.send();
        xhr.addEventListener('load', () => {
            if (xhr.status >= 400) {
                reject('Error');
            } else {
                let result = JSON.parse(xhr.responseText);

                resolve(result.sort((a, b) => a.name.localeCompare(b.name)));
            }
        });
    });
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
var towns = [];

function isMatching(full, chunk) {
    const myRe = new RegExp(chunk, 'i');
    const myBoolean = myRe.test(full);

    return myBoolean;
}

function addTowns(array) {
    const fragment = document.createDocumentFragment();

    for (const town of array) {
        if (
            isMatching(town.name, filterInput.value) &&
			filterInput.value.length > 0
        ) {
            const block = document.createElement('div');

            block.innerText = town.name;
            fragment.appendChild(block);
        }
    }

    filterResult.prepend(fragment);
}

function reload() {
    loadTowns().then(result => {
        towns = result;

        loadingBlock.style.display = 'none';
        filterBlock.style.display = 'block';
    });
}

reload();

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

filterInput.addEventListener('keyup', function() {
    filterResult.innerHTML = '';
    addTowns(towns);
    // это обработчик нажатия кливиш в текстовом поле
});

export { loadTowns, isMatching };
