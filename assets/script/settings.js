// SETTINGS
function setupCurrencySettings() {
    const currencySelect = document.querySelector("#currencySelect");

    currencySelect.innerHTML = SAVESMART_CURRENCIES.map((currency) => `
        <option value="${currency.code}">
            ${currency.name} (${currency.code} · ${currency.symbol})
        </option>
    `).join("");

    currencySelect.value = getSelectedCurrencyCode();
    updateCurrencyPresentation();

    currencySelect.addEventListener("change", function() {
        saveSelectedCurrencyCode(currencySelect.value);
        renderGoals();
        renderTransactions();
    });
}

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
        transactions: [], 
    };

    saveData();
    renderGoals();
    renderTransactions();
}
