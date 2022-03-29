window.onload = function () {
  const date = new Date();
  const dateBox = document.getElementById("dateContainer");

  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }

  dateBox.innerHTML = `Date: ${day}/${month}/${year}`;

  // select the formTodo
  const todoForm = document.getElementById("formTodo");
  // select the input box
  const todoInput = document.getElementById("todoInput");
  // select the <div> with class="list"
  const todoItemsList = document.getElementById("listID");

  // array which stores every todos
  let todos = [];

  // add an eventListener on form, and listen for submit event
  todoForm.addEventListener("submit", function (event) {
    // prevent the page from reloading when submitting the form
    event.preventDefault();
    addTodo(todoInput.value); // call addTodo function with input box current value
  });

  // function to add todo
  function addTodo(item) {
    // if item is not empty
    if (item !== "") {
      // make a todo object, which has id, name
      const todo = {
        id: Date.now(), //creats an ID so we can delete if we want
        name: item,
      };

      // add it to todos array
      todos.push(todo);
      addToLocalStorage(todos); // store it in localStorage

      // clear the input box value
      todoInput.value = "";
    }
  }

  // function to render given todos to screen
  function renderTodos(todos) {
    // clear everything inside <ul>
    todoItemsList.innerHTML = "";

    // run through each item inside todos
    todos.forEach(function (item) {
      // check if the item is completed
      const checked = item.completed ? "checked" : null;

      const li = document.createElement("li");
      // <li class="item"> </li>
      li.setAttribute("class", "item");
      // <li class="item" data-key="20200708"> </li>
      li.setAttribute("data-key", item.id);
      /* <li class="item" data-key="20200708"> 
          <input type="checkbox" class="checkbox">
          Go to Gym
          <button class="delete-button">X</button>
        </li> */
      // if item is completed, then add a class to <li> called 'checked', which will add line-through style
      if (item.completed === true) {
        li.classList.add("checked");
      }

      li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      ${item.name}
      <button class="delete-button"></button>
    `;

      // finally add the <li> to the <ul>
      todoItemsList.append(li);
    });
  }

  // function to add todos to local storage
  function addToLocalStorage(todos) {
    // conver the array to string then store it.
    localStorage.setItem("todos", JSON.stringify(todos));
    // render them to screen
    renderTodos(todos);
  }

  // function helps to get everything from local storage
  function getFromLocalStorage() {
    const reference = localStorage.getItem("todos");
    // if reference exists
    if (reference) {
      // converts back to array and store it in todos array
      todos = JSON.parse(reference);
      renderTodos(todos);
    }
  }

  // toggle the value to completed and not completed
  function toggle(id) {
    todos.forEach(function (item) {
      if (item.id == id) {
        // toggle the value
        item.completed = !item.completed;
      }
    });

    addToLocalStorage(todos);
  }

  // delete a todo from todos array, then updates localstorage and renders updated list to screen
  function deleteTodo(id) {
    // filters out the <li> with the id and updates the todos array
    todos = todos.filter(function (item) {
      return item.id != id;
    });

    // update the localStorage
    addToLocalStorage(todos);
  }

  // initially get everything from localStorage
  getFromLocalStorage();

  // after that addEventListener <ul> with class=todoItems. Because we need to listen for click event in all delete-button and checkbox
  todoItemsList.addEventListener("click", function (event) {
    // check if the event is on checkbox
    if (event.target.type === "checkbox") {
      // toggle the state
      toggle(event.target.parentElement.getAttribute("data-key"));
    }

    // check if that is a delete-button
    if (event.target.classList.contains("delete-button")) {
      // get id from data-key attribute's value of parent <li> where the delete-button is present
      deleteTodo(event.target.parentElement.getAttribute("data-key"));
    }
  });
};
