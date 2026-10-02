// GLOBAL VARIABLES
const STORAGE_KEY = "saveSmartData";
let selectedCardId = null;
let activeMoneyWindow = null;

// DEFAULT DATA
const defaultData = {
    goals: [],

    transactions: [],
    darkMode: false
};

// QUOTES
const quotes = [
    {
        text: "A goal without a plan is just a wish.",
        author: "Often attributed to Antoine de Saint-Exupéry"
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    },
    {
        text: "The future depends on what you do today.",
        author: "Mahatma Gandhi"
    },
    {
        text: "Success is the sum of small efforts, repeated day in and day out.",
        author: "Robert Collier"
    },
    {
        text: "A journey of a thousand miles begins with a single step.",
        author: "Lao Tzu"
    },
    {
        text: "Do something today that your future self will thank you for.",
        author: "Unknown"
    },
    {
        text: "Great things are done by a series of small things brought together.",
        author: "Vincent van Gogh"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },
    {
        text: "Success usually comes to those who are too busy to be looking for it.",
        author: "Henry David Thoreau"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    }
];

// LOAD DATA
let saveSmartData = loadData();

// START APP
setCurrentDateDefaults();
setupEventListeners();
setupMoneyInputs();
applySavedSettings();
renderGoals();
updateScreenWithLatestData();
updateRandomQuote();


// RANDOM QUOTE
function updateRandomQuote() {
    let quoteElement = document.querySelector("#sidebarQuoteText");
    let authorElement = document.querySelector("#sidebarQuoteAuthor");

    if (!quoteElement || !authorElement) {
        return;
    }

    let randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.textContent = quotes[randomIndex].text;
    authorElement.textContent = "— " + quotes[randomIndex].author;
}

// LOCAL STORAGE
function loadData() {
    let savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData === null) {
        let firstData = JSON.parse(JSON.stringify(defaultData));

        localStorage.setItem(STORAGE_KEY,JSON.stringify(firstData));

        return firstData;
    }

    try {
        let data = JSON.parse(savedData);

        if (!Array.isArray(data.goals)) {
            data.goals = [];
        }

        if (!Array.isArray(data.transactions)) {
            data.transactions = [];
        }

        if (typeof data.darkMode !== "boolean") {
            data.darkMode = false;
        }

        return data;
    } catch (error) {
        console.error("SaveSmart data could not be loaded.",error);

        return JSON.parse(JSON.stringify(defaultData));
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY,JSON.stringify(saveSmartData));
}

