// GOALS
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
        let currentAmount = Number(goal.currentAmount);
        let targetAmount = Number(goal.targetAmount);
        let percentage = 0;

        if (targetAmount > 0) {
            percentage = (currentAmount / targetAmount) * 100;
        }
        percentage = Math.min(percentage, 100);
        let remainingAmount = Math.max(
            targetAmount - currentAmount,
            0
        );
        let isCompleted = percentage >= 100;

        // DAYS REMAINING
        let daysRemaining = null;

        if (goal.endDate) {
            let today = new Date();
            let todayDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );
            let endParts = goal.endDate.split("-");
            let endDate = new Date(
                Number(endParts[0]),
                Number(endParts[1]) - 1,
                Number(endParts[2])
            );
            daysRemaining = Math.ceil(
                (endDate - todayDate) / (1000 * 60 * 60 * 24)
            );
            daysRemaining = Math.max(daysRemaining, 0);
        }

        // MONTHLY SAVING NEEDED
        let monthlySaving = 0;

        if (
            !isCompleted &&
            daysRemaining !== null &&
            daysRemaining > 0 &&
            remainingAmount > 0
        ) {
            let monthsRemaining = daysRemaining / 30.44;
            monthlySaving =
                remainingAmount / monthsRemaining;
        }

        // DATE FORMATTING
        let startDateText = goal.startDate
            ? new Date(goal.startDate + "T00:00:00").toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
            : "";
        let endDateText = goal.endDate
            ? new Date(goal.endDate + "T00:00:00").toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
            : "";
        let remainingText = isCompleted
            ? "Goal completed"
            : `€${converNumberToCurrency(remainingAmount)} remaining`;
        let deadlineHTML = "";

        if (isCompleted) {
            deadlineHTML = `
                <div class="goalCardStat">
                    <span>STATUS</span>
                    <strong>Completed</strong>
                </div>
            `;
        } else if (daysRemaining !== null) {
            deadlineHTML = `
                <div class="goalCardStat">
                    <span>TIME LEFT</span>
                    <strong>${daysRemaining} days</strong>
                </div>
            `;
        } else {
            deadlineHTML = `
                <div class="goalCardStat">
                    <span>DEADLINE</span>
                    <strong>No deadline</strong>
                </div>
            `;
        }
        let monthlySavingHTML = "";

        if (!isCompleted && daysRemaining !== null && daysRemaining > 0) {
            monthlySavingHTML = `
                <div class="goalCardStat">
                    <span>NEEDED / MONTH</span>
                    <strong>€${converNumberToCurrency(monthlySaving)}</strong>
                </div>
            `;
        } else if (!isCompleted) {
            monthlySavingHTML = `
                <div class="goalCardStat">
                    <span>SAVING PLAN</span>
                    <strong>Set a deadline</strong>
                </div>
            `;
        } else {
            monthlySavingHTML = `
                <div class="goalCardStat">
                    <span>REMAINING</span>
                    <strong>€0.00</strong>
                </div>
            `;
        }
        let newGoal = `
            <div
                id="${escapeHTML(goal.id)}"
                class="card goalCard ${isCompleted ? "goalCompleted" : ""}">
                <div class="goalCardHeader">
                    <div class="goalCardIdentity">
                        <div class="goalCardImage">
                            <img
                                src="${goal.image}"
                                alt="Image for ${escapeHTML(goal.name)}"
                                draggable="false">
                        </div>
                        <div class="goalCardTitle">
                            <p class="goalTitle">
                                ${escapeHTML(goal.name)}
                            </p>
                            <p class="goalSubtitle">
                                ${escapeHTML(goal.subtitle)}
                            </p>
                        </div>
                    </div>
                    <div class="goal-options">
                        <p aria-label="More options">...</p>
                        <div class="goal-options-menu hidden">
                            <button
                                type="button"
                                data-action="edit">
                                Edit
                            </button>
                            <button
                                type="button"
                                data-action="transactions">
                                View Transactions
                            </button>
                            <button
                                type="button"
                                data-action="delete">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                <div class="goalCardProgressHeader">
                    <span>
                        ${isCompleted ? "GOAL COMPLETED" : `${percentage.toFixed(0)}% complete`}
                    </span>
                </div>
                <div class="goalCardProgressBar">
                    <div
                        class="goalCardProgressFill"
                        style="width: ${percentage}%">
                    </div>
                </div>
                <div class="goalCardAmounts">
                    <div>
                        <span>SAVED</span>
                        <strong>
                            €${converNumberToCurrency(currentAmount)}
                        </strong>
                    </div>
                    <div>
                        <span>TARGET</span>
                        <strong>
                            €${converNumberToCurrency(targetAmount)}
                        </strong>
                    </div>
                </div>
                <div class="goalCardStats">
                    <div class="goalCardStat">
                        <span>REMAINING</span>
                        <strong>
                            ${remainingText}
                        </strong>
                    </div>
                    ${deadlineHTML}
                    ${monthlySavingHTML}
                </div>
                <div class="goalCardDates">
                    <span>
                        Started ${startDateText}
                    </span>
                    ${
                        endDateText
                            ? `<span>Target ${endDateText}</span>`
                            : ""
                    }
                </div>
                <div class="goalCardActions">
                    <button
                        class="addMoney"
                        type="button"
                        onclick="addMoney('${goal.id}')">
                        <span>+</span>
                        Add Money
                    </button>
                    <button
                        class="removeMoney"
                        type="button"
                        onclick="removeMoney('${goal.id}')">
                        <span class="minus">-</span>
                        Remove Money
                    </button>
                </div>
            </div>
        `;
        goalsContainer.insertAdjacentHTML(
            "beforeend",
            newGoal
        );
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
    clearNewGoalForm();
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

    if (currentAmount > targetAmount) {
        document.querySelector("#newGoalAmountError").classList.remove("hidden");
        valid = false;
    } else {
        document.querySelector("#newGoalAmountError").classList.add("hidden");
    }

    if (endDate !== "" && endDate < startDate) {
        document.querySelector("#newGoalDateError").classList.remove("hidden");
        valid = false;
    } else {
        document.querySelector("#newGoalDateError").classList.add("hidden");
    }

    if (targetAmount <= 0 || document.querySelector("#targetAmountInput").value === "") {
        document.querySelector("#newGoalTargetError").classList.remove("hidden");
        valid = false;
    } else {
        document.querySelector("#newGoalTargetError").classList.add("hidden");
    }

    if (currentAmount < 0) {
        document.querySelector("#newGoalAmountNegativeError").classList.remove("hidden");
        valid = false;
    } else {
        document.querySelector("#newGoalAmountNegativeError").classList.add("hidden");
    }

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
    document.querySelector("#editGoalAmountError").classList.add("hidden");
    document.querySelector("#editGoalAmountNegativeError").classList.add("hidden");
    let editInputs = document.querySelectorAll("#editGoalWindow .invalid");
    for (let i = 0; i < editInputs.length; i++) {
        editInputs[i].classList.remove("invalid");
    }
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
        document.querySelector("#editGoalTargetError").classList.remove("hidden");
        valid = false;
    } else {
        document.querySelector("#editGoalTargetError").classList.add("hidden");
    }

    if (newCurrentAmount > newTargetAmount) {
        document.querySelector("#editCurrentAmount").classList.add("invalid");
        document.querySelector("#editTargetAmount").classList.add("invalid");
        document.querySelector("#editGoalAmountError").classList.remove("hidden");
        valid = false;
    } else {
        document.querySelector("#editGoalAmountError").classList.add("hidden");
    }

    if (newCurrentAmount < 0) {
        document.querySelector("#editCurrentAmount").classList.add("invalid");
        document.querySelector("#editGoalAmountNegativeError").classList.remove("hidden");
        valid = false;
    } else {
        document.querySelector("#editGoalAmountNegativeError").classList.add("hidden");
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