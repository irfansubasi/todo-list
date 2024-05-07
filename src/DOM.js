import projects from "./projects";
import tasks from "./tasks";

const dom = () => {

    const dialog = document.querySelector("dialog");
    const form = dialog.querySelector("form");
    const addProjectBtn = document.querySelector(".add-project");
    const projectSection = document.querySelector(".project-section");
    const taskButtons = projectSection.querySelectorAll("li");
    let projectIndex = 0;

    taskButtons.forEach((button) => {
        button.addEventListener("click", (e) =>{
            updateScreen(e);
        })
    })

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

    //create button
    dialog.addEventListener("click", (e) => {
        if(e.target.classList.contains("createBtn")){

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
            }
            dialog.close();
        }
    });


    //createForm
    function createForm(type){
        
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



    function updateScreen(e){
        const main = document.querySelector(".content");
        main.innerHTML = ``;
        const header = document.createElement("h2");
        header.id = `project-head`;
        main.appendChild(header);
        const taskHeading = main.querySelector("#project-head")
        const projectDiv = e.target.closest("div[id^='project-']");
        const index = projectDiv.id.split("-")[1];

        const tasks = projects.projectList[index].tasks[0];

        ;
        taskHeading.textContent = tasks.title;

        const todo = `
            <div class="todo_checkbox"></div>
            <div class="todo_text ms-1">
                <span class="todo_text-head"></span>
                <span class="todo_text-desc"></span>
            </div>
            <span class="ms-auto todo_date">Aug 9th</span>
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
            let todoDate = todoDiv.querySelector(".todo_date").textContent;

            todoHead.textContent = tasks.steps[i].title;
            todoDesc.textContent = tasks.steps[i].desc;
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
    }
}

export default dom;