// EVENT LISTENERS
function setupEventListeners() {
    // GOAL OPTIONS MENU
    document.addEventListener("click",
        function(event) {
            let goalOptions = event.target.closest(".goal-options");

            if (goalOptions) {
                let menuButton = event.target.closest(".goal-options > p");
                let menu = goalOptions.querySelector(".goal-options-menu");

                if (!menuButton) {
                    let button = event.target.closest(".goal-options-menu button");

                    if (!button) {
                        return;
                    }

                    let card = goalOptions.closest(".card");

                    if (!card) {
                        return;
                    }

                    let cardId = card.id;

                    if (button.dataset.action === "edit") {
                        editGoal(cardId);
                    }

                    if (button.dataset.action === "delete") {
                        deleteGoal(cardId);
                    }
                    return;
                }

                closeAllGoalMenus(menu);
                menu.classList.toggle("hidden");
                return;
            }

            closeAllGoalMenus();
        }
    );

    // ESCAPE
    document.addEventListener("keydown", function(event) {

            if (event.key === "Escape") {
                closeAllWindows();
                closeAllGoalMenus();
                closeSearch();
            }
        }
    );

    // TAB FOCUS
    document.addEventListener("keydown", function(event) {

            if (event.key !== "Tab") {
                return;
            }

            let openWindow = document.querySelector(".popupWindow:not(.hidden)");

            if (!openWindow) {
                return;
            }

            let focusableElements = getFocusableElements(openWindow);

            if (focusableElements.length === 0) {
                return;
            }

            let firstElement = focusableElements[0];
            let lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }

            if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    );


    // NAVIGATION
    let navigationButtons = document.querySelectorAll(".navigation .button");

    for (let i = 0; i < navigationButtons.length; i++) {
        navigationButtons[i].addEventListener("click", function() {
                let page = navigationButtons[i].dataset.page;
                handleNavigation(page);
            }
        );
    }

    // SEARCH
    let searchButton = document.querySelector("#searchButton");
    let searchForm = document.querySelector("#searchForm");
    let searchInput = document.querySelector("#goalSearchInput");

    searchButton.addEventListener("click", function() {
            if (!document.querySelector("#homePage").classList.contains("hidden")) {
                searchForm.classList.toggle("active");

                if (searchForm.classList.contains("active")) {
                    searchInput.focus();
                } else {
                    searchInput.value = "";
                    renderGoals();
                }
            }
        }
    );

    searchInput.addEventListener("input", function() {
            renderGoals();
        }
    );

    searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
        }
    );

    // DARK MODE
    document.querySelector("#darkModeToggle").addEventListener("click" ,function() {
                saveSmartData.darkMode = !saveSmartData.darkMode;
                saveData();
                applySavedSettings();
            }
        );

    // EXPORT DATA
    document.querySelector("#exportDataButton").addEventListener("click", function() {
        exportData();
    });

    // IMPORT DATA
    document.querySelector("#importDataButton").addEventListener("click", function() {
        document.querySelector("#importDataInput").click();
    });

    document.querySelector("#importDataInput").addEventListener("change", function() {
        importData(this.files[0]);
    });

    // ADD MONEY
    document.querySelector("#addMoney").addEventListener("input" ,function() {
                limitMoneyDecimals(this);
                updateAddMoneyPreview();
            }
        );

    document.querySelector("#addTotalMoney").addEventListener("input" ,function() {
                limitMoneyDecimals(this);
                updateAddTotalMoneyPreview();
            }
        );

    // REMOVE MONEY
    document.querySelector("#removeMoney").addEventListener("input" ,function() {
                limitMoneyDecimals(this);
                updateRemoveMoneyPreview();
            }
        );

    document.querySelector("#updateTotalMoney").addEventListener("input" ,function() {
                limitMoneyDecimals(this);
                updateRemoveTotalMoneyPreview();
            }
        );

    // NEW GOAL MONEY
    document.querySelector("#currentAmountInput").addEventListener("input" ,function() {
                limitMoneyDecimals(this);
            }
        );

    document.querySelector("#targetAmountInput").addEventListener("input" ,function() {
                limitMoneyDecimals(this);

                if (Number(this.value.replace(",", ".")) > 0) {
                    this.classList.remove("invalid");
                }
            }
        );

    // NEW GOAL IMAGE
    document.querySelector("#selectAnImageBtn").addEventListener("change" ,function() {
                let file = this.files[0];
                let preview = document.querySelector("#newGoalImagePreview");

                if (!file) {
                    preview.src = "./assets/images/piggy-bank-icon-design-png-image_1012404.png";
                    return;
                }

                previewImage(file, preview);

            }
        );

    // CLEAR VALIDATION WHILE TYPING
    document.querySelector("#goalNameInput").addEventListener("input", function() {
                if (this.value.trim() !== "") {
                    this.classList.remove("invalid");
                }
            }
        );

    document.querySelector("#startDateInput").addEventListener("change", function() {
                this.classList.remove("invalid");

                updateEndDateMinimum();
            }
        );


    document.querySelector("#endDateInput").addEventListener("change", function() {
                this.classList.remove("invalid");
            }
        );


    // EDIT VALIDATION
    document.querySelector("#editGoalName").addEventListener("input", function() {
                if (this.value.trim() !== "") {
                    this.classList.remove("invalid");
                }
            }
        );

    document.querySelector("#editStartDate").addEventListener("change", function() {
                this.classList.remove("invalid");
                document.querySelector("#editEndDate").min = this.value;
            }
        );


    document.querySelector("#editTargetAmount").addEventListener("input", function() {
                if (Number(this.value) > 0) {
                    this.classList.remove("invalid");
                }
            }
        );


    document.querySelector("#editEndDate").addEventListener("change",function() {
                this.classList.remove("invalid");
            }
        );
}

// EXPORT DATA
function exportData() {
    let data = JSON.stringify(saveSmartData, null, 4);
    let file = new Blob([data], {
        type: "application/json"
    });

    let url = URL.createObjectURL(file);
    let link = document.createElement("a");

    link.href = url;
    link.download = "SaveSmart-backup.json";
    link.click();
    URL.revokeObjectURL(url);
}

