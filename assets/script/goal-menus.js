// GOAL MENUS
function closeAllGoalMenus(exceptMenu = null) {
    let menus = document.querySelectorAll(".goal-options-menu");
    for (let i = 0; i < menus.length; i++) {
        if (menus[i] !== exceptMenu) {
            menus[i].classList.add("hidden");
        }
    }
}