// WINDOWS
function closeAllWindows() {
    let windows = document.querySelectorAll(".popupWindow");

    for (let i = 0; i < windows.length; i++) {
        windows[i].classList.add("hidden");
    }

    document.querySelector("#darkOverlay").classList.remove("darkOverlay");

    activeMoneyWindow = null;
}