// IMPORT DATA
function importData(file) {
    if (!file) {
        return;
    }

    let reader = new FileReader();
    reader.onload = function() {
        try {
            let importedData = JSON.parse(reader.result);
            console.log("1. JSON parsed:", importedData);
            if (!importedData || !Array.isArray(importedData.goals) || !Array.isArray(importedData.transactions) || typeof importedData.darkMode !== "boolean") {
                console.log("2. Validation failed.");
                alert("This file is not a valid SaveSmart backup.");
                return;
            }

            console.log("2. Validation passed.");
            saveSmartData = importedData;
            console.log("3. saveSmartData replaced.");
            saveData();
            console.log("4. Data saved.");
            renderGoals();
            console.log("5. Goals rendered.");
            applySavedSettings();
            console.log("6. Settings applied.");
            updateScreenWithLatestData();
            console.log("7. Screen updated.");

            alert("SaveSmart data imported successfully.");
        } catch (error) {
            console.error("Import error:", error);
            alert("The backup file could not be read.");
        }
    };
    reader.readAsText(file);
}

// MONEY INPUTS
function setupMoneyInputs() {

    let moneyInputs = [
        "#currentAmountInput",
        "#targetAmountInput",
        "#addMoney",
        "#addTotalMoney",
        "#removeMoney",
        "#updateTotalMoney"
    ];

    for (let i = 0; i < moneyInputs.length; i++) {

        let input = document.querySelector(moneyInputs[i]);

        if (!input) {
            continue;
        }

        input.type = "text";
        input.inputMode = "decimal";
        input.autocomplete = "off";
    }
}

// LIMIT MONEY DECIMALS
function limitMoneyDecimals(input) {

    let value = input.value;

    value = value.replace(/,/g, ".");

    value = value.replace(/[^\d.]/g, "");

    let firstDecimalPoint = value.indexOf(".");

    if (firstDecimalPoint !== -1) {

        let wholeNumber = value.slice(0, firstDecimalPoint);
        let decimalNumber = value.slice(firstDecimalPoint + 1);

        decimalNumber = decimalNumber.replace(/\./g, "");
        decimalNumber = decimalNumber.slice(0, 2);

        value = wholeNumber + "." + decimalNumber;
    }

    input.value = value;
}

// FOCUSABLE ELEMENTS
function getFocusableElements(window) {

    return Array.from(
        window.querySelectorAll(
            "button, input, select, textarea, a[href], [tabindex]:not([tabindex='-1'])"
        )
    ).filter(function(element) {
        return !element.disabled &&
               !element.hidden &&
               element.offsetParent !== null;
    });
}

// NAVIGATION
function handleNavigation(page) {
    closeAllWindows();
    closeAllGoalMenus();
    closeSearch();

    let sections = document.querySelectorAll(".pageSection");

    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.add("hidden");
    }

    let rightSidebar = document.querySelector(".rightSidebar");
    let selectedPage;

    if (page === "home" || page === "savings") {
        selectedPage = document.querySelector("#homePage");
        selectedPage.classList.remove("hidden");
        rightSidebar.classList.remove("hidden");

        if (page === "savings") {
            setTimeout(function() {
                document.querySelector(".goals").scrollIntoView({behavior: "smooth"});
            }, 50);

        } else {
            window.scrollTo({top: 0, behavior: "smooth"});
        }
    }

    if (page === "transactions") {
        selectedPage = document.querySelector("#transactionsPage");

        selectedPage.classList.remove("hidden");
        rightSidebar.classList.add("hidden");
        renderTransactions();
    }

    if (page === "reports") {
        selectedPage = document.querySelector("#reportsPage");
        selectedPage.classList.remove("hidden");
        rightSidebar.classList.add("hidden");
    }

    if (page === "settings") {
        selectedPage = document.querySelector("#settingsPage");
        selectedPage.classList.remove("hidden");
        rightSidebar.classList.add("hidden");
    }

    // Active navigation button
    let navigationButtons = document.querySelectorAll(".navigation .button");

    for (let i = 0; i < navigationButtons.length; i++) {
        navigationButtons[i].classList.remove("active");
        let buttonPage = navigationButtons[i].dataset.page;

        if (buttonPage === page || (page === "savings" && buttonPage === "home")) {
            navigationButtons[i].classList.add("active");
        }
    }
}

// SEARCH
function closeSearch() {
    let searchForm = document.querySelector("#searchForm");
    let searchInput = document.querySelector("#goalSearchInput");

    searchForm.classList.remove("active");
    searchInput.value = "";
}

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

// UPDATE SCREEN
function updateScreenWithLatestData() {
    updatePercentageBars();
    updateTotalSavings();
    updateTotalTargetSavings();
}

