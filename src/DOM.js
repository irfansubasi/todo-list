import projects from "./projects";
import tasks from "./tasks";
import steps from "./steps";

const dom = () => {

    window.onload = function() {
        const activeOne = document.querySelector('.active');
        updateMain({ target: activeOne });
        updateProjects();
        watchCheckboxStatus();
    };

    const dialog = document.querySelector("dialog");
    const form = dialog.querySelector("form");
    const addProjectBtn = document.querySelector(".add-project");
    const projectSection = document.querySelector(".project-section");
    const taskButtons = projectSection.querySelectorAll("li");
    const main = document.querySelector(".content");
    let projectIndex = 0;

    //EVENT LISTENERS

    //add project button
    addProjectBtn.addEventListener("click", () => {
        createForm("project");
        dialog.showModal();
    });

    
    //add task button
    projectSection.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-task")) {
            createForm("task");
            dialog.showModal();
            
            const projectDiv = event.target.parentNode.parentNode;
            const projectId = projectDiv.id.split("-")[1];
            projectIndex = parseInt(projectId);
        }
    });

    //add steps button
    main.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-todo")) {
            createForm("steps");
            dialog.showModal();
        }
    });

    function bindTaskButtonsClickEvent() {
        const taskButtons = projectSection.querySelectorAll("li");
        taskButtons.forEach((button) => {
            button.removeEventListener("click", (e) => {
                updateMain(e);
            });
        });
        taskButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                updateMain(e);
            });
        });
    }

    bindTaskButtonsClickEvent();
    
    

    form.addEventListener("click", handleCreateBtnClick);

    //create button manipulation
    function handleCreateBtnClick(e) {

        if (e.target.classList.contains("createBtn")) {
            e.preventDefault();

            const input = form.querySelector("input").value;
            
            if(form.id == "project-form"){
                projects.addProject(input);
                sortPriority();
            }else if(form.id == "task-form"){
                const radioGroup = document.querySelector(".radio-group");
                const activeLabel = Array.from(radioGroup.querySelectorAll("label")).find(label => label.classList.contains("prioActive"));
                const priorityValue = activeLabel ? activeLabel.querySelector("input").value : null;
                tasks().addTask(input, priorityValue, projectIndex);
                sortPriority();
            }else if (form.id == "steps-form") {
                const mainTitle = document.querySelector("#project-head").textContent;
                const title = form.querySelector("#titleInput").value;
                const desc = form.querySelector("#descInput").value;
                const date = form.querySelector("#dateInput").value;
                const completed = form.querySelector("#isCompleted").classList.contains("todo_checkbox_checked") ? true : false;
                steps().addStep(title, desc, date, completed, mainTitle);
            }
            dialog.close();
            watchCheckboxStatus();

            form.removeEventListener("click", handleCreateBtnClick);
        }
        
    }

    function bindCheckboxClickEvent() {
        main.removeEventListener("click", handleCheckboxClick);
        form.removeEventListener("click", handleCheckboxClick);
        main.addEventListener("click", handleCheckboxClick);
        form.addEventListener("click", handleCheckboxClick);
    }

    bindCheckboxClickEvent();

    //checkbox manipulation
    function handleCheckboxClick(event) {
        const target = event.target;
        if (target.classList.contains("todo_checkbox") || target.classList.contains("todo_checkbox_checked")) {
            target.classList.toggle("todo_checkbox");
            target.classList.toggle("todo_checkbox_checked");
        }
        if(target.classList.contains("todo_checkbox")){
            target.parentNode.style.opacity = "1";
        }else if(target.classList.contains("todo_checkbox_checked")){
            target.parentNode.style.opacity = "0.5";
        }
    };

    function watchCheckboxStatus() {
        const checkedItems = document.querySelectorAll('.todo_checkbox_checked');
        checkedItems.forEach(function(item) {
            item.parentNode.style.opacity = "0.5";
        });
    }



    //createForm
    function createForm(type){
        form.innerHTML = ``;
        
        const taskForm = `
        <div class="input title-input">
            <label for="titleInput">
                <h3>Task Name</h3>
            </label>
            <input type="text" id="titleInput">
        </div>
        <div class="input priority">
            <span>
                <h3>Priority</h3>
            </span>
            <div class="radio-group">
                <label class="lowPrioLabel prioActive" for="lowPrio">
                    <span>Low</span>
                    <input type="radio" name="priority" id="lowPrio" value="low" checked>
                </label>
                
                <label class="midPrioLabel" for="midPrio">
                    <span>Medium</span>
                    <input type="radio" name="priority" id="midPrio" value="mid">
                </label>
                
                <label class="highPrioLabel" for="highPrio">
                    <span>High</span>
                    <input type="radio" name="priority" id="highPrio" value="high">
                </label>
            </div>  
        </div>
        <button class="createBtn mt-1">Create</button>
        `;
    
        const projectForm = `
        <div class="input title-input">
            <label for="titleInput">
                <h3>Project Title</h3>
            </label>
            <input type="text" id="titleInput">
        </div>
        <button class="createBtn mt-1">Create</button>
        `;
    
        const stepsForm = `
        <div class="input title-input">
            <label for="titleInput">
                <h3>Project Title</h3>
            </label>
            <input type="text" id="titleInput">
        </div>
        <div class="input desc-input">
            <label for="descInput">
                <h3>Desc</h3>
            </label>
            <textarea id="descInput" cols="30" rows="10" maxlength="100"></textarea>
        </div>
        <div class="input due-date">
            <label for="dateInput">
                <h3>Due Date</h3>
            </label>
            <input type="date" id="dateInput">
        </div>
        <div id="completeGroup" class="mt-1">
            <div id="isCompleted" class="todo_checkbox_checked"></div>
            <span class="ms-1">Completed</span>
        </div>
        <button class="createBtn mt-1">Create</button>
        `;

    
        if(type == "project"){
            form.innerHTML = projectForm;
            form.id = "project-form";
            
        }else if(type == "task"){
            form.innerHTML = taskForm;
            form.id = "task-form";
            
            const low = document.querySelector(".lowPrioLabel");
            low.addEventListener("click", function(){
                setActiveButton(low);
            })
    
            const mid = document.querySelector(".midPrioLabel");
            mid.addEventListener("click", function(){
                setActiveButton(mid);
            })
    
            const high = document.querySelector(".highPrioLabel");
            high.addEventListener("click", function(){
                setActiveButton(high);
            })
        }else if(type == "steps"){
            form.innerHTML = stepsForm;
            form.id = "steps-form";
        }
    
        function setActiveButton(label){
            const radioGroup = document.querySelector(".radio-group");
            const labels = radioGroup.querySelectorAll("label");
    
            labels.forEach((label) => {
                if(label !== this){
                    label.classList.remove("prioActive");
                }
            });
        
            label.classList.add("prioActive");
        }
    }

    function handleProjects(){
        const projectArea = document.querySelector(".project-section");
        const projects = projectArea.querySelectorAll('[id^="project-"]');
        let maxNum = -1;

        projects.forEach(project => {
            const num = parseInt(project.id.replace("project-", ""));

            if(num > maxNum){
                maxNum = num;
            }
        });
        
        const newNum = maxNum + 1;

        const newProject = document.createElement('div');
        newProject.id = `project-${newNum}`;
        newProject.classList.add("mt-1");
        projectArea.appendChild(newProject);

        const projectHead = document.createElement("div");
        projectHead.classList.add("project_head");
        newProject.appendChild(projectHead);

        const h3 = document.createElement("h3");
        const input = document.getElementById("titleInput").value;
        h3.textContent = `${input}`;
        projectHead.appendChild(h3);
        
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-plus", "ms-auto", "add-task");
        projectHead.appendChild(icon);
    }

    function handleTasks(input,priority,index){
        const projectDiv = document.querySelector(`#project-${index}`);
       
        let ul = projectDiv.querySelector(".task-list");

        if(!ul){
            ul = document.createElement("ul");
            ul.classList.add("ms-1", "task-list");
            projectDiv.appendChild(ul);
        }

        const li = document.createElement("li");
        li.setAttribute("data-priority", priority);
        li.classList.add("mt-1");
        ul.appendChild(li);

        const span = document.createElement("span");
        span.textContent = `${input}`;
        li.appendChild(span);
    }

    function handleSteps(title, desc, date, completed){
        const todo = document.createElement("div");
        todo.classList.add("todo", "p-2", "my-1");
        const todoAdd = main.querySelector(".add-todo");
        main.insertBefore(todo, todoAdd);

        const todoCheckbox = document.createElement("div");
        todoCheckbox.classList.add(completed ? "todo_checkbox_checked" : "todo_checkbox");
        todo.appendChild(todoCheckbox);

        const todoText = document.createElement("div");
        todoText.classList.add("todo_text", "ms-1");
        todo.appendChild(todoText);

        const todoHead = document.createElement("span");
        todoHead.classList.add("todo_text-head");
        todoHead.textContent = title;
        todoText.appendChild(todoHead);

        const todoDesc = document.createElement("span");
        todoDesc.classList.add("todo_text-desc");
        todoDesc.textContent = desc;
        todoText.appendChild(todoDesc);

        const todoDate = document.createElement("span");
        todoDate.classList.add("ms-auto", "todo_date");
        todoDate.textContent = date;
        todo.appendChild(todoDate);

        const editIcon = document.createElement("i");
        editIcon.classList.add("ms-1", "fa-regular", "fa-pen-to-square");
        todo.appendChild(editIcon);

        const trashIcon = document.createElement("i");
        trashIcon.classList.add("ms-1", "fa-regular", "fa-trash-can");
        todo.appendChild(trashIcon);
    }

    function sortPriority(){
        const lists = document.querySelectorAll('.task-list');

        lists.forEach((list) => {
            const items = Array.from(list.querySelectorAll('li'));
            items.sort((a, b) => {
                const priorities = ['high', 'mid', 'low'];
                return priorities.indexOf(a.getAttribute('data-priority')) - priorities.indexOf(b.getAttribute('data-priority'));
            });
            items.forEach(item => list.appendChild(item));
        })
    }
    
    function updateProjects(){
        projectSection.innerHTML = ``;
        const projectList = projects.projectList;

        for(let i = 0; i < projectList.length; i++){
            const project = projectList[i];
            const projectDiv = document.createElement("div");
            projectDiv.id = `project-${i}`;
            projectDiv.classList.add("mt-1");
            projectSection.appendChild(projectDiv);

            const projectHead = document.createElement("div");
            projectHead.classList.add("project_head");
            projectDiv.appendChild(projectHead);

            const h3 = document.createElement("h3");
            h3.textContent = project.title;
            projectHead.appendChild(h3);

            const icon = document.createElement("i");
            icon.classList.add("fa-solid", "fa-plus", "ms-auto", "add-task");
            projectHead.appendChild(icon);

            const taskList = document.createElement("ul");
            taskList.classList.add("ms-1", "task-list");
            projectDiv.appendChild(taskList);

            const tasks = project.tasks;
            for(let j = 0; j < tasks.length; j++){
                const task = tasks[j];
                const li = document.createElement("li");
                li.setAttribute("data-priority", task.priority);
                li.classList.add("mt-1");
                taskList.appendChild(li);

                const span = document.createElement("span");
                span.textContent = task.title;
                li.appendChild(span);

                if (i === 0 && j === 0) {
                    span.classList.add("active");
                }
            }
        }
        bindTaskButtonsClickEvent();
    }

    function updateMain(e){
        console.log(e.target);
        main.innerHTML = ``;
        const header = document.createElement("h2");
        header.id = `project-head`;
        main.appendChild(header);
        const taskHeading = main.querySelector("#project-head")
        const projectDiv = e.target.closest("div[id^='project-']");
        const index = projectDiv.id.split("-")[1];

        const tasks = projects.projectList[index].tasks.find(task => task.title === e.target.textContent);
        taskHeading.textContent = tasks.title;

        const todo = `
            <div class="todo_checkbox"></div>
            <div class="todo_text ms-1">
                <span class="todo_text-head"></span>
                <span class="todo_text-desc"></span>
            </div>
            <span class="ms-auto todo_date"></span>
            <i class="ms-1 fa-regular fa-pen-to-square"></i>
            <i class="ms-1 fa-regular fa-trash-can"></i>
        `;


        for( let i = 0; i < tasks.steps.length; i++){
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo", "p-2", "my-1");
            todoDiv.innerHTML = todo;
            main.appendChild(todoDiv);
            let todoHead = todoDiv.querySelector(".todo_text-head");
            let todoDesc = todoDiv.querySelector(".todo_text-desc");
            let todoDate = todoDiv.querySelector(".todo_date");
            let todoCheckbox = todoDiv.querySelector(".todo_checkbox");

            todoHead.textContent = tasks.steps[i].title;
            todoDesc.textContent = tasks.steps[i].desc;
            todoDate.textContent = tasks.steps[i].date;

            if (tasks.steps[i].completed) {
                todoCheckbox.classList.add("todo_checkbox_checked");
                todoCheckbox.classList.remove("todo_checkbox");
            } else {
                todoCheckbox.classList.add("todo_checkbox");
                todoCheckbox.classList.remove("todo_checkbox_checked");
            }
        }


        const addToDo = document.createElement("div");
        addToDo.classList.add("todo", "p-2", "my-1", "add-todo");
        const addToDoIcon = document.createElement("i");
        addToDoIcon.classList.add("fa-solid", "fa-plus");
        main.appendChild(addToDo);
        addToDo.appendChild(addToDoIcon);
        
    }

    return{
        handleProjects,
        handleTasks,
        handleSteps,
        bindCheckboxClickEvent,
    }
}

export default dom;

