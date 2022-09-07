(function () {
    // Создание константы с ключем для локального хранилища 
    const LOCAL_STORAGE_KEY = 'todoList';

    // Создание состояния приложения
    let appData = {
        sortType: 'sort-all',
        mainInputState: '',
        todos: [
            {
                id: 0,
                complete: false,
                title: 'Танцы с бубном'
            },
            {
                id: 1,
                complete: false,
                title: 'Помыть посуду'
            },
            {
                id: 2,
                complete: false,
                title: 'Позвонить другу'
            },
        ]
    }
    
    // Создание шаблона задачи
    const todoTemplate = document.createElement('li');
    todoTemplate.classList.add('todos__list-item');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('todos__checkbox', 'visuallyhidden');
    const label = document.createElement('label');
    label.classList.add('todos__checkbox-label');
    const input = document.createElement('input');
    input.classList.add('todos__task-input');
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('todos__delete-btn');
    todoTemplate.append(checkbox, label, input, deleteBtn);

    // Создагние элемента новой задачи
    function getTodoElement (todo) {
        const todoElement = todoTemplate.cloneNode(true);
        const checkbox = todoElement.querySelector('.todos__checkbox');
        const label = todoElement.querySelector('.todos__checkbox-label');
        const input = todoElement.querySelector('.todos__task-input');
        todoElement.id = todo.id;
        checkbox.checked = todo.complete;
        checkbox.id = `checkbox${todo.id}`;
        label.setAttribute('for', `checkbox${todo.id}`);
        input.value = todo.title;

        return todoElement;
    }

    // Создание переменных с DOM элементами основных органов управления
    const sortBtnListElement = document.querySelectorAll('button.todos__sort-btn');
    const mainInputElement = document.querySelector('input.todos__main-input');
    const todoListElement = document.querySelector('ul.todos__list');
    const clearBtnElement = document.querySelector('#clear');

    // Функция отрисовки задач
    function renderTodos (appData) {
        const sortType = appData.sortType;
        const todos = appData.todos;
    
        sortBtnListElement.forEach((sortBtn) => sortBtn.classList.remove('todos__sort-btn--active'));
        document.querySelector(`#${sortType}`).classList.add('todos__sort-btn--active');
    
        while (todoListElement.firstChild) {
            todoListElement.removeChild(todoListElement.firstChild);
        }
    
        switch (sortType) {
            case 'sort-active':
                todos.filter((todo) => !todo.complete).forEach((todo) => {
                    todoListElement.append(getTodoElement(todo));
                })
                break;
            case 'sort-completed':
                todos.filter((todo) => todo.complete).forEach((todo) => {
                    todoListElement.append(getTodoElement(todo));
                })
                break;
            default:
                todos.forEach((todo) => {
                    todoListElement.append(getTodoElement(todo));
                })
        }
    }

    // Сохранение состояния приложения в локальное хранилище
    function saveStateToLocalStorage(appData, localStorageName) {
        localStorage.setItem(localStorageName, JSON.stringify(appData))
    }

    // Загрузка сохраненного состояния из локального хранилища и первоначальный рендеринг элементов при загрузке страницы
    document.addEventListener('DOMContentLoaded', () =>{
        let savedAppData = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (savedAppData) {
            appData = JSON.parse(savedAppData);
        }

        renderTodos(appData);
    })

    // Обработчик добавления новой задачи в список дел по нажатию на Enter
    mainInputElement.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' && event.target.value.trim()) {
            appData.todos.push({
                id: appData.todos.length ? appData.todos[appData.todos.length - 1].id + 1 : 0,
                complete: false,
                title: event.target.value.trim()
            })

            renderTodos(appData);
            saveStateToLocalStorage(appData, LOCAL_STORAGE_KEY)

            event.target.value = '';
        }
    })

    // Обработчик удаления задачи из списка дел
    todoListElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('todos__delete-btn')) {
            const id = parseInt(event.target.parentElement.id);
            appData.todos = appData.todos.filter((todo) => todo.id !== id);
    
            renderTodos(appData);
            saveStateToLocalStorage(appData, LOCAL_STORAGE_KEY)
        }
    })

    // Обработчик переключения состояния готовности задачи
    todoListElement.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const id = parseInt(event.target.parentElement.id);
            appData.todos = appData.todos.map((todo) => {
                if (todo.id === id) {
                    return {
                        id: todo.id,
                        title: todo.title,
                        complete: !todo.complete,
                    }
                }

                return todo;
            })
            saveStateToLocalStorage(appData, LOCAL_STORAGE_KEY)
        }
    })

    // Обработчик изменения заголовка существующей задачи
    todoListElement.addEventListener('change', (event) => {
        if (event.target.classList.contains('todos__task-input')){
            const id = parseInt(event.target.parentElement.id);
            if (event.target.value.trim()) {
                appData.todos = appData.todos.map((todo) => {
                    if (todo.id === id) {
                        return {
                            id: todo.id,
                            title: event.target.value.trim(),
                            complete: todo.complete,
                        }
                    }
    
                    return todo;
                })
            } else {
                appData.todos = appData.todos.filter((todo) => todo.id !== id);

                renderTodos(appData);
                saveStateToLocalStorage(appData, LOCAL_STORAGE_KEY)
            }
        }
    })

    // Обработчик очистки выполненых задач
    clearBtnElement.addEventListener('click', () => {
        appData.todos = appData.todos.filter((todo) => !todo.complete)

        renderTodos(appData)
        saveStateToLocalStorage(appData, LOCAL_STORAGE_KEY)
    })

    // Обработчик сортировки задач
    sortBtnListElement.forEach((sortBtn) => sortBtn.addEventListener('click', (event) => {
        appData.sortType = event.target.id;

        renderTodos(appData)
        saveStateToLocalStorage(appData, LOCAL_STORAGE_KEY)
    }))
})()