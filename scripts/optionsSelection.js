/**
 * Handles the display and logic of the category option selection. playGame() is executed after that.
 * @returns {Promise} - returns a promise in the form of Object in the form of: { categoryObjects: [...], groups: [...]}. categoryObjects is an array of arrays of objects.
 */
export async function renderOptionSelection() {
  let groups;
  const allCategories = {selectedCategories: ['animals', 'countries']};
  
  const categories = ['animals', 'countries'];
  const {selectedCategories} = JSON.parse(
    localStorage.getItem('selectedCategories')) 
    || allCategories;

  const selector = document.querySelector('.option-selection');
  selector.innerHTML = `
  <form name="category-selector" class="select-group-container">
    <div name="category" class="category-selector">
      <span class="category-selector__text">category</span>
      <span class="select-button__arrow-down">
          <i class="fa-solid fa-chevron-down"></i>
      </span>
    </div>

    <ul class="category-selector__dropdown"></ul>

  </form>
  `;
  
  const listItems = document.querySelector('.category-selector__dropdown');
  let listItemsHTML = '';
  categories.forEach(category => {
    let isChecked = selectedCategories.includes(category) ? 'checked' : '';
    
    listItemsHTML += `
    <li class="item ${isChecked}">
        <span class="checkbox">
            <i class="fa-solid fa-check check-icon"></i>
        </span>
        <span class="item-text" data-category="${category.toLowerCase()}">
          ${category}
        </span>
    </li>
    `;
  });

  listItems.innerHTML = listItemsHTML;
  listItems.insertAdjacentHTML("beforeend", `
  <button type="button" class="category-submit-button">Refresh</button>
  `);


  const selectButton = document.querySelector('.category-selector');
  const items = document.querySelectorAll('.item');

  selectButton.addEventListener("click", () => {
    selectButton.classList.toggle("open");
  });

  items.forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle("checked");
      loadCategoryPool();

      // let checked = document.querySelectorAll(".checked"),
      // btnText = document.querySelector(".btn-text");
      // if(checked && checked.length > 0){
      //     btnText.innerText = `${checked.length} Selected`;
      // }else{
      //     btnText.innerText = "Select Language";
      // }
    });
  });



  const form = document.forms['category-selector'];
  const submitButton = form.querySelector('.category-submit-button');
  
  /**
   * Stores all the selected categories inside localStorage. Disables the refresh button when no category is selected. Results in an array "groups", which will be handled further.
   * @returns undefined
   */
  function loadCategoryPool() {
    groups = [];
    items.forEach(item => {
      if (!item.classList.contains("checked")) {
        return;
      };
      
      let {category} = item.querySelector('.item-text').dataset;
      groups.push(category);
      
      // getCategoryJSON(category).then(promise => {
      //   groups.push(promise);
      // });
    });

    if (groups.length === 0) {
      submitButton.disabled = true;
      return;
    } else {
      submitButton.disabled = false;
    };
    
    localStorage.setItem('selectedCategories', 
      JSON.stringify({selectedCategories: groups}));
  };

  // Updates categories
  submitButton.addEventListener("click", () => {
    loadCategoryPool();
    location.reload();
  });



  /**
   * Requests and locates the correct JSON file. (This function is mapped onto every category inside function "processGroupPromises()".)
   * @param {string} category - used to locate the correct JSON file.
   * @returns {Promise} - JSON data for the given category
   */
  async function getCategoryJSON(category) {
    try {
      const myRequest = new Request(`/scripts/data/${category}.json`);
      const response = await fetch(myRequest);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    };
  };

  loadCategoryPool();

  // Alternative to below solution.
  // Promise.all(groups.map(category => getCategoryJSON(category)))
  //   .then(results => console.log(results))
  //   .catch(error => console.log(error));

  /**
   * Wrapper, which handles all the promises to get the category data for hangman.
   * @returns {Object} - Object in the form of { categoryObjects: [...], groups: [...]}. categoryObjects is an array of arrays of objects.
   */
  async function processGroupPromises() {
    try {
      const categoryObjects = await Promise.all(
        groups.map(category => getCategoryJSON(category)));
      return {categoryObjects, groups};
    } catch (error) {
      console.error(error);
    };
  };
  
  return processGroupPromises();
  
  // runPromises();
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => resolve(groups), 500);
  // });
};