// RENDER GOALS
function renderGoals() {
    let goalsContainer = document.querySelector(".mainContainer .goals");
    
    goalsContainer.innerHTML = "";

    let searchInput = document.querySelector("#goalSearchInput");
    let searchText = searchInput.value.trim().toLowerCase();

    let goalsToDisplay = saveSmartData.goals.filter(function(goal) {
        return goal.name.toLowerCase().includes(searchText);
    });

    if (goalsToDisplay.length === 0) {

        if (saveSmartData.goals.length === 0) {
            goalsContainer.innerHTML = `<div class="noGoals"><p>You don't have any savings goals yet.</p></div>`;
        } else {
            goalsContainer.innerHTML = `<div class="noGoals"><p>No savings goals found.</p></div>`;
        }

        updateScreenWithLatestData();
        return;
    }

    for (let i = 0; i < goalsToDisplay.length; i++) {

        let goal = goalsToDisplay[i];
        let percentage = 0;

        if (goal.targetAmount > 0) {
            percentage = (goal.currentAmount / goal.targetAmount) * 100;
        }

        percentage = Math.min(percentage, 100);

        let newGoal = `
            <div
                id="${escapeHTML(goal.id)}"
                class="card">

                <div class="goalInfo">
                    <div class="goalPicture">
                        <img src="${goal.image}" alt="Savings Image for this goal" draggable="false">
                    </div>

                    <div class="goalDetails">
                        <div class="titleAndSubtitleAndIcon">
                            <div class="titleAndSubtitle">
                                <p class="goalTitle">${escapeHTML(goal.name)}</p>
                                <p class="goalSubtitle">${escapeHTML(goal.subtitle)}</p>
                            </div>
                        </div>

                        <div class="dates">
                            <div class="startDate">
                                <img src="./assets/images/calendar.svg" alt="calendar icon" draggable="false">
                                <p>Start:${goal.startDate || ""}</p>
                            </div>

                            <div class="endDate">
                                <img src="./assets/images/calendar.svg" alt="calendar icon" draggable="false">
                                <p>Finish:${goal.endDate || ""}</p>
                            </div>
                        </div>
                    </div>

                    <div class="goal-options">
                        <p>...</p>
                        <div class="goal-options-menu hidden">
                            <button type="button" data-action="edit">Edit</button>
                            <button type="button" data-action="delete">Delete</button>
                        </div>
                    </div>
                </div>

                <div class="progressInfo">
                    <p><span class="currentSavings">€${converNumberToCurrency(goal.currentAmount)}</span> / €${converNumberToCurrency(goal.targetAmount)}</p>
                    <p><span class="percentage">${percentage.toFixed(2)}%</span></p>
                </div>

                <div class="progressBarContainer">
                    <div class="progressBar" style="width: ${percentage}%"></div>
                </div>

                <div class="buttons">
                    <button class="addMoney" type="button" onclick="addMoney('${goal.id}')"><span>+</span>Add Money</button>
                    <button class="removeMoney" type="button" onclick="removeMoney('${goal.id}')"><span class="minus">-</span>Remove Money</button>
                </div>
            </div>
        `;

        goalsContainer.insertAdjacentHTML("beforeend", newGoal);
    }

    updateScreenWithLatestData();
}

// PROGRESS BARS
function updatePercentageBars() {
    let allPercentages = document.querySelectorAll(".goals .percentage");
    let allProgressBars = document.querySelectorAll(".goals .progressBar");

    for (let i = 0; i < allProgressBars.length; i++) {

        if (allPercentages[i]) {
            allProgressBars[i].style.width = allPercentages[i].textContent;
        }
    }

    let totalPercentage = document.querySelector(".rightSidebar .percentage");
    let totalProgressBar = document.querySelector(".rightSidebar .progressBar");

    if (totalPercentage && totalProgressBar) {
        totalProgressBar.style.width = totalPercentage.textContent;
    }
}

// TOTAL SAVINGS
function updateTotalSavings() {

    let totalAmount = 0;

    for (let i = 0; i < saveSmartData.goals.length; i++) {
        totalAmount += Number(saveSmartData.goals[i].currentAmount);
    }

    let totalSavingsElement = document.querySelector(".rightSidebar .totalSavingsContainer .currentSavings");

    totalSavingsElement.textContent = "€" + converNumberToCurrency(totalAmount);
}

