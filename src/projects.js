import dom from "./DOM";
const projects = (() => {
    localStorage.clear();
    let projectList = [];

    if(localStorage.getItem("projects") === null){
        projectList = [
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
                                date: "08-17-2024",
                                completed: false
                            },
                            {
                                title: "State Management",
                                desc: "Understanding state and its importance",
                                date: "08-20-2024",
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
                                date: "08-15-2024",
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
        localStorage.setItem('projects', JSON.stringify(projectList));
    }else{
        projectList = JSON.parse(localStorage.getItem("projects"));
    }

    class Project{
        constructor(title){
            this.title = title;
            this.tasks = [];
        }
    }

    function addProject(title){
        const existingProject = projects.projectList.find((project) => project.title === title);
        if(!existingProject){
            const project = new Project(title);
            projectList.push(project);
            localStorage.setItem('projects', JSON.stringify(projectList));
            dom().handleProjects();
        }
        
    }

    function editProject(currentProject, title){
        const projectIndex = projectList.findIndex((project) => project.title === currentProject);
        projectList[projectIndex].title = title;
        localStorage.setItem('projects', JSON.stringify(projectList));
    }

    function deleteProject(title){
        const projectIndex = projectList.findIndex((project) => project.title === title);
        projectList.splice(projectIndex, 1);
        localStorage.setItem('projects', JSON.stringify(projectList));
    }


    return {
        projectList,
        addProject,
        deleteProject,
        editProject,
    }

})();

export default projects;


