import dom from "./DOM";
import projects from "./projects";
import steps from "./steps";

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
            sortTaskList(projectIndex);
            localStorage.setItem('projects', JSON.stringify(projects.projectList));
            dom().handleTasks(title,priority,projectIndex);
        }
    }

    function deleteTask(title, projectIndex){
        const tasks = projects.projectList[projectIndex].tasks;
        const taskIndex = tasks.findIndex((task) => task.title === title);
        tasks.splice(taskIndex, 1);
        projects.projectList[projectIndex].tasks = tasks;
        localStorage.setItem('projects', JSON.stringify(projects.projectList));

    }

    function editTask(currentTask, title, priority, projectIndex){
        const tasks = projects.projectList[projectIndex].tasks;
        const taskIndex = tasks.findIndex((task) => task.title === currentTask);
        tasks[taskIndex].title = title;
        tasks[taskIndex].priority = priority;
        projects.projectList[projectIndex].tasks = tasks;
        localStorage.setItem('projects', JSON.stringify(projects.projectList));
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
        deleteTask,
        editTask,
    }
}

export default tasks;