let listsContainer = document.querySelector("[data-lists]");
let listForm = document.querySelector("[data-new-list-form]");
let listInput = document.querySelector("[data-new-list-input]");
let deleteListBtn = document.querySelector("[data-delete-list]");
let listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
let listTitleElement = document.querySelector("[data-list-title]");
let listCountElement = document.querySelector("[data-list-count]");
let tasksContainer = document.querySelector("[data-tasks]");
let taskTemplate = document.getElementById("task-template");
let tasksWholeWrapper = document.querySelector(".tasks-whole-wrapper");
let newTaskForm = document.querySelector("[data-new-task-form]");
let newTaskInput = document.querySelector("[data-new-task-input]");
let clearCompleted = document.querySelector("[data-clear-complete-task]");

const LOCAL_STORAGE_LIST_KEY = "tasks.list";
const LOCAL_STORAGE_SELECTED_LIST_ID = "tasks.selectedListId";

let lists =
  JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID);

listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    selectedListId = e.target.dataset.listId;
    saveRender();
  }
});

listForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = listInput.value;
  if (listName === null || listName.trim() === "") return;
  const list = createList(listName);
  lists.push(list);
  saveRender();
  listInput.value = null;
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName === null || taskName.trim() === "") return;
  const task = createTask(taskName);
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  newTaskInput.value = null;
  saveRender();
});

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

clearCompleted.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveRender();
});

deleteListBtn.addEventListener("click", () => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveRender();
});

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

function save() {
  window.localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  window.localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID, selectedListId);
}

function saveRender() {
  save();
  render();
}

function render() {
  clearElement(listsContainer);
  renderLists();
  const selectedList = lists.find((list) => list.id === selectedListId);
  if (selectedListId === null || !selectedList) {
    tasksWholeWrapper.style.display = "none";
  } else {
    tasksWholeWrapper.style.display = "";
    listTitleElement.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  let incompletedCount = selectedList.tasks.filter((task) => !task.complete)
    .length;
  let taskCountString = incompletedCount === 1 ? "task" : "tasks";
  listCountElement.innerText = `${incompletedCount} ${taskCountString} remaining`;
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.classList.add("list-name");
    listElement.dataset.listId = list.id;
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }
    listsContainer.appendChild(listElement);
  });
}

const clearElement = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

render();
