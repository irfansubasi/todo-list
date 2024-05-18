import projects from "./projects";
import tasks from "./tasks";
import steps from "./steps";
import { format } from 'date-fns';


const dom = () => {

    window.onload = function() {
        updateProjects();
        const firstLi = projectSection.querySelector('li');
        updateMain({ target: firstLi });
        watchCheckboxStatus();
    };

    const dialog = document.querySelector("dialog");
    const form = dialog.querySelector("form");

    const projectSection = document.querySelector(".project-section");
    const main = document.querySelector(".content");

    let projectIndex = 0;
    let currentStep;
    let currentTask;
    let currentProject;

    //EVENT LISTENERS

    function bindEvents(){
        const page = document.querySelector(".page");
        page.removeEventListener("click", handleClicks);
        page.addEventListener("click", handleClicks);
    }

    function handleClicks(event){
        if (event.target.classList.contains("add-project")) {
            createForm("project");
            dialog.showModal();
        }else if(event.target.classList.contains("add-task")){
            createForm("task");
            const projectDiv = event.target.parentNode.parentNode.parentNode;
            const projectId = projectDiv.id.split("-")[1];
            projectIndex = parseInt(projectId);
            dialog.showModal();
        }else if(event.target.classList.contains("add-todo")){
            createForm("steps");
            dialog.showModal();
        }else if(event.target.classList.contains("fa-pen-to-square")){
            handleEditBtnClick(event);
        }else if((event.target.tagName === "SPAN" && event.target.parentNode.parentNode.classList.contains("task-list")) 
            || (event.target.classList.contains("all")) 
            || (event.target.classList.contains("today"))){
            updateMain(event);
        }else if(event.target.classList.contains("fa-trash-can")){
            handleDeleteBtnClick(event);
        }else if(event.target.classList.contains("createBtn")){
            handleCreateBtnClick(event);
        }else if(event.target.classList.contains("todo_checkbox") || event.target.classList.contains("todo_checkbox_checked")){
            handleCheckboxClick(event.target);
        }
    }


    function handleEditBtnClick(e) {
        if (e.target.classList.contains("fa-pen-to-square")) {
            if(e.target.parentNode.classList.contains("todo")){
                const todo = e.target.closest(".todo");
                currentStep = todo.querySelector(".todo_text-head").textContent;
                createForm("editStep");
                dialog.showModal();
                
            }else if(e.target.parentNode.classList.contains("project-head-group")){
                currentTask = main.querySelector("#project-head").textContent;
                createForm("editTask");
                dialog.showModal();
            }else if(e.target.parentNode.parentNode.classList.contains("project_head")){
                currentProject = e.target.parentNode.parentNode.querySelector("h3").textContent;
                createForm("editProject");
                dialog.showModal();
            }
        }
    }

    function handleDeleteBtnClick(e) {
        if (e.target.classList.contains("fa-trash-can")) {
            if(e.target.parentNode.classList.contains("todo")){
                const todo = e.target.closest(".todo");
                const todoHead = todo.querySelector(".todo_text-head");
                const mainTitle = document.querySelector("#project-head").textContent;
                steps().deleteStep(todoHead.textContent, mainTitle);
                todo.remove();
            }else if(e.target.parentNode.parentNode.classList.contains("project_head")){
                const projectHead = e.target.parentNode.parentNode;
                const projectTitle = projectHead.querySelector("h3").textContent;
                projects.deleteProject(projectTitle);
                projectHead.parentNode.remove();
            }else if(e.target.parentNode.classList.contains("project-head-group")){
                const activeTask = projectSection.querySelector(".active");
                const activeTaskTitle = activeTask.querySelector("span").textContent;
                const projectIndex = activeTask.closest("div[id^='project-']").id.split("-")[1];
                tasks().deleteTask(activeTaskTitle, projectIndex);
                activeTask.remove();
                main.innerHTML = ``;
            }
        }
    }


    //create button manipulation
    function handleCreateBtnClick(e) {

        e.preventDefault();

        const input = form.querySelector("input").value;
        
        if(form.id == "project-form"){
            projects.addProject(input);
        }else if(form.id == "task-form"){
            const radioGroup = document.querySelector(".radio-group");
            const activeLabel = Array.from(radioGroup.querySelectorAll("label")).find(label => label.classList.contains("prioActive"));
            const priorityValue = activeLabel ? activeLabel.querySelector("input").value : null;
            tasks().addTask(input, priorityValue, projectIndex);
        }else if (form.id == "steps-form") {
            const mainTitle = document.querySelector("#project-head").textContent;
            const title = form.querySelector("#titleInput").value;
            const desc = form.querySelector("#descInput").value;
            const date = form.querySelector("#dateInput").value;
            const completed = form.querySelector("#isCompleted").classList.contains("todo_checkbox_checked") ? true : false;
            steps().addStep(title, desc, date, completed, mainTitle);
        }else if(form.id == "editStep-form"){
            const mainTitle = document.querySelector("#project-head").textContent;
            const title = form.querySelector("#titleInput").value;
            const desc = form.querySelector("#descInput").value;
            const date = form.querySelector("#dateInput").value;
            const completed = form.querySelector("#isCompleted").classList.contains("todo_checkbox_checked") ? true : false;
            steps().editStep(currentStep, title, desc, date, completed, mainTitle);
        }else if(form.id == "editTask-form"){
            const radioGroup = document.querySelector(".radio-group");
            const activeLabel = Array.from(radioGroup.querySelectorAll("label")).find(label => label.classList.contains("prioActive"));
            const priorityValue = activeLabel ? activeLabel.querySelector("input").value : null;
            const activeTask = projectSection.querySelector(".active");
            const projectIndex = activeTask.closest("div[id^='project-']").id.split("-")[1];
            tasks().editTask(currentTask, input, priorityValue, projectIndex);
        }else if(form.id == "editProject-form"){
            const title = form.querySelector("#titleInput").value;
            projects.editProject(currentProject, title);
        }
        dialog.close();
        sortPriority();
        console.log(projects.projectList);
        updateProjects();
        updateMain({ target: document.querySelector(".active") });
        watchCheckboxStatus();
    }

    //checkbox manipulation
    function handleCheckboxClick(event) {
        event.classList.toggle("todo_checkbox");
        event.classList.toggle("todo_checkbox_checked");
        if(event.classList.contains("todo_checkbox")){
            event.parentNode.style.opacity = "1";
        }else if(event.classList.contains("todo_checkbox_checked")){
            event.parentNode.style.opacity = "0.5";
        }
        const taskTitle = event.parentNode.querySelector('.todo_text .todo_text-head');

        for (let project of projects.projectList) {
            for (let task of project.tasks) {
                for (let step of task.steps) {
                    if (step.title === taskTitle.textContent) {
                        step.completed = event.classList.contains("todo_checkbox_checked");
                    }
                }
            }
        }
        localStorage.setItem('projects', JSON.stringify(projects.projectList));
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
                <h3>Step Title</h3>
            </label>
            <input type="text" id="titleInput">
        </div>
        <div class="input desc-input">
            <label for="descInput">
                <h3>Description</h3>
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
        }else if(type == "editStep"){
            form.innerHTML = stepsForm;
            form.id = "editStep-form";
        }else if(type == "editTask"){
            form.innerHTML = taskForm;
            form.id = "editTask-form";

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
        }else if(type == "editProject"){
            form.innerHTML = projectForm;
            form.id = "editProject-form";
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

        const iconDiv = document.createElement("div");
        iconDiv.classList.add("ms-auto");
        projectHead.appendChild(iconDiv);

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-regular", "fa-trash-can", "me-1");
        iconDiv.appendChild(deleteIcon);

        const addIcon = document.createElement("i");
        addIcon.classList.add("fa-solid", "fa-plus", "add-task");
        iconDiv.appendChild(addIcon);
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
        const selectedDate = new Date(date);
        const formattedDate = format(selectedDate, 'dd MMM yy');
        todoDate.textContent = formattedDate;
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

            const iconDiv = document.createElement("div");
            iconDiv.classList.add("ms-auto");
            projectHead.appendChild(iconDiv);

            const editIcon = document.createElement("i");
            editIcon.classList.add("fa-regular", "fa-pen-to-square", "me-1");
            iconDiv.appendChild(editIcon);

            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa-regular", "fa-trash-can", "me-1");
            iconDiv.appendChild(deleteIcon);

            const addIcon = document.createElement("i");
            addIcon.classList.add("fa-solid", "fa-plus", "add-task");
            iconDiv.appendChild(addIcon);

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
                    li.classList.add("active");
                }
            }
        }
    }

    function updateMain(e){
        console.log("worked");
        const navbar = document.querySelector(".navbar");
        const listLis = navbar.querySelectorAll("li");
        if (listLis.length === 0) {
            main.innerHTML = ``;
            return;
        }
        listLis.forEach((button) => {
            button.classList.remove("active");
        });
        const clickedLi = e.target.closest("li");
        clickedLi.classList.add("active");

        if(e.target.classList.contains("all")){
            showAll();
            return;
        }

        if(e.target.classList.contains("today")){
            showToday();
            return;
        }

        main.innerHTML = ``;
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("project-head-group");
        main.appendChild(headerDiv);

        const header = document.createElement("h2");
        header.id = `project-head`;
        headerDiv.appendChild(header);

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-regular", "fa-trash-can", "ms-1");
        headerDiv.appendChild(deleteIcon);

        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-regular", "fa-pen-to-square", "ms-1");
        headerDiv.appendChild(editIcon);
        
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
            const selectedDate = new Date(tasks.steps[i].date);
            const formattedDate = format(selectedDate, 'dd MMM yy');
            todoDate.textContent = formattedDate;
            

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
        bindEvents();
        watchCheckboxStatus();
    }

    function showAll(){
        main.innerHTML = ``;
        const allProjects = projects.projectList;

        const todoHTML = `
            <div class="todo_text ms-1">
                <span class="todo_text-head"></span>
                <span class="todo_text-desc"></span>
            </div>
            <span class="ms-auto todo_date"></span>
        `;

        for(let i = 0; i < allProjects.length; i++){
            const projectDiv = document.createElement("div");
            projectDiv.id = `project-${i}`;
            projectDiv.classList.add("mt-1");
            main.appendChild(projectDiv);

            const projectHeadGroup = document.createElement("div");
            projectHeadGroup.classList.add("project-head-group");
            projectDiv.appendChild(projectHeadGroup);

            const projectHead = document.createElement("h1");
            projectHead.classList.add("project_head");
            projectHead.textContent = allProjects[i].title;
            projectHeadGroup.appendChild(projectHead);

            for(let j = 0; j < allProjects[i].tasks.length; j++){
                const task = allProjects[i].tasks[j];
                const taskDiv = document.createElement("div");
                taskDiv.classList.add("task");
                projectDiv.appendChild(taskDiv);

                const taskTitle = document.createElement("h2");
                taskTitle.textContent = task.title;
                taskDiv.appendChild(taskTitle);

                for(let k = 0; k < task.steps.length; k++){
                    const todoDiv = document.createElement("div");
                    todoDiv.classList.add("todo", "p-2", "my-1");
                    todoDiv.innerHTML = todoHTML;
                    taskDiv.appendChild(todoDiv);

                    let todoHead = todoDiv.querySelector(".todo_text-head");
                    let todoDesc = todoDiv.querySelector(".todo_text-desc");
                    let todoDate = todoDiv.querySelector(".todo_date");
                    todoHead.textContent = task.steps[k].title;
                    todoDesc.textContent = task.steps[k].desc;
                    const selectedDate = new Date(task.steps[k].date);
                    const formattedDate = format(selectedDate, 'dd MMM yy');
                    todoDate.textContent = formattedDate;
                }
            }

        }

    }

    function showToday(){
        main.innerHTML = ``;

        const todoHTML = `
            <div class="todo_checkbox"></div>
            <div class="todo_text ms-1">
                <span class="todo_text-head"></span>
                <span class="todo_text-desc"></span>
            </div>
            <span class="ms-auto todo_date"></span>
        `;

        const today = new Date();
        const todayFormatted = format(today, 'dd MMM yy');

        const allProjects = projects.projectList;

        allProjects.forEach(project => {
            project.tasks.forEach(task => {
                task.steps.forEach(step => {
                    const stepDate = new Date(step.date);
                    const stepDateFormatted = format(stepDate, 'dd MMM yy');
                    if (stepDateFormatted === todayFormatted) {
                        const todo = document.createElement("div");
                        todo.classList.add("todo", "p-2", "my-1");
                        todo.innerHTML = todoHTML;
                        main.appendChild(todo);

                        const todoHead = todo.querySelector(".todo_text-head");
                        const todoDesc = todo.querySelector(".todo_text-desc");
                        const todoDate = todo.querySelector(".todo_date");
                        const todoCheckbox = todo.querySelector(".todo_checkbox");

                        todoHead.textContent = step.title;
                        todoDesc.textContent = step.desc;
                        todoDate.textContent = stepDateFormatted;
                        
                        if (step.completed) {
                            todoCheckbox.classList.add("todo_checkbox_checked");
                            todoCheckbox.classList.remove("todo_checkbox");
                        } else {
                            todoCheckbox.classList.add("todo_checkbox");
                            todoCheckbox.classList.remove("todo_checkbox_checked");
                        }
                    }else{
                        main.textContent = "No tasks for today!";
                    }
                });
            });
        });
    }

    return{
        handleProjects,
        handleTasks,
        handleSteps,
        updateMain,
    }
}

export default dom;

