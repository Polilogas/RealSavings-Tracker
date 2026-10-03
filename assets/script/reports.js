// REPORTS
// UPDATE REPORTS
function updateReports() {
    let totalSaved = 0;
    let totalAdded = 0;
    let totalRemoved = 0;
    let completedGoals = 0;
    let mostActiveGoal = "—";
    let mostActiveGoalTransactions = 0;
    let totalAddedTransactions = 0;
    let addedTransactionCount = 0;
    let monthlyAdded = 0;
    let monthlyRemoved = 0;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    for (let i = 0; i < saveSmartData.goals.length; i++) {
        let goal = saveSmartData.goals[i];

        totalSaved += Number(goal.currentAmount);

        if (Number(goal.currentAmount) >= Number(goal.targetAmount)) {
            completedGoals++;
        }
    }

    for (let i = 0; i < saveSmartData.goals.length; i++) {
        let goal = saveSmartData.goals[i];
        let transactionCount = 0;

        for (let j = 0; j < saveSmartData.transactions.length; j++) {
            if (saveSmartData.transactions[j].goalId === goal.id) {
                transactionCount++;
            }
        }

        if (transactionCount > mostActiveGoalTransactions) {
            mostActiveGoalTransactions = transactionCount;
            mostActiveGoal = goal.name;
        }
    }

    for (let i = 0; i < saveSmartData.transactions.length; i++) {
        let transaction = saveSmartData.transactions[i];
        let transactionDate = new Date(transaction.date);

        if (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
        ) {
            if (transaction.amount >= 0) {
                monthlyAdded += Number(transaction.amount);
            } else {
                monthlyRemoved += Math.abs(Number(transaction.amount));
            }
        }

        if (transaction.amount >= 0) {
            totalAdded += Number(transaction.amount);
            totalAddedTransactions += Number(transaction.amount);
            addedTransactionCount++;
        } else {
            totalRemoved += Math.abs(Number(transaction.amount));
        }
    }

    let averageAdded = addedTransactionCount > 0 ? totalAddedTransactions / addedTransactionCount : 0;
    let monthlySavings = monthlyAdded - monthlyRemoved;
    let monthlyTotals = {};

    for (let i = 0; i < saveSmartData.transactions.length; i++) {
        let transaction = saveSmartData.transactions[i];
        let transactionDate = new Date(transaction.date);
        let monthKey = transactionDate.getFullYear() + "-" + String(transactionDate.getMonth() + 1).padStart(2, "0");

        if (!monthlyTotals[monthKey]) {
            monthlyTotals[monthKey] = 0;
        }

        monthlyTotals[monthKey] += Number(transaction.amount);
    }

    let monthlySavingsTotal = 0;
    let monthlySavingsCount = 0;

    for (let month in monthlyTotals) {
        monthlySavingsTotal += monthlyTotals[month];
        monthlySavingsCount++;
    }

    let averageMonthlySavings = monthlySavingsCount > 0 ? monthlySavingsTotal / monthlySavingsCount : 0;

    let bestSavingMonth = "—";
    let bestSavingAmount = 0;

    for (let month in monthlyTotals) {
        if (monthlyTotals[month] > bestSavingAmount) {
            bestSavingAmount = monthlyTotals[month];

            let parts = month.split("-");
            let monthDate = new Date( Number(parts[0]), Number(parts[1]) - 1, 1);

            bestSavingMonth = monthDate.toLocaleDateString(undefined, {month: "long", year: "numeric"});
        }
    }

    document.querySelector("#reportTotalSaved").textContent = converNumberToCurrency(totalSaved) + " €";

    document.querySelector("#reportTotalAdded").textContent = converNumberToCurrency(totalAdded) + " €";

    document.querySelector("#reportTotalRemoved").textContent = converNumberToCurrency(totalRemoved) + " €";

    document.querySelector("#reportCompletedGoals").textContent = completedGoals;

    document.querySelector("#reportMostActiveGoal").textContent = mostActiveGoal;

    document.querySelector("#reportAverageAdded").textContent = converNumberToCurrency(averageAdded) + " €";

    document.querySelector("#reportMonthlySavings").textContent = converNumberToCurrency(monthlySavings) + " €";

    document.querySelector("#reportAverageMonthlySavings").textContent = converNumberToCurrency(averageMonthlySavings) + " €";

    document.querySelector("#reportBestSavingMonth").textContent = bestSavingMonth;

    document.querySelector("#reportBestSavingAmount").textContent = converNumberToCurrency(bestSavingAmount) + " €";

    renderReportGoalProgress();
    renderReportMoneyOverTime();
}


