// LOCAL STORAGE
const STORAGE_KEY = "saveSmartData";

// DEFAULT DATA
const defaultData = {
    goals: [],
    transactions: [],
};


// LOAD DATA
function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        return JSON.parse(JSON.stringify(defaultData));
    }

    try {
        const data = JSON.parse(savedData);

        if (!data.goals || !Array.isArray(data.goals)) {
            data.goals = [];
        }

        if (!data.transactions || !Array.isArray(data.transactions)) {
            data.transactions = [];
        }

        return data;

    } catch (error) {
        console.error("Could not load SaveSmart data:", error);
        return JSON.parse(JSON.stringify(defaultData));
    }
}


// SAVE DATA
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveSmartData));
}


// EXPORT DATA
function exportData() {
    const data = JSON.stringify(saveSmartData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "savesmart-backup.json";
    link.click();

    URL.revokeObjectURL(url);
}


// IMPORT DATA
function importData(file) {
    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        let previousData = saveSmartData;

        try {
            const importedData = JSON.parse(event.target.result);

            // Validate the backup before changing existing data.
            if (
                !importedData ||
                typeof importedData !== "object" ||
                Array.isArray(importedData) ||
                !Array.isArray(importedData.goals) ||
                !Array.isArray(importedData.transactions)
            ) {
                throw new Error("This file is not a valid RealSavings Tracker backup.");
            }

            // Validate goal records.
            const validGoals = importedData.goals.every(function(goal) {
                return (
                    goal &&
                    typeof goal === "object" &&
                    typeof goal.id === "string" &&
                    typeof goal.name === "string" &&
                    Number.isFinite(Number(goal.currentAmount)) &&
                    Number(goal.currentAmount) >= 0 &&
                    Number.isFinite(Number(goal.targetAmount)) &&
                    Number(goal.targetAmount) > 0
                );
            });

            if (!validGoals) {
                throw new Error("The backup contains invalid savings goals.");
            }

            // Validate transaction records.
            const validTransactions = importedData.transactions.every(
                function(transaction) {
                    return (
                        transaction &&
                        typeof transaction === "object" &&
                        transaction.goalId !== undefined &&
                        Number.isFinite(Number(transaction.amount))
                    );
                }
            );

            if (!validTransactions) {
                throw new Error("The backup contains invalid transactions.");
            }

            if (typeof importedData.darkMode !== "boolean") {
                importedData.darkMode = false;
            }

            saveSmartData = importedData;
            saveData();

            renderGoals();
            renderTransactions();
            updateScreenWithLatestData();

            showImportFeedback(
                "success",
                "Your data was imported successfully."
            );

        } catch (error) {
            // Restore the in-memory data if anything fails.
            saveSmartData = previousData;

            console.error("Could not import RealSavings Tracker data:", error);

            showImportFeedback(
                "error",
                error.message || "Import failed. Please try another backup file."
            );
        }
    };

    reader.onerror = function() {
        showImportFeedback(
            "error",
            "The selected file could not be read. Please try again."
        );
    };

    reader.readAsText(file);
}