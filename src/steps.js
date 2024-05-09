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
                        dom().handleSteps(title, desc, date, completed);
                    }
                }
            });
        });
    }

    

    return{
        addStep,
    }

}

export default steps;