// REPORT GOAL PROGRESS
function renderReportGoalProgress() {
    let container = document.querySelector("#reportGoalProgress");

    container.innerHTML = "";

    if (saveSmartData.goals.length === 0) {
        container.innerHTML = `
            <div class="noTransactions">
                <p>
                    No savings goals yet.
                </p>
            </div>
        `;

        return;
    }

    for (let i = 0; i < saveSmartData.goals.length; i++) {
        let goal = saveSmartData.goals[i];
        let currentAmount = Number(goal.currentAmount);
        let targetAmount = Number(goal.targetAmount);
        let percentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

        percentage = Math.min(percentage, 100);

        let goalHTML = `
            <div class="reportGoal">
                <div class="reportGoalHeader">
                    <span class="reportGoalName">
                        ${escapeHTML(goal.name)}
                    </span>

                    <span class="reportGoalPercentage">
                        ${percentage.toFixed(0)}%
                    </span>
                </div>

                <div class="reportGoalAmounts">
                    <span>
                        ${converNumberToCurrency(currentAmount)} €
                    </span>

                    <span>
                        ${converNumberToCurrency(targetAmount)} €
                    </span>
                </div>

                <div class="reportGoalBar">
                    <div
                        class="reportGoalBarFill"
                        style="width: ${percentage}%;">
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", goalHTML);
    }
}


// REPORT MONEY OVER TIME
function renderReportMoneyOverTime() {
    let container = document.querySelector("#reportMoneyOverTime");

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

    let transactions = [...saveSmartData.transactions];

    transactions.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
    });

    let runningTotal = 0;
    let chartData = [];

    for (let i = 0; i < transactions.length; i++) {
        runningTotal += Number(transactions[i].amount);

        let transactionDate = new Date(transactions[i].date);
        let currentDate =
            transactionDate.getFullYear() +
            "-" +
            String(transactionDate.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(transactionDate.getDate()).padStart(2, "0");

        if (
            chartData.length > 0 &&
            chartData[chartData.length - 1].date === currentDate
        ) {
            chartData[chartData.length - 1].amount =
                roundMoney(runningTotal);
        } else {
            chartData.push({
                date: currentDate,
                amount: roundMoney(runningTotal)
            });
        }
    }

    let chartWidth = 800;
    let chartHeight = 280;
    let chartPadding = 55;
    let maxAmount = 0;

    for (let i = 0; i < chartData.length; i++) {
        if (chartData[i].amount > maxAmount) {
            maxAmount = chartData[i].amount;
        }
    }

    if (maxAmount === 0) {
        maxAmount = 1;
    }

    let points = "";

    for (let i = 0; i < chartData.length; i++) {
        let x;

        if (chartData.length === 1) {
            x = chartWidth / 2;
        } else {
            x =
                chartPadding +
                (i / (chartData.length - 1)) *
                (chartWidth - chartPadding * 2);
        }

        let y = chartHeight - chartPadding - (chartData[i].amount / maxAmount) * (chartHeight - chartPadding * 2);

        points += `${x},${y} `;
    }

    let chartHTML = `
        <svg
            viewBox="0 0 ${chartWidth} ${chartHeight}"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
        >
        <text
            x="0"
            y="${chartHeight - chartPadding + 5}"
            class="reportChartLabel">
            €0
        </text>

        <text
            x="0"
            y="${chartHeight / 2 + 5}"
            class="reportChartLabel">
            ${converNumberToCurrency(maxAmount / 2)} €
        </text>

        <text
            x="0"
            y="${chartPadding + 5}"
            class="reportChartLabel">
            ${converNumberToCurrency(maxAmount)} €
        </text>

            <line
                x1="${chartPadding}"
                y1="${chartHeight - chartPadding}"
                x2="${chartWidth - chartPadding}"
                y2="${chartHeight - chartPadding}"
                class="reportChartGrid">
            </line>

            <line
                x1="${chartPadding}"
                y1="${chartPadding}"
                x2="${chartWidth - chartPadding}"
                y2="${chartPadding}"
                class="reportChartGrid">
            </line>

            <line
                x1="${chartPadding}"
                y1="${chartHeight / 2}"
                x2="${chartWidth - chartPadding}"
                y2="${chartHeight / 2}"
                class="reportChartGrid">
            </line>

            <polyline
                points="${points}"
                class="reportChartLine">
            </polyline>

            ${chartData.map(function(item, index) {
                let x;

                if (chartData.length === 1) {
                    x = chartWidth / 2;
                } else {
                    x =
                        chartPadding +
                        (index / (chartData.length - 1)) *
                        (chartWidth - chartPadding * 2);
                }

                let y =
                    chartHeight -
                    chartPadding -
                    (item.amount / maxAmount) *
                    (chartHeight - chartPadding * 2);

                return `
                    <circle
                        cx="${x}"
                        cy="${y}"
                        r="5"
                        class="reportChartPoint">
                        <title>
                            ${new Date(item.date + "T00:00:00").toLocaleDateString(
                                undefined,
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                }
                            )} — ${converNumberToCurrency(item.amount)} €
                        </title>
                    </circle>
                `;
            }).join("")}

            ${chartData.map(function(item, index) {
                let x;

                if (chartData.length === 1) {
                    x = chartWidth / 2;
                } else {
                    x =
                        chartPadding +
                        (index / (chartData.length - 1)) *
                        (chartWidth - chartPadding * 2);
                }

                if (
                    chartData.length > 6 &&
                    index !== 0 &&
                    index !== chartData.length - 1 &&
                    index % Math.ceil(chartData.length / 5) !== 0
                ) {
                    return "";
                }

                return `
                    <text
                        x="${x}"
                        y="${chartHeight - 10}"
                        text-anchor="middle"
                        class="reportChartDate">
                        ${new Date(item.date + "T00:00:00").toLocaleDateString(
                            undefined,
                            {
                                day: "numeric",
                                month: "short"
                            }
                        )}
                    </text>
                `;
            }).join("")}

        </svg>
    `;

    container.innerHTML = chartHTML;
}