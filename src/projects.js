import dom from "./DOM";


let projectList = [
    {
        title: "Work",
        tasks: [
            {
                title: "Learn react",
                priority: "mid",
                steps: [
                    {
                        title: "API Integration",
                        desc: "Fetching data using Axios or fetch API.",
                        date: "09-08-2024",
                        completed: false
                    },
                    {
                        title: "Routing",
                        desc: "Implementing page navigation using React Router.",
                        date: "17-08-2024",
                        completed: false
                    },
                    {
                        title: "State Management",
                        desc: "Understanding state and its importance",
                        date: "20-08-2024",
                        completed: true
                    }
                ]
            }
        ]
    },
    {
        title: "Family",
        tasks: [
            {
                title: "Birthday party",
                priority: "mid",
                steps: [
                    {
                        title: "Get pie",
                        desc: "I have to get pie before party.",
                        date: "15-08-2024",
                        completed: false
                    },
                    {
                        title: "Talk to John",
                        desc: "John will organize party. I'll talk to him.",
                        date: "12-08-2024",
                        completed: false
                    },
                ]
            }
        ]
    }
]

class Project{
    constructor(title){
        this.title = title;
        this.tasks = [];
    }
}

function addProject(title){
    const project = new Project(title);
    projectList.push(project);
    dom().handleProjects();
}


const projects = {
    projectList,
    addProject,
}



export default projects;


