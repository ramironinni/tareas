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
    -- [] Show overdue
    -- [] Show deleted
    [] Search
    -- [] Dates
    -- [] Keywords or text
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

const helpFileAbsolutePath = path.join(__dirname, "./help.json");
const helpJSON = fs.readFileSync(helpFileAbsolutePath, { encoding: "utf-8" });
const helpText = JSON.parse(helpJSON);


// Ayuda
function help(){
    const text = helpText.join("\n");
    console.log(text);
}

// Guardar cambios en el JSON
function save(tasks) {
  const tasksJSON = JSON.stringify(tasks, null, 2);
  fs.writeFileSync(tasksFileAbsolutePath, tasksJSON);
}

// Constructor de tareas
function Task(name, deadline) {
  this.name = name;
  this.deadline = deadline;
  this.done = false;
}

// Agregar nueva tarea
function add(name, deadline) {
  const newTask = new Task(name, deadline);
  if (name != undefined && deadline != undefined) {
    tasks.push(newTask);
    showAll();
    save(tasks);
  } else {
    console.log("<name> <deadline> required");
  }
}

// Borrar todas las tareas
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

// Guardar las tareas borradas en el backup
function saveBackup(deletedTasks) {
  const backupJSON = JSON.stringify(deletedTasks, null, 2);
  fs.writeFileSync(backupFileAbsolutePath, backupJSON);
}

// Borrar las tareas hechas
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

// Restaurar las tareas desde el backup
function restore() {
  const tasksJSON = backupJSON;
  fs.writeFileSync(tasksFileAbsolutePath, tasksJSON);
  console.log("Las tareas han sido restauradas");
}


// Cambiar de estatus a la tarea según su índice
function toggle(taskIndex) {
  if (taskIndex != undefined) {
    const task = tasks[taskIndex];
    task.done = !task.done;
    showAll();
    save(tasks);
  } else {
    console.log("<index> required") 
  }  
}

// Marcar todas las tareas como hechas
function markAllDone() {
  tasks.map(function (task) {
    return task.done = true;
  });
  showAll();
  save(tasks);
}

// Marcar todas las tareas como no hechas
function markAllNotDone() {
  tasks.map(function (task) {
    return task.done = false;
  });
  showAll();
  save(tasks);
}



// Mostrar todas las tareas
function showAll() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const doneText = task.done ? "☑" : "☐";
    console.log(`- ${doneText} ${task.name} (${task.deadline})[${i}]`);
  }
}

// Mostrar las tareas hechas
function showDone() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.done) {
      console.log(`-  ☑ ${task.name} (${task.deadline})`);
    }
  }
}

// Mostrar las tareas pendientes
function showPending() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (!task.done) {
      console.log(`-  ☐ ${task.name} (${task.deadline})`);
    }
  }
}

// Mostrar las tareas con el deadline vencido
function showOverdue(){
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const fechaActual = new Date();
    const deadline = new Date(Date.parse(task.deadline));
    if (deadline < fechaActual && !task.done) {
      console.log(`-Tarea vencida ❌ ${task.name} (${task.deadline})`);
    }
  }
}

//Mostrar las tareas borradas que están en el backup
function showDeleted() {
  for (let i = 0; i < backup.length; i++) {
    const task = backup[i];
    const doneText = task.done ? "☑" : "☐";
    console.log(`- ${doneText} ${task.name} (${task.deadline})[${i}]`);
  }
}

// Buscar las tareas por índice
function searchIndex(index) {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (i == index) {
      const doneText = task.done ? "☑" : "☐";
      console.log(`- ${doneText} ${task.name} (${task.deadline})[${i}]`);
    }
  }
}


// Buscar las tareas por fecha
function searchDate(date){
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.deadline == date) {
      const doneText = task.done ? "☑" : "☐";
      console.log(`- ${doneText} ${task.name} (${task.deadline})[${i}]`);
    }
  }
}

// Buscar tareas por texto
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
// Terminal    +
//++++++++++++++


const argumentsArray = process.argv; //arguments vector
const thirdParameter = argumentsArray[2];
const fourthParameter = argumentsArray[3];
const fifthParameter = argumentsArray[4];

switch (thirdParameter) {  
  case "help":
    help();
    break;
  case "add":
    add(fourthParameter, fifthParameter);
    break;
  case "deleteall":
    deleteAll();
    break;
  case "deletedone":
    deleteDone();
    break;
  case "restore":
    restore();
    break;
  case "toggle":
    toggle(fourthParameter);
    break;  
  case "markalldone":
    markAllDone();
    break;
  case "markallnotdone":
    markAllNotDone();
    break;
  case "showall":
    showAll();
    break;
  case "showdone":
    showDone();
    break;
  case "showpending":
    showPending();
    break;
  case "showoverdue":
    showOverdue();
    break;
  case "showdeleted":
    showDeleted();
    break;
  case "searchindex":
    searchIndex(fourthParameter);
    break;  
  case "searchdate":
    searchDate(fourthParameter);
    break;
  case "searchtext":
    searchText(fourthParameter);
    break;
  default:
    console.log("help -> para ayuda");
}
