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

// searchField.onkeyup = debounce(function (elem) 
searchField.addEventListener('input', debounce(function (elem) {
  let searchValue = elem.target.value;
  if (elem.target.value === '') {
    searchUl.textContent = '';
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
          searchLiBtn.textContent = elem.name;
          searchLiBtn.id = index;
          searchLiBtn.addEventListener('click', addRepository);
          searchLi.append(searchLiBtn);
          searchUl.append(searchLi); // не совсем понял момент про эти строки, поменять только их местами?
        });
      });
  }
}, 400));

function addRepository(element) {
  const elem = searchResults[element.target.id];
  searchField.value = '';
  searchUl.textContent = '';

  const repositoryItem = document.createElement('li');
  repositoryItem.classList.add('repositories-list__item');

  const aboutDiv = document.createElement('div');
  aboutDiv.classList.add('repositories-list__about');

  const leftUl = document.createElement('ul');
  leftUl.classList.add('repositories-list__left');

  const nameLi = document.createElement('li');
  nameLi.classList.add('repositories-list__name');
  nameLi.textContent = `Name: ${elem.name}`;

  const ownerLi = document.createElement('li');
  ownerLi.classList.add('repositories-list__owner');
  ownerLi.textContent = `Owner: ${elem.owner.login}`;

  const starsLi = document.createElement('li');
  starsLi.classList.add('repositories-list__stars');
  starsLi.textContent = `Stars: ${elem.stargazers_count}`;

  leftUl.appendChild(nameLi);
  leftUl.appendChild(ownerLi);
  leftUl.appendChild(starsLi);

  aboutDiv.appendChild(leftUl);

  const rightDiv = document.createElement('div');
  rightDiv.classList.add('repositories-list__right');

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-btn');

  const deleteImage = document.createElement('img');
  deleteImage.src = 'delete.svg';
  deleteImage.alt = 'Кнопка удаления репозитория';

  deleteButton.appendChild(deleteImage);
  deleteButton.addEventListener('click', function () {
    repositoryItem.remove();
  });

  rightDiv.appendChild(deleteButton);

  repositoryItem.appendChild(aboutDiv);
  repositoryItem.appendChild(rightDiv);

  repositories.insertBefore(repositoryItem, repositories.firstChild);



  // repositories.insertAdjacentHTML(
  //   'afterbegin',
  //   `<li class="repositories-list__item">
  //     <div class="repositories-list__about">
  //       <ul class="repositories-list__left">
  //         <li class="repositories-list__name">Name: <span>${elem.name}</span></li>
  //         <li class="repositories-list__owner">Owner: <span>${elem.owner.login}</span></li>
  //         <li class="repositories-list__stars">Stars: <span>${elem.stargazers_count}</span></li>
  //       </ul>
  //     </div>
  //     <div class="repositories-list__right">
  //       <button class="delete-btn"><img src="delete.svg" alt="Кнопка удаления репозитория"></button>
  //     </div>
  //   </li>`
  //);
}

repositories.addEventListener('click', function (elem) {
  if (elem.target.tagName === 'IMG') {
    elem.target.closest('li').remove();
  }
});