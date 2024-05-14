import dom from "./DOM";
import projects from "./projects";

function steps(){

    class Step{
        constructor(title, desc, date, completed){
            this.title = title;
            this.desc = desc;
            this.date = date;
            this.completed = completed;
        }
    }

    function addStep(title, desc, date, completed, mainTitle){
        const projectList = projects.projectList;
        let stepExists = false;
        
        projectList.forEach(project => {
            project.tasks.forEach(task => {
                if (task.title === mainTitle) {
                    task.steps.forEach(step => {
                        if (step.title === title) {
                            stepExists = true;
                        }
                    });
                    
                    if (!stepExists) {
                        task.steps.push(new Step(title, desc, date, completed));
                        localStorage.setItem('projects', JSON.stringify(projects.projectList));
                        dom().handleSteps(title, desc, date, completed);
                        dom().bindCheckboxClickEvent();
                    }
                }
            });
        });
    }

    function deleteStep(title, mainTitle){
        const projectList = projects.projectList;
        
        projectList.forEach(project => {
            project.tasks.forEach(task => {
                if (task.title === mainTitle) {
                    task.steps.forEach((step, index) => {
                        if (step.title === title) {
                            task.steps.splice(index, 1);
                            localStorage.setItem('projects', JSON.stringify(projects.projectList));
                        }
                    });
                }
            });
        });
    }
    

    return{
        addStep,
        deleteStep,
    }

}

export default steps;