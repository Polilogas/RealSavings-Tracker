// SETTINGS
// DELETE ALL DATA
function deleteAllData() {
    let confirmation = confirm(
        "Are you sure you want to delete ALL SaveSmart data? This cannot be undone."
    );

    if (!confirmation) {
        return;
    }

    saveSmartData = { 
        goals: [], 
        transactions: [] 
    };

    saveData();
    renderGoals();
    renderTransactions();
}