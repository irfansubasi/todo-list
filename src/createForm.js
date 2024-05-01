import addProject from "./addProject";
import addTask from "./addTask";
function createForm(type, button){
    const dialog = document.querySelector("dialog");
    const form = dialog.querySelector("form");
    
    
    dialog.showModal();
    
    
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

    const detailForm = `
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

    const createBtn = document.querySelector(".createBtn");
    createBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const form = dialog.querySelector("form");
        if(form.id == "project-form"){
            addProject();
            sortPriority();
        }else if(form.id == "task-form"){
            addTask(button);
            sortPriority();
        }
        dialog.close();
    });

    

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
    
    
}

export default createForm;