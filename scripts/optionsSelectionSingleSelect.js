export function renderOptionSelection() {
  const selector = document.querySelector('.option-selection');
  selector.innerHTML = `
  <form name="category-selector" class="category-selector">
    <select name="category" class="hangman-selector" id="category-selector">
      <option value="">Category</option>
      <option value="animals">Animals</option>
      <option value="countries">Countries</option>
    </select>

    <select name="group" class="hangman-selector" id="group-selector" disabled="disabled">
      <option value="">All</option>
    </select>
  </form>
  `;

  let form = document.forms['category-selector'];
  let categoryDropdown = form.category;
  let groupDropdown = form.group;
  let groups;
  let keyName;
  console.log(categoryDropdown, groupDropdown);
  categoryDropdown.addEventListener("change", getGroup);

  function getGroup() {
    let category = categoryDropdown.value;
    if (category.trim() === '') {
      groupDropdown.disabled = true;
      groupDropdown.selectedIndex = 0;
      return;
    };
    
    if (category === 'animals') {
      keyName = 'category';
    } else if (category === 'countries') {
      keyName = 'continent';
    };

    async function getGroupNames() {
      try {
        const myRequest = new Request(`/scripts/data/${category}.json`);
        const response = await fetch(myRequest);
        const data = await response.json();
        groups = [...new Set(data
          .map(object => object[keyName]))]
          .sort();
        return groups;
      } catch (error) {
        console.error(error);
      };
    };

    getGroupNames().then(promise => {
      groups = promise;
      assignGroups(groups);
    });

    function assignGroups(groups) {
      let groupDropdownHTML = `<option value="">All</option>`;
      for (let group of groups) {
        groupDropdownHTML += `
        <option value="${group}">${group}</option>
        `;
      };
      groupDropdown.innerHTML = groupDropdownHTML;
      groupDropdown.disabled = false;
    };
    
    // const myRequest = new Request(`/scripts/data/${category}.json`);
    // fetch(myRequest)
    //   .then(response => response.json())
    //   .then(data => {
    //     groups = [...new Set(data
    //       .map(object => object[keyName]))]
    //       .sort();

    //     console.log(groups);
    //   })
    //   .catch(console.error);
  };
};