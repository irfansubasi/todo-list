function addProject(){
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

export default addProject;