// CURRENCY DISPLAY PREFERENCES
const CURRENCY_STORAGE_KEY = "saveSmartCurrency";

const SAVESMART_CURRENCIES = Object.freeze([
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "USD", name: "US dollar", symbol: "$" },
    { code: "GBP", name: "British pound", symbol: "£" },
    { code: "JPY", name: "Japanese yen", symbol: "¥" },
    { code: "PHP", name: "Philippine peso", symbol: "₱" },
    { code: "CAD", name: "Canadian dollar", symbol: "CA$" },
    { code: "AUD", name: "Australian dollar", symbol: "A$" },
    { code: "INR", name: "Indian rupee", symbol: "₹" },
    { code: "CNY", name: "Chinese yuan", symbol: "CN¥" },
    { code: "CHF", name: "Swiss franc", symbol: "CHF" }
]);

function getSelectedCurrencyCode() {
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    const isSupported = SAVESMART_CURRENCIES.some(
        (currency) => currency.code === savedCurrency
    );

    return isSupported ? savedCurrency : "EUR";
}

function saveSelectedCurrencyCode(currencyCode) {
    const isSupported = SAVESMART_CURRENCIES.some(
        (currency) => currency.code === currencyCode
    );

    if (isSupported) {
        localStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode);
    }
}

function getCurrencyLocale(currencyCode) {
    // Use the Philippine locale so PHP displays as ₱ instead of the code PHP.
    return currencyCode === "PHP" ? "en-PH" : "en-US";
}

function formatCurrency(amount, currencyCode = getSelectedCurrencyCode()) {
    const currency = SAVESMART_CURRENCIES.find(
        (option) => option.code === currencyCode
    ) || SAVESMART_CURRENCIES[0];
    const numericAmount = Number(amount);

    try {
        return new Intl.NumberFormat(getCurrencyLocale(currency.code), {
            style: "currency",
            currency: currency.code
        }).format(Number.isFinite(numericAmount) ? numericAmount : 0);
    } catch (error) {
        return `${currency.code} ${Number.isFinite(numericAmount) ? numericAmount.toFixed(2) : "0.00"}`;
    }
}

function getCurrencySymbol(currencyCode = getSelectedCurrencyCode()) {
    const currency = SAVESMART_CURRENCIES.find(
        (option) => option.code === currencyCode
    ) || SAVESMART_CURRENCIES[0];

    try {
        return new Intl.NumberFormat(getCurrencyLocale(currency.code), {
            style: "currency",
            currency: currency.code
        })
            .formatToParts(0)
            .find((part) => part.type === "currency")?.value || currency.symbol;
    } catch (error) {
        return currency.symbol;
    }
}

function updateCurrencyPresentation(root = document) {
    root.querySelectorAll("[data-currency-value]").forEach((element) => {
        element.textContent = formatCurrency(element.dataset.currencyValue);
    });

    root.querySelectorAll("[data-currency-symbol]").forEach((element) => {
        element.textContent = getCurrencySymbol();
    });
}
