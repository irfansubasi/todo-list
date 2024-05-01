import createForm from "./createForm";

export const domManipulator = () => {

    const addProjectBtn = document.querySelector(".add-project");

    addProjectBtn.addEventListener("click", () => {
        createForm("project");
    });

    const buttons = document.querySelectorAll(".add-task");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            createForm("task", button);
        })
    })
    
}

