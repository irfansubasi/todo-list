import dom from "./DOM";
import projects from "./projects";

function tasks(){

    class Task{
        constructor(title, priority){
            this.title = title;
            this.priority = priority;
            this.steps = [];
        }
    }


    function addTask(title, priority, projectIndex){
        const existingTask = projects.projectList[projectIndex].tasks.find((task) => task.title === title);
        if(!existingTask){
            const task = new Task(title, priority);
            projects.projectList[projectIndex].tasks.push(task);
            console.log(projects.projectList)
            sortTaskList(projectIndex);
            dom().handleTasks(title,priority);
        }
    }

    function sortTaskList(projectIndex){
        const tasks = projects.projectList[projectIndex].tasks;
        
        tasks.sort((a, b) => {
            const priorities = ["high", "mid", "low"];
            return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
        });

        projects.projectList.tasks = tasks;

        return projects.projectList;
    }

    return{
        addTask,
    }
}

export default tasks;