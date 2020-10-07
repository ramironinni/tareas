/*
TODO APP
    [] Add
    [] Delete
    -- [] Delete all
    -- [] Delete only done tasks
    [] Restore from backup

    [] Edit
    -- [] Toggle index
    -- [] Status
        -- [] All done
        -- [] All not done
    -- [x] Edit content
    -- [x] Edit deadline
    [] Show
    -- [] Show all
    -- [] Show done
    -- [] Show pending
    -- [] Show index
    -- [] Show deleted
    [] Search
    -- [] Dates
    -- [x] Keywords or text
    [x] Sort
    -- [x] by date
*/





const fs = require("fs");
const path = require("path");

const tasksFileAbsolutePath = path.join(__dirname, "./db/tasks.json");
const tasksJSON = fs.readFileSync(tasksFileAbsolutePath, { encoding: "utf-8" });
const tasks = JSON.parse(tasksJSON);

const backupFileAbsolutePath = path.join(__dirname, "./db/backup.json");
const backupJSON = fs.readFileSync(backupFileAbsolutePath, { encoding: "utf-8" });
const backup = JSON.parse(backupJSON);


function Task(name, deadline) {
  this.name = name;
  this.deadline = deadline;
}

function add(name, deadline) {
  const newTask = new Task(name, deadline);
  tasks.push(newTask);
  showAll();
  save(tasks);
}

function deleteAll() {
  const tasksLength = tasks.length;
  const deletedTasks = [];
  for (i = 0; i < tasksLength; i++) {
    const deletedTask = tasks.shift();
    deletedTasks.push(deletedTask);
  }
  saveBackup(deletedTasks);
  save(tasks);
  console.log("Todas las tareas han sido borradas. Consulte el backup.");
}

function saveBackup(deletedTasks) {
  const backupJSON = JSON.stringify(deletedTasks, null, 2);
  fs.writeFileSync(backupFileAbsolutePath, backupJSON);
}

function restore() {
  const tasksJSON = backupJSON;
  fs.writeFileSync(tasksFileAbsolutePath, tasksJSON);
  console.log("Las tareas han sido restauradas");
}


function deleteDone() {
  let tasksNotDone = [];
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    if (!task.done) {
      tasksNotDone.push(task);
    }    
  }
  console.log(tasksNotDone);
  save(tasksNotDone);
  showAll();
}

function showAll() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const doneText = task.done ? "☑" : "☐";
    console.log(`- ${doneText} ${task.name} (${task.deadline})[${i}]`);
  }
}

function showDone() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.done) {
      console.log(`-  ☑ ${task.name} (${task.deadline})`);
    }
  }
}

function showPending() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (!task.done) {
      console.log(`-  ☐ ${task.name} (${task.deadline})`);
    }
  }
}

function showIndex(index) {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (i == index) {
      const doneText = task.done ? "☑" : "☐";
      console.log(`- ${doneText} ${task.name} (${task.deadline})[${i}]`);
    }
  }
}

function showDeleted() {
  for (let i = 0; i < backup.length; i++) {
    const task = backup[i];
    const doneText = task.done ? "☑" : "☐";
    console.log(`- ${doneText} ${task.name} (${task.deadline})[${i}]`);
  }
}

function toggle(taskIndex) {
  const task = tasks[taskIndex];
  task.done = !task.done;
  showAll();
  save(tasks);
}


function markAllDone() {
  tasks.map(function (task) {
    return task.done = true;
  });
  showAll();
  save(tasks);
}

function markAllNotDone() {
  tasks.map(function (task) {
    return task.done = false;
  });
  showAll();
  save(tasks);
}

function save(tasks) {
  const tasksJSON = JSON.stringify(tasks, null, 2);
  fs.writeFileSync(tasksFileAbsolutePath, tasksJSON);
}

function searchDate(date){
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.deadline == date) {
      const doneText = task.done ? "☑" : "☐";
      console.log(`- ${doneText} ${task.name} (${task.deadline})[${i}]`);
    }
  }
}

function searchText(text){
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.name.indexOf(text) >= 0) {
      const doneText = task.done ? "☑" : "☐";
      console.log(`- ${doneText} ${task.name} (${task.deadline})[${i}]`);
    }
  }
}

//++++++++++++++
// terminal    +
//++++++++++++++


const argumentsArray = process.argv; //arguments vector
const thirdParameter = argumentsArray[2];
const fourthParameter = argumentsArray[3];
const fifthParameter = argumentsArray[4];

switch (thirdParameter) {
  case "all":
    showAll();
    break;
  case "done":
    showDone();
    break;
  case "pending":
    showPending();
    break;
  case "showdeleted":
    showDeleted();
    break;
  case "showindex":
    showIndex(fourthParameter);
    break;
  case "toggle":
    toggle(fourthParameter);
    break;
  case "add":
    add(fourthParameter, fifthParameter);
    break;
  case "markalldone":
    markAllDone();
    break;
  case "markallnotdone":
    markAllNotDone();
    break;
  case "deleteall":
    deleteAll();
    break;
  case "restore":
    restore();
    break;
  case "deletedone":
    deleteDone();
    break;
  case "searchdate":
    searchDate(fourthParameter);
    break;
  case "searchtext":
    searchText(fourthParameter);
    break;
  default:
    console.log("Los parametros aceptados son: 'all', 'done' y 'pending'");
}
