// SEARCH
function closeSearch() {
    let searchForm = document.querySelector("#searchForm");
    let searchInput = document.querySelector("#goalSearchInput");

    searchForm.classList.remove("active");
    searchInput.value = "";
}