// TOTAL TARGET SAVINGS
function updateTotalTargetSavings() {

    let totalAmount = 0;
    let totalCurrentAmount = 0;

    for (let i = 0; i < saveSmartData.goals.length; i++) {
        totalAmount += Number(saveSmartData.goals[i].targetAmount);
        totalCurrentAmount += Number(saveSmartData.goals[i].currentAmount);
    }

    let percentage = 0;

    if (totalAmount > 0) {
        percentage = (totalCurrentAmount / totalAmount) * 100;
    }

    percentage = Math.min(percentage, 100);

    let totalSavingsElement = document.querySelector(".rightSidebar .totalSavingsContainer .totalGoalSavings");

    totalSavingsElement.innerHTML = `
        of €${converNumberToCurrency(totalAmount)}
        (<span class="percentage">${percentage.toFixed(0)}%</span>)
    `;

    updatePercentageBars();
}

// CURRENCY
function converNumberToCurrency(money) {

    return Number(money).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// NEW GOAL WINDOW
function showAddNewGoalWindow() {

    closeAllWindows();
    closeAllGoalMenus();
    setCurrentDateDefaults();

    document.querySelector("#darkOverlay").classList.add("darkOverlay");
    document.querySelector(".newGoalForm").classList.remove("hidden");
    document.querySelector("#newGoalImagePreview").src = "./assets/images/piggy-bank-icon-design-png-image_1012404.png";
    document.querySelector("#goalNameInput").focus();
}

// ADD NEW GOAL
async function addANewGoal() {

    let goalName = document.querySelector("#goalNameInput").value.trim();
    let goalSubtitle = document.querySelector("#subtitleInput").value.trim();
    let startDate = document.querySelector("#startDateInput").value;
    let endDate = document.querySelector("#endDateInput").value;
    let currentAmount = Number(document.querySelector("#currentAmountInput").value.replace(",", "."));
    let targetAmount = Number(document.querySelector("#targetAmountInput").value.replace(",", "."));
    let valid = true;

    // REQUIRED FIELDS
    if (goalName === "") {
        document.querySelector("#goalNameInput").classList.add("invalid");
        valid = false;
    }

    if (startDate === "") {
        document.querySelector("#startDateInput").classList.add("invalid");
        valid = false;
    }

    if (
        targetAmount <= 0 ||
        document.querySelector("#targetAmountInput").value === ""
    ) {
        document.querySelector("#targetAmountInput").classList.add("invalid");
        valid = false;
    }

    if (endDate !== "" && endDate < startDate) {
        document.querySelector("#endDateInput").classList.add("invalid");
        valid = false;
    }

    if (!valid) {
        return;
    }

    // IMAGE
    let selectedImage = document.querySelector("#selectAnImageBtn").files[0];
    let imageURL;

    if (selectedImage) {
        imageURL = await convertImageToDataURL(selectedImage);
    } else {
        imageURL = "./assets/images/piggy-bank-icon-design-png-image_1012404.png";
    }

    // ID
    let newId = getNextCardId();

    // GOAL
    let newGoal = {
        id: newId,
        name: goalName,
        subtitle: goalSubtitle,
        startDate: startDate,
        endDate: endDate,
        currentAmount: roundMoney(currentAmount),
        targetAmount: roundMoney(targetAmount),
        image: imageURL
    };

    saveSmartData.goals.push(newGoal);

    saveData();
    renderGoals();
    clearNewGoalForm();
    closeAllWindows();
}

// GET NEXT CARD ID
function getNextCardId() {

    let highestNumber = 0;

    for (let i = 0; i < saveSmartData.goals.length; i++) {

        let number = Number(
            saveSmartData.goals[i].id.replace("card", "")
        );

        if (number > highestNumber) {
            highestNumber = number;
        }
    }

    return "card" + (highestNumber + 1);
}

// EDIT GOAL
function editGoal(cardId) {

    closeAllGoalMenus();

    let goal = findGoal(cardId);

    if (!goal) {
        return;
    }

    document.querySelector(".editingGoalName").textContent = "Editing: " + goal.name;
    document.querySelector("#editGoalName").value = goal.name;
    document.querySelector("#editSubtitle").value = goal.subtitle;
    document.querySelector("#editStartDate").value = goal.startDate;
    document.querySelector("#editEndDate").value = goal.endDate;
    document.querySelector("#editCurrentAmount").value = goal.currentAmount;
    document.querySelector("#editTargetAmount").value = goal.targetAmount;
    document.querySelector("#editStartDate").min = getCurrentDate();
    document.querySelector("#editEndDate").min = goal.startDate;

    selectedCardId = cardId;

    document.querySelector("#darkOverlay").classList.add("darkOverlay");
    document.querySelector("#editGoalWindow").classList.remove("hidden");
    document.querySelector("#editGoalName").focus();
}

// SAVE EDITED GOAL
async function saveEditedGoal() {

    let goal = findGoal(selectedCardId);

    if (!goal) {
        return;
    }

    let newName = document.querySelector("#editGoalName").value.trim();
    let newSubtitle = document.querySelector("#editSubtitle").value.trim();
    let newStartDate = document.querySelector("#editStartDate").value;
    let newEndDate = document.querySelector("#editEndDate").value;
    let newCurrentAmount = Number(document.querySelector("#editCurrentAmount").value);
    let newTargetAmount = Number(document.querySelector("#editTargetAmount").value);
    let valid = true;

    if (newName === "") {
        document.querySelector("#editGoalName").classList.add("invalid");
        valid = false;
    }

    if (newStartDate === "") {
        document.querySelector("#editStartDate").classList.add("invalid");
        valid = false;
    }

    if (
        newTargetAmount <= 0 ||
        document.querySelector("#editTargetAmount").value === ""
    ) {
        document.querySelector("#editTargetAmount").classList.add("invalid");
        valid = false;
    }

    if (newEndDate !== "" && newEndDate < newStartDate) {
        document.querySelector("#editEndDate").classList.add("invalid");
        valid = false;
    }

    if (!valid) {
        return;
    }

    goal.name = newName;
    goal.subtitle = newSubtitle;
    goal.startDate = newStartDate;
    goal.endDate = newEndDate;
    goal.currentAmount = roundMoney(newCurrentAmount);
    goal.targetAmount = roundMoney(newTargetAmount);

    let selectedImage = document.querySelector("#editGoalImage").files[0];

    if (selectedImage) {
        goal.image = await convertImageToDataURL(selectedImage);
    }

    saveData();
    renderGoals();

    document.querySelector("#editGoalImage").value = "";

    closeAllWindows();
}

// DELETE GOAL
function deleteGoal(cardId) {

    closeAllGoalMenus();

    let goal = findGoal(cardId);

    if (!goal) {
        return;
    }

    let confirmation = confirm(
        `Are you sure you want to delete "${goal.name}"?`
    );

    if (!confirmation) {
        return;
    }

    saveSmartData.goals = saveSmartData.goals.filter(function(goal) {
        return goal.id !== cardId;
    });

    saveSmartData.transactions = saveSmartData.transactions.filter(function(transaction) {
        return transaction.goalId !== cardId;
    });

    saveData();
    renderGoals();
}

// FIND GOAL
function findGoal(cardId) {

    for (let i = 0; i < saveSmartData.goals.length; i++) {

        if (saveSmartData.goals[i].id === cardId) {
            return saveSmartData.goals[i];
        }
    }

    return null;
}

// ADD MONEY
function addMoney(cardId) {

    selectedCardId = cardId;

    let goal = findGoal(cardId);

    if (!goal) {
        return;
    }

    closeAllWindows();
    activeMoneyWindow = "add";

    document.querySelector("#darkOverlay").classList.add("darkOverlay");
    document.querySelector("#addMoneyWindow").classList.remove("hidden");
    document.querySelector("#addMoneyWindow .goalTitle").textContent = goal.name;
    document.querySelector("#addMoneyWindow .displayTotalMoney").textContent = converNumberToCurrency(goal.currentAmount);
    document.querySelector("#addMoney").value = "";
    document.querySelector("#addTotalMoney").value = "";

    document.querySelector("#addMoney").focus();
}

// ADD MONEY PREVIEW
function updateAddMoneyPreview() {

    let goal = findGoal(selectedCardId);

    if (!goal) {
        return;
    }

    let amount = getMoneyInputValue(document.querySelector("#addMoney"));

    document.querySelector("#addTotalMoney").value = "";

    let newAmount = goal.currentAmount + amount;

    document.querySelector("#addMoneyWindow .displayTotalMoney").textContent = converNumberToCurrency(
        roundMoney(newAmount)
    );
}

// ADD TOTAL MONEY PREVIEW
function updateAddTotalMoneyPreview() {

    let amount = getMoneyInputValue(document.querySelector("#addTotalMoney"));

    document.querySelector("#addMoney").value = "";

    document.querySelector("#addMoneyWindow .displayTotalMoney").textContent = converNumberToCurrency(
        roundMoney(amount)
    );
}

// REMOVE MONEY
function removeMoney(cardId) {

    selectedCardId = cardId;

    let goal = findGoal(cardId);

    if (!goal) {
        return;
    }

    closeAllWindows();
    activeMoneyWindow = "remove";

    document.querySelector("#darkOverlay").classList.add("darkOverlay");
    document.querySelector("#removeMoneyWindow").classList.remove("hidden");
    document.querySelector("#removeMoneyWindow .goalTitle").textContent = goal.name;
    document.querySelector("#removeMoneyWindow .displayTotalMoney").textContent = converNumberToCurrency(goal.currentAmount);
    document.querySelector("#removeMoney").value = "";
    document.querySelector("#updateTotalMoney").value = "";
    document.querySelector("#removeMoneyWindow input[type='button']").disabled = false;

    document.querySelector("#removeMoney").focus();
}

// REMOVE MONEY PREVIEW
function updateRemoveMoneyPreview() {

    let goal = findGoal(selectedCardId);

    if (!goal) {
        return;
    }

    let amount = getMoneyInputValue(document.querySelector("#removeMoney"));

    document.querySelector("#updateTotalMoney").value = "";

    let newAmount = goal.currentAmount - amount;

    let submitButton = document.querySelector("#removeMoneyWindow input[type='button']");

    document.querySelector("#removeMoneyWindow .displayTotalMoney").textContent = converNumberToCurrency(
        roundMoney(newAmount)
    );

    submitButton.disabled = newAmount < 0;
}

// REMOVE TOTAL MONEY PREVIEW
function updateRemoveTotalMoneyPreview() {

    let amount = getMoneyInputValue(document.querySelector("#updateTotalMoney"));

    document.querySelector("#removeMoney").value = "";

    let submitButton = document.querySelector("#removeMoneyWindow input[type='button']");

    document.querySelector("#removeMoneyWindow .displayTotalMoney").textContent = converNumberToCurrency(
        roundMoney(amount)
    );

    submitButton.disabled = amount < 0;
}

// SUBMIT ADD / REMOVE MONEY
function submitChanges() {

    let goal = findGoal(selectedCardId);

    if (!goal) {
        return;
    }

    let oldAmount = goal.currentAmount;
    let newAmount;

    // ADD
    if (activeMoneyWindow === "add") {

        let addInput = getMoneyInputValue(document.querySelector("#addMoney"));
        let totalInput = getMoneyInputValue(document.querySelector("#addTotalMoney"));

        if (document.querySelector("#addMoney").value !== "") {

            newAmount = oldAmount + addInput;

        } else if (document.querySelector("#addTotalMoney").value !== "") {

            newAmount = totalInput;

        } else {

            return;
        }
    }

    // REMOVE
    if (activeMoneyWindow === "remove") {

        let removeInput = getMoneyInputValue(document.querySelector("#removeMoney"));
        let totalInput = getMoneyInputValue(document.querySelector("#updateTotalMoney"));
        
        if (document.querySelector("#removeMoney").value !== "") {

            newAmount = oldAmount - removeInput;

        } else if (document.querySelector("#updateTotalMoney").value !== "") {

            newAmount = totalInput;

        } else {

            return;
        }

        if (newAmount < 0) {
            return;
        }
    }

    newAmount = roundMoney(newAmount);
    goal.currentAmount = newAmount;

    let difference = roundMoney(newAmount - oldAmount);

    if (difference !== 0) {

        saveSmartData.transactions.unshift({
            id: Date.now(),
            goalId: goal.id,
            goalName: goal.name,
            amount: difference,
            date: new Date().toISOString()
        });
    }

    saveData();
    renderGoals();
    clearMoneyInputs();

    let feedbackType = activeMoneyWindow;

    closeAllWindows();

    if (difference !== 0) {
        showMoneyFeedback(feedbackType);
    }
}

// MONEY FEEDBACK
function showMoneyFeedback(type) {

    let feedbackContainer = document.querySelector("#moneyFeedback");

    feedbackContainer.innerHTML = "";

    let background = document.createElement("div");
    background.classList.add("moneyFeedbackBackground", type);

    feedbackContainer.appendChild(background);

    let addEmojis = ["😊", "🎉", "💰", "✨", "🥳"];
    let removeEmojis = ["😢", "😞", "💸", "😔", "🥀"];

    let emojis;

    if (type === "add") {
        emojis = addEmojis;
    } else {
        emojis = removeEmojis;
    }

    for (let i = 0; i < 10; i++) {

        let particle = document.createElement("span");
        particle.classList.add("moneyParticle");

        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        particle.style.setProperty(
            "--moveX",
            (Math.random() * 500 - 250) + "px"
        );

        particle.style.setProperty(
            "--moveY",
            (Math.random() * -350 - 100) + "px"
        );

        particle.style.setProperty(
            "--scale",
            (Math.random() * 0.7 + 0.8).toFixed(2)
        );

        particle.style.setProperty(
            "--rotation",
            (Math.random() * 60 - 30) + "deg"
        );

        particle.style.left = (Math.random() * 70 + 15) + "%";
        particle.style.top = (Math.random() * 25 + 55) + "%";
        particle.style.animationDelay = (Math.random() * 0.15) + "s";

        feedbackContainer.appendChild(particle);
    }

    setTimeout(function() {
        feedbackContainer.innerHTML = "";
    }, 1400);
}

// TRANSACTIONS
function renderTransactions() {

    let container = document.querySelector("#transactionsList");
    container.innerHTML = "";

    if (saveSmartData.transactions.length === 0) {

        container.innerHTML = `
            <div class="noTransactions">
                <p>
                    No transactions yet.
                </p>
            </div>
        `;

        return;
    }

    for (let i = 0; i < saveSmartData.transactions.length; i++) {

        let transaction = saveSmartData.transactions[i];
        let sign = transaction.amount >= 0 ? "+" : "";
        let amountClass = transaction.amount >= 0 ? "add" : "remove";

        let transactionHTML = `
            <div class="transaction">
                <div class="transactionInfo">
                    <strong>
                        ${escapeHTML(transaction.goalName)}
                    </strong>

                    <small>
                        ${formatTransactionDate(transaction.date)}
                    </small>
                </div>

                <span class="transactionAmount ${amountClass}">
                    ${sign}${converNumberToCurrency(transaction.amount)} €
                </span>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", transactionHTML);
    }
}

// TRANSACTION DATE
function formatTransactionDate(date) {

    return new Date(date).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

// SETTINGS
function applySavedSettings() {

    let toggle = document.querySelector("#darkModeToggle");

    if (saveSmartData.darkMode) {

        document.body.classList.add("darkMode");
        toggle.classList.add("active");
        toggle.setAttribute("aria-pressed", "true");

    } else {

        document.body.classList.remove("darkMode");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-pressed", "false");
    }
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
        darkMode: false
    };

    saveData();
    renderGoals();
    renderTransactions();
    applySavedSettings();
}

// CLOSE WINDOWS
function closeAllWindows() {

    let windows = document.querySelectorAll(".popupWindow");

    for (let i = 0; i < windows.length; i++) {
        windows[i].classList.add("hidden");
    }

    document.querySelector("#darkOverlay").classList.remove("darkOverlay");

    activeMoneyWindow = null;
}

// CLOSE GOAL MENUS
function closeAllGoalMenus(exceptMenu = null) {

    let menus = document.querySelectorAll(".goal-options-menu");

    for (let i = 0; i < menus.length; i++) {

        if (menus[i] !== exceptMenu) {
            menus[i].classList.add("hidden");
        }
    }
}

// CLEAR NEW GOAL FORM
function clearNewGoalForm() {

    document.querySelector("#selectAnImageBtn").value = "";
    document.querySelector("#newGoalImagePreview").src = "./assets/images/piggy-bank-icon-design-png-image_1012404.png";
    document.querySelector("#goalNameInput").value = "";
    document.querySelector("#subtitleInput").value = "";
    document.querySelector("#startDateInput").value = getCurrentDate();
    document.querySelector("#endDateInput").value = "";
    document.querySelector("#currentAmountInput").value = "0";
    document.querySelector("#targetAmountInput").value = "";

    let inputs = document.querySelectorAll(".newGoalForm .invalid");

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove("invalid");
    }
}

// CLEAR MONEY INPUTS
function clearMoneyInputs() {

    document.querySelector("#addMoney").value = "";
    document.querySelector("#addTotalMoney").value = "";
    document.querySelector("#removeMoney").value = "";
    document.querySelector("#updateTotalMoney").value = "";
    document.querySelector("#removeMoneyWindow input[type='button']").disabled = false;
}

// IMAGE PREVIEW
function previewImage(file, previewElement) {

    let reader = new FileReader();

    reader.onload = function() {
        previewElement.src = reader.result;
    };

    reader.readAsDataURL(file);
}

// IMAGE TO DATA URL
function convertImageToDataURL(file) {

    return new Promise(function(resolve, reject) {

        let reader = new FileReader();

        reader.onload = function() {
            resolve(reader.result);
        };

        reader.onerror = function() {
            reject(reader.error);
        };

        reader.readAsDataURL(file);
    });
}

// MONEY INPUT TO NUMBER
function getMoneyInputValue(input) {
    return Number(input.value.replace(",", "."));
}

// MONEY ROUNDING
function roundMoney(amount) {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
}

// HTML SAFETY
function escapeHTML(text) {
    let div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}