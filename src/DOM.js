import createForm from "./createForm";

export const domManipulator = () => {

    const addProjectBtn = document.querySelector(".add-project");

    addProjectBtn.addEventListener("click", () => {
        createForm("project");
    });

    const projectSection = document.querySelector(".project-section");

    projectSection.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-task")) {
        createForm("task", event.target);
    }
    });

    
    
}

