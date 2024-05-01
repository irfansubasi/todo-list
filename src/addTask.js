function addTask(button){
    const parentDiv1 = button.parentNode;
    const projectDiv = parentDiv1.parentNode;

    const ul = projectDiv.querySelector("ul");
    projectDiv.appendChild(ul);

    const radioGroup = document.querySelector(".radio-group");
    const activeLabel = Array.from(radioGroup.querySelectorAll("label")).find(label => label.classList.contains("prioActive"));
    const inputValue = activeLabel ? activeLabel.querySelector("input").value : null;

    const li = document.createElement("li");
    li.setAttribute("data-priority", inputValue);
    li.classList.add("mt-1");
    ul.appendChild(li);

    const span = document.createElement("span");
    const input = document.getElementById("titleInput").value;
    span.textContent = `${input}`;
    li.appendChild(span);
}

export default addTask;