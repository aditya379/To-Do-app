let form = document.querySelector("form");
let text = document.getElementById("text");
let todoCon = document.querySelector(".todo-con");
let draggedItem = null;

function colorSwitcher() {
    const switcher = document.getElementById('switch');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light', currentTheme === 'light');
    switcher.src = `./images/icon-${currentTheme === 'light' ? 'moon' : 'sun'}.svg`;
    
    switcher.addEventListener("click", () => {
        const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
        document.body.classList.toggle('light');
        switcher.src = `./images/icon-${newTheme === 'light' ? 'moon' : 'sun'}.svg`;
        localStorage.setItem('theme', newTheme);
    });
}  

colorSwitcher()
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addtodo();
});

let todos = JSON.parse(localStorage.getItem("todos"));
if (todos) {
    todos.forEach(element => {
        addtodo(element);
    });
}

function addtodo(elem) {
    let todoColl = document.createElement("div");
    todoColl.classList.add("todocoll");
    let todotext = text.value;
    if (elem) {
        todotext = elem.text;
    }
    if (todotext) {
        todoColl.innerHTML = `
            <div class="todo-li" draggable="true">
                <div class="check ${elem && elem.complete ? "active-check" : ""}">
                    <img src="./images/icon-check.svg" alt="">
                </div>
                <p class="ptag ${elem && elem.complete ? "complete" : ""}">${todotext}</p>
                <button class="close"><img src="./images/icon-cross.svg" alt=""></button>
            </div>
            <div class="hr"></div>`;
        todoCon.appendChild(todoColl);
        updateLs();
    }
    let close = todoColl.querySelector(".close");
    close.addEventListener("click", () => {
        todoColl.remove();
        updateLs();
    });
    let check = todoColl.querySelector(".check");
    check.addEventListener('click', () => {
        check.classList.toggle("active-check");
        todoColl.children[0].children[1].classList.toggle("complete");
        updateLs();
    });
    text.value = "";
    setitem();
}

function updateLs() {
    let ptag = document.querySelectorAll(".ptag");
    let arr = [];
    ptag.forEach(element => {
        arr.push({
            text: element.innerText,
            complete: element.classList.contains("complete")
        });
    });
    localStorage.setItem("todos", JSON.stringify(arr));
    setitem();
}

let info = document.querySelectorAll(".choice p");

info.forEach(element => {
    element.addEventListener("click", () => {
        info.forEach(item => {
            item.classList.remove("active");
        });
        element.classList.add("active");

        const filterType = element.innerText;
        let todoli = document.querySelectorAll(".todocoll");
        todoli.forEach(elem => {
            const isCompleted = elem.querySelector(".ptag").classList.contains("complete");
            if ((filterType === "Active" && !isCompleted) || (filterType === "Completed" && isCompleted)) {
                elem.style.display = "block";
            } else if (filterType === "All") {
                elem.style.display = "block";
            } else {
                elem.style.display = "none";
            }
        });
    });
});

let clearCompletedButton = document.querySelector(".clear");
clearCompletedButton.addEventListener("click", () => {
    let completedTodos = document.querySelectorAll(".complete");
    completedTodos.forEach(todo => {
        todo.parentElement.parentElement.remove();
    });
    updateLs();
});

function setitem() {
    let todoItems = document.querySelectorAll(".todo-li");
    let activeTodo = document.querySelectorAll(".todo-li:not(.complete)");
    let diff = activeTodo.length;
    document.querySelector(".left").innerText = `${diff} item${diff !== 1 ? 's' : ''} left`;
}

setitem();

// Event listeners for drag and drop functionality
todoCon.addEventListener("dragstart", function(e) {
    draggedItem = e.target.closest(".todocoll");
    draggedItem.classList.add("dragging");
});

todoCon.addEventListener("dragover", function(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(todoCon, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
        todoCon.appendChild(draggable);
    } else {
        todoCon.insertBefore(draggable, afterElement);
    }
});

todoCon.addEventListener("dragend", function() {
    draggedItem.classList.remove("dragging");
    updateLs();
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".todocoll:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
