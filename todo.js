// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const allCount = document.getElementById('allCount');
const completedCount = document.getElementById('completedCount');
const uncompletedCount = document.getElementById('uncompletedCount');

const showAll = document.getElementById('showAll');
const showCompleted = document.getElementById('showCompleted');
const showUncompleted = document.getElementById('showUncompleted');

// Task data
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Update localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update counts
function updateCounts() {
  allCount.textContent = tasks.length;
  completedCount.textContent = tasks.filter(task => task.completed).length;
  uncompletedCount.textContent = tasks.filter(task => !task.completed).length;
}

// Render tasks
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'uncompleted') return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center bg-gray-600 p-2 rounded';

    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    taskText.className = task.completed ? 'line-through text-gray-400' : '';

    const controls = document.createElement('div');
    controls.className = 'flex space-x-2';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      task.completed = !task.completed;
      saveTasksToLocalStorage();
      updateCounts();
      renderTasks(filter);
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'bg-yellow-500 text-white px-2 rounded';
    editButton.addEventListener('click', () => {
      const newText = prompt('Edit task:', task.text);
      if (newText) {
        task.text = newText;
        saveTasksToLocalStorage();
        renderTasks(filter);
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'bg-red-500 text-white px-2 rounded';
    deleteButton.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasksToLocalStorage();
      updateCounts();
      renderTasks(filter);
    });

    controls.appendChild(checkbox);
    controls.appendChild(editButton);
    controls.appendChild(deleteButton);

    li.appendChild(taskText);
    li.appendChild(controls);
    taskList.appendChild(li);
  });

  updateCounts();
}

// Add new task
addTaskButton.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    tasks.push({ text: taskText, completed: false });
    saveTasksToLocalStorage();
    taskInput.value = '';
    renderTasks();
  }
});

// Filter buttons
showAll.addEventListener('click', () => renderTasks('all'));
showCompleted.addEventListener('click', () => renderTasks('completed'));
showUncompleted.addEventListener('click', () => renderTasks('uncompleted'));

// Initialize
renderTasks();
