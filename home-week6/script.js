let zIndexValue = 100;

document.addEventListener("DOMContentLoaded", () => {
    const plants = document.querySelectorAll(".plant");
    const terrarium = document.getElementById("terrarium");

    plants.forEach((plant) => {
        plant.setAttribute("draggable", "true");
        plant.addEventListener("dragstart", dragStartHandler);
        plant.addEventListener("dblclick", bringToFrontHandler);
    });

    terrarium.addEventListener("dragover", dragOverHandler);
    terrarium.addEventListener("drop", dropHandler);
});

function dragStartHandler(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.effectAllowed = "move";
}

function dragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function dropHandler(event) {
    event.preventDefault();
    const plantId = event.dataTransfer.getData("text/plain");
    const plant = document.getElementById(plantId);
    const rect = terrarium.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    plant.style.position = "absolute";
    plant.style.width = "150px";
    plant.style.height = "150px";
    plant.style.left = `${offsetX - plant.offsetWidth / 2}px`;
    plant.style.top = `${offsetY - plant.offsetHeight / 2}px`;
    terrarium.appendChild(plant);
}

function bringToFrontHandler(event) {
    zIndexValue += 10;
    event.target.style.zIndex = zIndexValue;
}