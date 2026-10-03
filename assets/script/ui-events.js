// UI EVENTS

// SETUP UI EVENTS

function setupUIEvents() {

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
    document.querySelector("#addMoney").addEventListener("input", function() {
        limitMoneyDecimals(this);
        updateAddMoneyPreview();
    });

    document.querySelector("#addTotalMoney").addEventListener("input", function() {
        limitMoneyDecimals(this);
        updateAddTotalMoneyPreview();
    });

    // REMOVE MONEY
    document.querySelector("#removeMoney").addEventListener("input", function() {
        limitMoneyDecimals(this);
        updateRemoveMoneyPreview();
    });

    document.querySelector("#updateTotalMoney").addEventListener("input", function() {
        limitMoneyDecimals(this);
        updateRemoveTotalMoneyPreview();
    });

    // NEW GOAL MONEY
    document.querySelector("#currentAmountInput").addEventListener("input", function() {
        limitMoneyDecimals(this);
    });

    document.querySelector("#targetAmountInput").addEventListener("input", function() {
        limitMoneyDecimals(this);

        if (Number(this.value.replace(",", ".")) > 0) {
            this.classList.remove("invalid");
        }
    });

    // NEW GOAL IMAGE
    document.querySelector("#selectAnImageBtn").addEventListener("change", function() {
        let file = this.files[0];
        let preview = document.querySelector("#newGoalImagePreview");

        if (!file) {
            preview.src = "./assets/images/piggy-bank-icon-design-png-image_1012404.png";
            return;
        }

        previewImage(file, preview);
    });

    // CLEAR VALIDATION WHILE TYPING
    document.querySelector("#goalNameInput").addEventListener("input", function() {
        if (this.value.trim() !== "") {
            this.classList.remove("invalid");
        }
    });

    document.querySelector("#startDateInput").addEventListener("change", function() {
        this.classList.remove("invalid");
        updateEndDateMinimum();
    });

    document.querySelector("#endDateInput").addEventListener("change", function() {
        this.classList.remove("invalid");
    });

    // EDIT VALIDATION
    document.querySelector("#editGoalName").addEventListener("input", function() {
        if (this.value.trim() !== "") {
            this.classList.remove("invalid");
        }
    });

    document.querySelector("#editStartDate").addEventListener("change", function() {
        this.classList.remove("invalid");
        document.querySelector("#editEndDate").min = this.value;
    });

    document.querySelector("#editTargetAmount").addEventListener("input", function() {
        let targetAmount = Number(this.value);
        let currentAmount = Number(document.querySelector("#editCurrentAmount").value);

        // TARGET AMOUNT ERROR
        if (targetAmount > 0) {
            this.classList.remove("invalid");
            document.querySelector("#editGoalTargetError").classList.add("hidden");
        } else {
            document.querySelector("#editGoalTargetError").classList.remove("hidden");
            this.classList.add("invalid");
        }

        // CURRENT AMOUNT > TARGET AMOUNT ERROR
        if (currentAmount <= targetAmount) {
            document.querySelector("#editGoalAmountError").classList.add("hidden");
            document.querySelector("#editCurrentAmount").classList.remove("invalid");
        }
    });

    document.querySelector("#editCurrentAmount").addEventListener("input", function() {
        let currentAmount = Number(this.value);
        let targetAmount = Number(document.querySelector("#editTargetAmount").value);

        if (currentAmount <= targetAmount) {
            document.querySelector("#editGoalAmountError").classList.add("hidden");
            document.querySelector("#editCurrentAmount").classList.remove("invalid");
            document.querySelector("#editTargetAmount").classList.remove("invalid");
        }

        if (currentAmount >= 0) {
            document.querySelector("#editGoalAmountNegativeError").classList.add("hidden");
            this.classList.remove("invalid");
        }
    });

    document.querySelector("#editEndDate").addEventListener("change", function() {
        this.classList.remove("invalid");
    });

    // TRANSACTION FILTERS
    setupTransactionFilters();

    // GOAL MENU EVENTS
    setupGoalMenuEvents();
}


// TRANSACTION FILTERS

function setupTransactionFilters() {

    document.querySelector("#transactionGoalFilter").addEventListener("change", function() {
        activeTransactionGoal = this.value;
        renderTransactions();
    });

    document.querySelectorAll(".transactionFilter").forEach(function(button) {

        button.addEventListener("click", function() {

            activeTransactionType = this.dataset.filter;

            document.querySelectorAll(".transactionFilter").forEach(function(filterButton) {
                filterButton.classList.remove("active");
            });

            this.classList.add("active");

            renderTransactions();
        });
    });
}


// GOAL MENU EVENTS

function setupGoalMenuEvents() {

    document.addEventListener("click", function(event) {

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

                if (button.dataset.action === "transactions") {
                    activeTransactionGoal = cardId;
                    handleNavigation("transactions");
                }

                return;
            }

            closeAllGoalMenus(menu);
            menu.classList.toggle("hidden");

            return;
        }

        closeAllGoalMenus();
    });
}