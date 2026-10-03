// MOBILE MENU
let mobileMenuButton = document.querySelector("#mobileMenuButton");
let leftSidebar = document.querySelector(".leftSidebar");

mobileMenuButton.addEventListener("click", function() {
    leftSidebar.classList.toggle("mobileMenuOpen");

    if (leftSidebar.classList.contains("mobileMenuOpen")) {
        mobileMenuButton.textContent = "×";
        mobileMenuButton.classList.add("mobileMenuOpen");
    } else {
        mobileMenuButton.textContent = "☰";
        mobileMenuButton.classList.remove("mobileMenuOpen");
    }
});

document.addEventListener("click", function(event) {
    if (!leftSidebar.contains(event.target) && !mobileMenuButton.contains(event.target)) {
        leftSidebar.classList.remove("mobileMenuOpen");
        mobileMenuButton.textContent = "☰";
    }
});


// CLOSE MOBILE MENU AFTER NAVIGATION
let navigationButtons = document.querySelectorAll(".navigation .button");

navigationButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        leftSidebar.classList.remove("mobileMenuOpen");
        mobileMenuButton.classList.remove("mobileMenuOpen");
        mobileMenuButton.textContent = "☰";
    });
});