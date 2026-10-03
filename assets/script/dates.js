// CURRENT DATE
function getCurrentDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function setCurrentDateDefaults() {
    let today = getCurrentDate();
    document.querySelector("#startDateInput").value = today;
    document.querySelector("#endDateInput").min = today;
}


// UPDATE END DATE MINIMUM
function updateEndDateMinimum() {
    let startDate = document.querySelector("#startDateInput").value;

    document.querySelector("#endDateInput").min = startDate;
}