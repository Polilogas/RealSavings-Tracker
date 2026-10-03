// NAVIGATION
function handleNavigation(page) {
    closeAllWindows();
    closeAllGoalMenus();
    closeSearch();

    let sections = document.querySelectorAll(".pageSection");

    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.add("hidden");
    }

    let rightSidebar = document.querySelector(".rightSidebar");
    let selectedPage;

    if (page === "home" || page === "savings") {
        selectedPage = document.querySelector("#homePage");
        selectedPage.classList.remove("hidden");
        rightSidebar.classList.remove("hidden");

        if (page === "savings") {
            setTimeout(function() {
                document.querySelector(".goals").scrollIntoView({behavior: "smooth"});
            }, 50);

        } else {
            window.scrollTo({top: 0, behavior: "smooth"});
        }
    }

    if (page === "transactions") {
        selectedPage = document.querySelector("#transactionsPage");

        selectedPage.classList.remove("hidden");
        rightSidebar.classList.add("hidden");
        renderTransactions();
    }

    if (page === "reports") {
        selectedPage = document.querySelector("#reportsPage");
        selectedPage.classList.remove("hidden");
        rightSidebar.classList.add("hidden");
    }

    if (page === "settings") {
        selectedPage = document.querySelector("#settingsPage");
        selectedPage.classList.remove("hidden");
        rightSidebar.classList.add("hidden");
    }

    // Active navigation button
    let navigationButtons = document.querySelectorAll(".navigation .button");

    for (let i = 0; i < navigationButtons.length; i++) {
        navigationButtons[i].classList.remove("active");
        let buttonPage = navigationButtons[i].dataset.page;

        if (buttonPage === page || (page === "savings" && buttonPage === "home")) {
            navigationButtons[i].classList.add("active");
        }
    }
}