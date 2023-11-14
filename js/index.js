const repositories = document.querySelector('.repositories-list');
const searchUl = document.querySelector('.search__results');
const searchField = document.querySelector('.search__input');
let searchResults;

const debounce = (fn, debounceTime) => {
  let timeout;

  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };

    clearTimeout(timeout);

    timeout = setTimeout(fnCall, debounceTime);
  };
};

searchField.onkeyup = debounce(function (elem) {
  let searchValue = elem.target.value;
  if (elem.target.value === '') {
    searchUl.innerHTML = '';
  } else {
    fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response)
        searchResults = response.items;
        searchUl.innerHTML = '';
        response.items.forEach((elem, index) => {
          const searchLi = document.createElement('li');
          const searchLiBtn = document.createElement('button');
          searchLi.classList.add('repositories-list');
          searchLiBtn.classList.add('repositories-list__add-btn');
          searchLiBtn.innerHTML = elem.name;
          searchLiBtn.id = index;
          searchLiBtn.addEventListener('click', addRepository);
          searchUl.append(searchLi);
          searchLi.append(searchLiBtn);
        });
      });
  }
}, 400);

function addRepository(element) {
  const elem = searchResults[element.target.id];
  searchField.value = '';
  searchUl.innerHTML = '';
  repositories.insertAdjacentHTML(
    'afterbegin',
    `<li class="repositories-list__item">
      <div class="repositories-list__about">
        <ul class="repositories-list__left">
          <li class="repositories-list__name">Name: <span>${elem.name}</span></li>
          <li class="repositories-list__owner">Owner: <span>${elem.owner.login}</span></li>
          <li class="repositories-list__stars">Stars: <span>${elem.stargazers_count}</span></li>
        </ul>
      </div>
      <div class="repositories-list__right">
        <button class="delete-btn"><img src="icons/delete.svg" alt="Кнопка удаления репозитория"></button>
      </div>
    </li>`
  );
}

repositories.addEventListener('click', function (elem) {
  if (elem.target.tagName === 'IMG') {
    elem.target.closest('li').remove();
  }
});