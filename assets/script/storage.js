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
    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            const importedData = JSON.parse(event.target.result);

            if (!importedData.goals || !Array.isArray(importedData.goals)) {
                importedData.goals = [];
            }

            if (!importedData.transactions || !Array.isArray(importedData.transactions)) {
                importedData.transactions = [];
            }

            if (typeof importedData.darkMode !== "boolean") {
                importedData.darkMode = false;
            }

            saveSmartData = importedData;
            saveData();

            renderGoals();
            updateScreenWithLatestData();

        } catch (error) {
            console.error("Could not import SaveSmart data:", error);
        }
    };

    reader.readAsText(file);
}