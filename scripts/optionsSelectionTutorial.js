export function renderOptionSelection() {
  const selector = document.querySelector('.option-selection');
  selector.innerHTML = `
  <form name="category-selector" class="category-selector">
    <select name="category" class="hangman-selector" id="category-selector">
      <option value="">Category</option>
    </select>

    <select name="group" class="hangman-selector" id="group-selector" disabled="disabled">
      <option value="">All</option>
    </select>
  </form>
  `;

  let form = document.forms['category-selector'];
  let categoryDropdown = form.category;
  console.log(categoryDropdown);
  let groupDropdown = form.group;
  let jsonData;
  const myRequest = new Request('/scripts/test.json');
  
  fetch(myRequest)
    .then(response => response.json())
    .then(data => {
      jsonData = data;
      getCategory(jsonData);
    }).
    catch(console.error);


  function getCategory(jsonData) {
    for (let category in jsonData) {
      categoryDropdown.insertAdjacentHTML("beforeend", `
      <option value="${category}">${category}</option>
      `);
    };
  };

  categoryDropdown.addEventListener("change", getGroup);
  function getGroup() {
    let category = categoryDropdown.value;
    if (category.trim() === '') {
      groupDropdown.disabled = true;
      groupDropdown.selectedIndex = 0;
      return false;
    };

    let groups = jsonData[category];
    let groupDropdownHTML = `<option value="">All</option>`;
    for (let group of groups) {
      groupDropdownHTML += `
      <option value="${group}">${group}</option>
      `;
    };
    groupDropdown.innerHTML = groupDropdownHTML;
    groupDropdown.disabled = false
  }
};