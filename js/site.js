const habitArray = [
  {
    name: "practicing calisthenics",
    category: "exercise",
  },
  {
    name: "playing volleyball",
    category: "exercise",
  },
  {
    name: "walking the dog",
    category: "wellness",
  },
  {
    name: "doing the dishes",
    category: "chore",
  },
  {
    name: "eating no sugar",
    category: "wellness",
  },
  {
    name: "practicing piano",
    category: "hobby",
  },
  {
    name: "sleeping eight hours",
    category: "wellness",
  },
  {
    name: "taking a cold shower",
    category: "wellness",
  },
  {
    name: "doing laundry",
    category: "chore",
  },
  {
    name: "playing disc golf",
    category: "hobby",
  },
  {
    name: "praying a rosary",
    category: "spirituality",
  },
  {
    name: "going to confession",
    category: "spirituality",
  },
];

// control function

const buildDropDown = () => {
  let dropDownMenu = document.getElementById("habitDropDown");
  dropDownMenu.innerHTML = "";

  let currentHabits = getHabitData(); // TO - DO: get these from storage

  const habitCategories = currentHabits.map((habit) => habit.category);
  const habitSet = new Set(habitCategories);

  let distinctHabits = [...habitSet];
  const dropDownTemplate = document.getElementById("dropDownItemTemplate");

  // copy the template
  let dropDownItemNode = document.importNode(dropDownTemplate.content, true);

  // make our changes
  let dropDownItemLink = dropDownItemNode.querySelector("a");
  dropDownItemLink.innerHTML = "all habits";
  dropDownItemLink.setAttribute("data-string", "All");

  // add our copy to the page
  dropDownMenu.appendChild(dropDownItemNode);

  for (let i = 0; i < distinctHabits.length; i++) {
    // get habit name
    let habitCategory = distinctHabits[i];

    // generate dropdown menu
    let itemNode = document.importNode(dropDownTemplate.content, true);
    let anchorTag = itemNode.querySelector("a");
    anchorTag.innerHTML = habitCategory;
    anchorTag.setAttribute("data-string", habitCategory);
    // append it to the dropdown menu
    dropDownMenu.appendChild(itemNode);
  }

  displayHabitData(currentHabits);
};

const displayHabitData = (currentHabits) => {
  const habitTable = document.getElementById("habitList");
  const template = document.getElementById("habitTemplate");

  habitTable.innerHTML = "";

  for (let i = 0; i < currentHabits.length; i++) {
    let habit = currentHabits[i];
    let tableRow = document.importNode(template.content, true);
    tableRow.querySelector('[data-id="name"]').textContent = habit.name;
    tableRow.querySelector('[data-id="category"]').textContent = habit.category;

    tableRow.querySelector("tr").setAttribute("data-event", habit.id); // least well understood line
    habitTable.appendChild(tableRow);
  }
};

const getHabitData = () => {
  let data = localStorage.getItem("bitByHabitData");

  if (data == null) {
    let identifiedHabits = habitArray.map((habit) => {
      habit.id = generateId();
      return habit;
    });
    localStorage.setItem("bitByHabitData", JSON.stringify(identifiedHabits));
    data = localStorage.getItem("bitByHabitData");
  }

  let currentHabits = JSON.parse(data);

  if (currentHabits.some((habit) => habit.id == undefined)) {
    currentHabits.forEach((habit) => (habit.id = generateId()));
    localStorage.setItem("bitByHabitData", JSON.stringify(currentHabits));
  }

  return currentHabits;
};

const viewFilteredHabits = (dropDownItem) => {
  let habitCategory = dropDownItem.getAttribute("data-string");

  // get all habits
  let allHabits = getHabitData();

  if (habitCategory == "All") {
    displayHabitData(allHabits);
    document.getElementById("category").innerText = habitCategory;

    return;
  }

  // filter to just selected habit
  let filteredHabits = allHabits.filter(
    (habit) => habit.category.toLowerCase() == habitCategory.toLowerCase()
  );

  // display only those habits in the table
  displayHabitData(filteredHabits);
};

const saveNewHabit = () => {
  // get the form input values
  let name = document.getElementById("habitName").value;
  let category = document.getElementById("category").value;

  // create a new habit object
  const newHabit = {
    name: name,
    category: category,
    id: generateId(),
  };
  // add it to the array of current habits
  let habits = getHabitData();
  habits.push(newHabit);

  // then, save the array with the new habit (local storage)
  localStorage.setItem("bitByHabitData", JSON.stringify(habits));

  buildDropDown();

  // document.getElementById("newHabitForm").reset();
};

const checkHabit = (habit) => {
  if (habit.classList.contains("bi-circle")) {
    habit.classList.remove("bi-circle");
    habit.classList.add("bi-circle-fill");
  } else {
    habit.classList.remove("bi-circle-fill");
    habit.classList.add("bi-circle");
  }
};

const editHabit = (habitName) => {
  let habitId = habitName.getAttribute("data-event");
  console.log(habitId);
  let currentHabits = getHabitData();
  console.log(currentHabits);
  let habitToEdit = currentHabits.find((habit) => habit.id == habitId);
  console.log(habitToEdit);
  document.getElementById("editHabitId").value = habitToEdit.id;
  document.getElementById("editHabitName").value = habitToEdit.habit;
  document.getElementById("editCategory").value = habitToEdit.category;
};

const deleteHabit = () => {
  let habitId = document.getElementById("editHabitId").value;

  // get habits in local storage as array
  let currentHabits = getHabitData();
  // filter out habits with that habitId
  let filteredHabits = currentHabits.filter((habit) => habit.id != habitId);
  // save that array to local storage
  localStorage.setItem("bitByHabitData", JSON.stringify(filteredHabits));

  buildDropDown();
};

const generateId = (dropDownItem) => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

// function displayMessage() {
//   let msg = document.getElementById("message").value;
//   // alert(msg);

//   Swal.fire({
//     backdrop: false,
//     title: "BIT by HABIT",
//     text: msg,
//   });
// }
