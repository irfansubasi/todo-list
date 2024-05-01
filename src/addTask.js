function addTask(button){
    const parentDiv1 = button.parentNode;
    const projectDiv = parentDiv1.parentNode;

    const ul = projectDiv.querySelector("ul");
    projectDiv.appendChild(ul);

    const li = document.createElement("li");
    li.setAttribute("data-priority", "mid");
    li.classList.add("mt-1");
    ul.appendChild(li);

    const span = document.createElement("span");
    const input = document.getElementById("titleInput").value;
    span.textContent = `${input}`;
    li.appendChild(span);
}

export default addTask;