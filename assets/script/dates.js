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

// COMPLETION DURATION
function getGoalDuration(startDate, completedDate) {
    let startParts = startDate.split("-");
    let completedParts = completedDate.split("-");
    let start = new Date(Number(startParts[0]), Number(startParts[1]) - 1, Number(startParts[2]));
    let completed = new Date(Number(completedParts[0]), Number(completedParts[1]) - 1, Number(completedParts[2]));
    let years = completed.getFullYear() - start.getFullYear();
    let anniversary = new Date(start.getFullYear() + years, start.getMonth(), start.getDate());

    if (anniversary > completed) {
        years--;
        anniversary = new Date(start.getFullYear() + years, start.getMonth(), start.getDate());
    }

    let remainingDays = Math.floor((completed - anniversary) / (1000 * 60 * 60 * 24));

    if (years === 0) {
        return `${remainingDays} days`;
    }

    if (remainingDays === 0) {
        return years === 1 ? "1 year" : `${years} years`;
    }

    return years === 1 ? `1 year and ${remainingDays} days` : `${years} years and ${remainingDays} days`;
}