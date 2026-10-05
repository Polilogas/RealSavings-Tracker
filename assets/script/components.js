// LOAD SHARED COMPONENTS

async function loadComponent(elementId, fileName) {

    let element = document.querySelector(`#${elementId}`);

    if (!element) {
        return;
    }

    let root = window.location.pathname.includes("/guides/") ? "../" : "./";

    let response = await fetch(`${root}components/${fileName}`);
    let html = await response.text();

    html = html.replaceAll("{{ROOT}}", root);

    element.innerHTML = html;
}


// LOAD HEADER AND FOOTER

loadComponent("header", "header.html");
loadComponent("footer", "footer.html");