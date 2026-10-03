// GLOBAL VARIABLES
let selectedCardId = null;
let activeMoneyWindow = null;
let activeTransactionType = "all";
let activeTransactionGoal = "all";

// LOAD DATA
let saveSmartData = loadData();

// START APP
setCurrentDateDefaults();
setupUIEvents();
setupMoneyInputs();
renderGoals();
updateScreenWithLatestData();
updateRandomQuote();

// UPDATE SCREEN
function updateScreenWithLatestData() {
    updatePercentageBars();
    updateTotalSavings();
    updateTotalTargetSavings();
    updateReports();
}

// HTML SAFETY
function escapeHTML(text) {
    let div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}