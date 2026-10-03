// TRANSACTIONS

// TRANSACTION GOAL FILTER
function updateTransactionGoalFilter() {
    let select = document.querySelector("#transactionGoalFilter");

    select.innerHTML = `
        <option value="all">All Goals</option>
    `;

    for (let i = 0; i < saveSmartData.goals.length; i++) {
        let goal = saveSmartData.goals[i];

        select.insertAdjacentHTML(
            "beforeend",
            `
                <option value="${goal.id}">
                    ${escapeHTML(goal.name)}
                </option>
            `
        );
    }

    select.value = activeTransactionGoal;
}

// RENDER TRANSACTIONS
function renderTransactions() {
    updateTransactionGoalFilter();

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

        if (
            activeTransactionType === "added" &&
            transaction.amount < 0
        ) {
            continue;
        }

        if (
            activeTransactionType === "removed" &&
            transaction.amount >= 0
        ) {
            continue;
        }

        if (
            activeTransactionGoal !== "all" &&
            transaction.goalId !== activeTransactionGoal
        ) {
            continue;
        }

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