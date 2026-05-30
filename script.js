const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const filterButtons = document.querySelectorAll('.filter-button');
const themeToggle = document.getElementById('theme-toggle');

const tasks = [];
let currentFilter = 'all';

function updateCounters() {
    totalCount.textContent = tasks.length;
    completedCount.textContent = tasks.filter(task => task.completed).length;
}

function getFilteredTasks() {
    if (currentFilter === 'completed') {
        return tasks.filter(task => task.completed);
    }

    if (currentFilter === 'pending') {
        return tasks.filter(task => !task.completed);
    }

    return tasks;
}

function updateFilterButtons() {
    filterButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.filter === currentFilter);
    });
}

function renderTasks() {
    taskList.textContent = '';
    const visibleTasks = getFilteredTasks();

    if (visibleTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'task-item';
        emptyMessage.innerHTML = '<p class="task-text">No tasks to display.</p>';
        taskList.appendChild(emptyMessage);
        return;
    }

    visibleTasks.forEach(task => {
        taskList.appendChild(createTaskItem(task));
    });
}

function createTaskItem(task) {
    const listItem = document.createElement('li');
    listItem.className = 'task-item';
    listItem.dataset.taskId = task.id;

    const checkboxId = `task-checkbox-${task.id}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark ${task.text} as completed`);

    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        listItem.classList.toggle('completed', task.completed);
        updateCounters();
        renderTasks();
    });

    const label = document.createElement('label');
    label.htmlFor = checkboxId;

    const text = document.createElement('p');
    text.className = 'task-text';
    text.textContent = task.text;

    label.appendChild(checkbox);
    label.appendChild(text);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        const index = tasks.findIndex(item => item.id === task.id);
        if (index !== -1) {
            tasks.splice(index, 1);
            updateCounters();
            renderTasks();
            taskInput.focus();
        }
    });

    listItem.appendChild(label);
    listItem.appendChild(deleteButton);
    listItem.classList.toggle('completed', task.completed);

    return listItem;
}

function addTask(text) {
    const trimmedText = text.trim();
    if (!trimmedText) {
        return;
    }

    const task = {
        id: Date.now().toString(),
        text: trimmedText,
        completed: false,
    };

    tasks.push(task);
    updateCounters();
    renderTasks();
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    themeToggle.setAttribute('aria-pressed', isDark.toString());
}

function loadTheme() {
    const storedTheme = localStorage.getItem('taskManagerTheme');
    applyTheme(storedTheme === 'dark' ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('taskManagerTheme', nextTheme);
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        updateFilterButtons();
        renderTasks();
    });
});

form.addEventListener('submit', event => {
    event.preventDefault();
    const value = taskInput.value.trim();
    if (!value) {
        taskInput.focus();
        return;
    }

    addTask(value);
    form.reset();
    taskInput.focus();
});

window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    updateFilterButtons();
    renderTasks();
});
