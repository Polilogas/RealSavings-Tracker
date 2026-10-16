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
    let highestAmountAdded = 0;
    let highestAmountAddedTransaction = null;
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
            let amountAdded = Number(transaction.amount);
            totalAdded += amountAdded;
            totalAddedTransactions += amountAdded;
            addedTransactionCount++;

            if (amountAdded > highestAmountAdded) {
                highestAmountAdded = amountAdded;
                highestAmountAddedTransaction = transaction;
            }
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

    document.querySelector("#reportTotalSaved").textContent = formatCurrency(totalSaved);

    document.querySelector("#reportTotalAdded").textContent = formatCurrency(totalAdded);

    document.querySelector("#reportTotalRemoved").textContent = formatCurrency(totalRemoved);

    document.querySelector("#reportHighestAmountAdded").textContent = formatCurrency(highestAmountAdded);

    let highestAmountGoal = "No contributions yet";

    if (highestAmountAddedTransaction) {
        let goal = saveSmartData.goals.find(function(item) {
            return item.id === highestAmountAddedTransaction.goalId;
        });

        highestAmountGoal = `Added to ${goal?.name || highestAmountAddedTransaction.goalName || "Unknown goal"}`;
    }

    document.querySelector("#reportHighestAmountGoal").textContent = highestAmountGoal;

    document.querySelector("#reportCompletedGoals").textContent = completedGoals;

    document.querySelector("#reportMostActiveGoal").textContent = mostActiveGoal;

    document.querySelector("#reportAverageAdded").textContent = formatCurrency(averageAdded);

    document.querySelector("#reportMonthlySavings").textContent = formatCurrency(monthlySavings);

    document.querySelector("#reportAverageMonthlySavings").textContent = formatCurrency(averageMonthlySavings);

    document.querySelector("#reportBestSavingMonth").textContent = bestSavingMonth;

    document.querySelector("#reportBestSavingAmount").textContent = formatCurrency(bestSavingAmount);

    renderReportGoalProgress();
    renderReportMoneyOverTime();
    renderSavingsCalendar();
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
            let todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            let endParts = goal.endDate.split("-");
            let endDate = new Date(Number(endParts[0]), Number(endParts[1]) - 1, Number(endParts[2]));

            daysRemaining = Math.ceil((endDate - todayDate) / (1000 * 60 * 60 * 24));
        }

        // STATUS TEXT
        let statusText = "";

        if (isCompleted) {
            statusText = "Goal reached";

        } else if (daysRemaining === null) {
            statusText = "No deadline";
        } else if (daysRemaining > 1) {
            statusText = `${daysRemaining} days left`;
        } else if (daysRemaining === 1) {
            statusText = "1 day left";
        } else if (daysRemaining === 0) {
            statusText = "Due today";
        } else if (daysRemaining === -1) {
            statusText = "1 day overdue";
        } else {
            statusText = `${Math.abs(daysRemaining)} days overdue`;
        }

        let goalHTML = `
            <div class="reportGoal ${isCompleted ? "reportGoalCompleted" : ""}">
                <div class="reportGoalHeader">
                    <span class="reportGoalName">${escapeHTML(goal.name)}</span>
                    <span class="reportGoalPercentage">${isCompleted ? "COMPLETED" : `${percentage.toFixed(0)}%`}</span>
                </div>

                <div class="reportGoalAmounts">
                    <span>${formatCurrency(currentAmount)} saved of ${formatCurrency(targetAmount)}</span>
                </div>


                <div class="reportGoalBar">
                    <div class="reportGoalBarFill" style="width: ${percentage}%;"></div>
                </div>


                <div class="reportGoalFooter">
                    <span>${isCompleted ? "Goal reached" : `${formatCurrency(remainingAmount)} remaining`}</span>
                    <span>${statusText}</span>
                </div>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", goalHTML);
    }
}


// MONEY OVER TIME
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

    // DETERMINE CHART PERIOD
    let firstDate = new Date(transactions[0].date);
    let lastDate = new Date(
        transactions[transactions.length - 1].date
    );

    let historyDays = Math.ceil(
        (lastDate - firstDate) / (1000 * 60 * 60 * 24)
    );

    let chartPeriod = "daily";

    if (historyDays > 180) {
        chartPeriod = "monthly";
    } else if (historyDays > 30) {
        chartPeriod = "weekly";
    }

    // BUILD CHART DATA
    let runningTotal = 0;
    let chartData = [];

    for (let i = 0; i < transactions.length; i++) {

        runningTotal += Number(transactions[i].amount);

        let transactionDate = new Date(transactions[i].date);

        let periodKey = "";

        if (chartPeriod === "daily") {

            periodKey =
                transactionDate.getFullYear() +
                "-" +
                String(transactionDate.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(transactionDate.getDate()).padStart(2, "0");

        } else if (chartPeriod === "weekly") {

            let weekDate = new Date(transactionDate);

            let day = weekDate.getDay();

            let difference = day === 0 ? -6 : 1 - day;

            weekDate.setDate(
                weekDate.getDate() + difference
            );

            periodKey =
                weekDate.getFullYear() +
                "-" +
                String(weekDate.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(weekDate.getDate()).padStart(2, "0");

        } else {

            periodKey =
                transactionDate.getFullYear() +
                "-" +
                String(transactionDate.getMonth() + 1).padStart(2, "0");

        }

        if (
            chartData.length > 0 &&
            chartData[chartData.length - 1].period === periodKey
        ) {

            chartData[chartData.length - 1].amount =
                roundMoney(runningTotal);

        } else {

            chartData.push({
                period: periodKey,
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

        let y =
            chartHeight -
            chartPadding -
            (chartData[i].amount / maxAmount) *
            (chartHeight - chartPadding * 2);

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
            ${formatCurrency(0)}
        </text>

        <text
            x="0"
            y="${chartHeight / 2 + 5}"
            class="reportChartLabel">
            ${formatCurrency(maxAmount / 2)}
        </text>

        <text
            x="0"
            y="${chartPadding + 5}"
            class="reportChartLabel">
            ${formatCurrency(maxAmount)}
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

            let tooltipDate = new Date(
                item.period + "T00:00:00"
            );

            if (chartPeriod === "monthly") {

                let parts = item.period.split("-");

                tooltipDate = new Date(
                    Number(parts[0]),
                    Number(parts[1]) - 1,
                    1
                );
            }

            return `
                <circle
                    cx="${x}"
                    cy="${y}"
                    r="5"
                    class="reportChartPoint">

                    <title>
                        ${tooltipDate.toLocaleDateString(
                            undefined,
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            }
                        )} — ${formatCurrency(item.amount)}
                    </title>

                </circle>
            `;

        }).join("")}

        ${chartData.map(function(item, index) {
            let x;

            if (chartData.length === 1) {
                x = chartWidth / 2;
            } else {
                x = chartPadding + (index / (chartData.length - 1)) * (chartWidth - chartPadding * 2);
            }

            if ( chartData.length > 6 && index !== 0 && index !== chartData.length - 1 && index % Math.ceil(chartData.length / 5) !== 0 ) {
                return "";
            }

            let labelDate;

            if (chartPeriod === "monthly") {
                let parts = item.period.split("-");

                labelDate = new Date( Number(parts[0]), Number(parts[1]) - 1, 1);

            } else {
                labelDate = new Date(item.period + "T00:00:00");
            }

            return `
                <text
                    x="${x}"
                    y="${chartHeight - 10}"
                    text-anchor="middle"
                    class="reportChartDate">
                    ${labelDate.toLocaleDateString(
                        undefined,
                        chartPeriod === "monthly"
                            ? {
                                month: "short",
                                year: "numeric"
                            }
                            : {
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

// SAVINGS CALENDAR
let savingsCalendarView = "yearly";
let savingsCalendarYear = new Date().getFullYear();
let savingsCalendarMonth = new Date().getMonth();
let savingsCalendarSelectedDate = calendarDateKey(new Date());
let savingsCalendarEventsBound = false;

function calendarDateKey(date) {
    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");
}

function calendarDateFromKey(dateKey) {
    let parts = dateKey.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function calendarDateForTransaction(transaction) {
    let date = new Date(transaction.date);
    return Number.isNaN(date.getTime()) ? "" : calendarDateKey(date);
}

function calendarMonthKey(year, month) {
    return year + "-" + String(month + 1).padStart(2, "0");
}

function calendarFormatDate(dateKey, options = { day: "numeric", month: "long", year: "numeric" }) {
    return calendarDateFromKey(dateKey).toLocaleDateString(undefined, options);
}

function calendarStartOfWeek(date) {
    let start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let offset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - offset);
    return start;
}

function calendarTransactionsByDate() {
    let byDate = {};

    (saveSmartData.transactions || []).forEach(function(transaction) {
        let dateKey = calendarDateForTransaction(transaction);
        if (!dateKey) return;

        if (!byDate[dateKey]) {
            byDate[dateKey] = { transactions: [], added: 0, withdrawn: 0 };
        }

        let amount = Number(transaction.amount);
        byDate[dateKey].transactions.push(transaction);

        if (amount > 0) {
            byDate[dateKey].added += amount;
        } else if (amount < 0) {
            byDate[dateKey].withdrawn += Math.abs(amount);
        }
    });

    return byDate;
}

function calendarVisibleDateRange() {
    if (savingsCalendarView === "monthly") {
        return {
            start: calendarDateKey(new Date(savingsCalendarYear, savingsCalendarMonth, 1)),
            end: calendarDateKey(new Date(savingsCalendarYear, savingsCalendarMonth + 1, 0))
        };
    }

    if (savingsCalendarView === "week") {
        let start = calendarStartOfWeek(new Date());
        let end = new Date(start);
        end.setDate(end.getDate() + 6);
        return { start: calendarDateKey(start), end: calendarDateKey(end) };
    }

    return {
        start: calendarDateKey(new Date(savingsCalendarYear, 0, 1)),
        end: calendarDateKey(new Date(savingsCalendarYear, 11, 31))
    };
}

function calendarHeatColor(added, withdrawn, maximum) {
    let intensity = maximum > 0 ? Math.max(0.12, Math.min(1, Math.max(added, withdrawn) / maximum)) : 0;
    let lightness = Math.round(97 - intensity * 25);

    if (added > 0 && withdrawn > 0) {
        let depositLightness = Math.round(97 - Math.max(0.12, added / maximum) * 25);
        let withdrawalLightness = Math.round(97 - Math.max(0.12, withdrawn / maximum) * 25);
        return "background: linear-gradient(135deg, hsl(138, 48%, " + depositLightness + "%), hsl(0, 76%, " + withdrawalLightness + "%));";
    }

    if (added > 0) {
        return "background-color: hsl(138, 48%, " + lightness + "%);";
    }

    if (withdrawn > 0) {
        return "background-color: hsl(0, 76%, " + lightness + "%);";
    }

    return "";
}

function calendarDayButton(dateKey, totals, maximum, compact) {
    let dayNumber = calendarDateFromKey(dateKey).getDate();
    let activity = totals[dateKey] || { added: 0, withdrawn: 0, transactions: [] };
    let classes = ["calendarDay"];

    if (compact) classes.push("compact");
    if (activity.added > 0) classes.push("hasDeposit");
    if (activity.withdrawn > 0) classes.push("hasWithdrawal");
    if (dateKey === savingsCalendarSelectedDate) classes.push("selected");

    let description = calendarFormatDate(dateKey);
    if (activity.added) description += ", added " + formatCurrency(activity.added);
    if (activity.withdrawn) description += ", withdrew " + formatCurrency(activity.withdrawn);

    return '<button type="button" class="' + classes.join(" ") + '" data-calendar-date="' + dateKey +
        '" aria-label="' + escapeHTML(description) + '" title="' + escapeHTML(description) + '" style="' +
        calendarHeatColor(activity.added, activity.withdrawn, maximum) + '">' +
        '<span>' + dayNumber + '</span>' +
        '</button>';
}
function calendarMonthMarkup(year, month, totals, maximum, isBestMonth) {
    let firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let monthKey = calendarMonthKey(year, month);
    let monthNet = 0;

    Object.keys(totals).forEach(function(dateKey) {
        if (dateKey.slice(0, 7) === monthKey) {
            monthNet += totals[dateKey].added - totals[dateKey].withdrawn;
        }
    });

    let dayHeadings = ["M", "T", "W", "T", "F", "S", "S"].map(function(day) {
        return '<span class="calendarWeekday" aria-hidden="true">' + day + '</span>';
    }).join("");

    let cells = [];
    for (let blank = 0; blank < firstDay; blank++) {
        cells.push('<span class="calendarDaySpacer" aria-hidden="true"></span>');
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dateKey = calendarDateKey(new Date(year, month, day));
        cells.push(calendarDayButton(dateKey, totals, maximum, true));
    }

    let bestLabel = isBestMonth ? '<span class="calendarBestMonthLabel">Most saved</span>' : "";
    let bestClass = isBestMonth ? " mostSavedMonth" : "";

    return '<article class="calendarMonth' + bestClass + '">' +
        '<div class="calendarMonthHeader">' +
            '<button type="button" class="calendarMonthJump" data-calendar-month="' + monthKey + '">' +
                new Date(year, month, 1).toLocaleDateString(undefined, { month: "long" }) +
            '</button>' +
            bestLabel +
        '</div>' +
        '<div class="calendarMonthNet">' + formatCurrency(monthNet) + ' net</div>' +
        '<div class="calendarMonthGrid compactGrid">' + dayHeadings + cells.join("") + '</div>' +
    '</article>';
}
function calendarMonthSummary(year, month, totals) {
    let added = 0;
    let withdrawn = 0;
    let prefix = calendarMonthKey(year, month);

    Object.keys(totals).forEach(function(dateKey) {
        if (dateKey.slice(0, 7) === prefix) {
            added += totals[dateKey].added;
            withdrawn += totals[dateKey].withdrawn;
        }
    });

    return { added: added, withdrawn: withdrawn, net: added - withdrawn };
}

function renderSavingsCalendar() {
    let section = document.querySelector("#savingsCalendarSection");
    if (!section) return;

    if (!savingsCalendarEventsBound) {
        section.addEventListener("click", handleSavingsCalendarClick);
        document.querySelector("#calendarMonthPicker").addEventListener("change", function(event) {
            let parts = event.target.value.split("-").map(Number);
            if (!parts[0] || !parts[1]) return;
            savingsCalendarYear = parts[0];
            savingsCalendarMonth = parts[1] - 1;
            savingsCalendarView = "monthly";
            renderSavingsCalendar();
        });
        savingsCalendarEventsBound = true;
    }

    let totals = calendarTransactionsByDate();
    let range = calendarVisibleDateRange();
    let maximum = 0;

    Object.keys(totals).forEach(function(dateKey) {
        if (dateKey >= range.start && dateKey <= range.end) {
            maximum = Math.max(maximum, totals[dateKey].added, totals[dateKey].withdrawn);
        }
    });

    let periodTitle = document.querySelector("#calendarPeriodTitle");
    let previousButton = document.querySelector('[data-calendar-action="previous"]');
    let nextButton = document.querySelector('[data-calendar-action="next"]');
    let monthPicker = document.querySelector("#calendarMonthPicker");
    let yearView = savingsCalendarView === "yearly";
    let monthView = savingsCalendarView === "monthly";
    let weekView = savingsCalendarView === "week";

    document.querySelectorAll("[data-calendar-view]").forEach(function(button) {
        let active = button.dataset.calendarView === savingsCalendarView;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    previousButton.classList.toggle("hidden", weekView);
    nextButton.classList.toggle("hidden", weekView);
    monthPicker.classList.toggle("hidden", !monthView);
    monthPicker.value = calendarMonthKey(savingsCalendarYear, savingsCalendarMonth);

    if (yearView) {
        periodTitle.textContent = String(savingsCalendarYear);
        periodTitle.classList.remove("hidden");
    } else if (monthView) {
        periodTitle.textContent = new Date(savingsCalendarYear, savingsCalendarMonth, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
        periodTitle.classList.add("hidden");
    } else {
        periodTitle.textContent = calendarFormatDate(range.start, { day: "numeric", month: "short" }) + " – " +
            calendarFormatDate(range.end, { day: "numeric", month: "short", year: "numeric" });
        periodTitle.classList.remove("hidden");
    }

    let monthlyNets = [];
    if (yearView) {
        for (let month = 0; month < 12; month++) {
            let summary = calendarMonthSummary(savingsCalendarYear, month, totals);
            monthlyNets.push({ month: month, net: summary.net });
        }
    }

    let mostSaved = monthlyNets.reduce(function(best, item) {
        return item.net > best.net ? item : best;
    }, { month: -1, net: 0 });

    let highlights = document.querySelector("#calendarHighlights");
    if (yearView) {
        highlights.innerHTML = mostSaved.month >= 0
            ? '<div class="calendarHighlight"><span>Most saved this year</span><strong>' +
                new Date(savingsCalendarYear, mostSaved.month, 1).toLocaleDateString(undefined, { month: "long" }) +
                ' · ' + formatCurrency(mostSaved.net) + '</strong></div>'
            : '<div class="calendarHighlight"><span>Most saved this year</span><strong>No deposits recorded yet</strong></div>';
    } else {
        let summary = monthView
            ? calendarMonthSummary(savingsCalendarYear, savingsCalendarMonth, totals)
            : Object.keys(totals).reduce(function(result, dateKey) {
                if (dateKey >= range.start && dateKey <= range.end) {
                    result.added += totals[dateKey].added;
                    result.withdrawn += totals[dateKey].withdrawn;
                }
                return result;
            }, { added: 0, withdrawn: 0 });
        summary.net = summary.added - summary.withdrawn;
        highlights.innerHTML = '<div class="calendarHighlight"><span>Added</span><strong>' + formatCurrency(summary.added) +
            '</strong></div><div class="calendarHighlight"><span>Withdrawn</span><strong>' + formatCurrency(summary.withdrawn) +
            '</strong></div><div class="calendarHighlight"><span>Net savings</span><strong>' + formatCurrency(summary.net) + '</strong></div>';
    }

    let calendar = document.querySelector("#savingsCalendar");
    if (yearView) {
        calendar.className = "savingsCalendar yearlyCalendar";
        calendar.innerHTML = Array.from({ length: 12 }, function(_, month) {
            return calendarMonthMarkup(savingsCalendarYear, month, totals, maximum, mostSaved.month === month && mostSaved.net > 0);
        }).join("");
    } else if (monthView) {
        calendar.className = "savingsCalendar singleMonthCalendar";
        calendar.innerHTML = '<div class="calendarMonthGrid fullMonthGrid">' +
            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(function(day) {
                return '<span class="calendarWeekday">' + day + '</span>';
            }).join("") +
            calendarMonthCells(savingsCalendarYear, savingsCalendarMonth, totals, maximum) +
            '</div>';
    } else {
        calendar.className = "savingsCalendar weekCalendar";
        let start = calendarDateFromKey(range.start);
        calendar.innerHTML = Array.from({ length: 7 }, function(_, index) {
            let date = new Date(start);
            date.setDate(date.getDate() + index);
            let dateKey = calendarDateKey(date);
            let activity = totals[dateKey] || { added: 0, withdrawn: 0, transactions: [] };
            return '<div class="calendarWeekCard">' +
                '<span class="calendarWeekday">' + date.toLocaleDateString(undefined, { weekday: "short" }) + '</span>' +
                calendarDayButton(dateKey, totals, maximum, false) +
                '<small>' + (activity.added ? '+' + formatCurrency(activity.added) : '—') + '</small>' +
                (activity.withdrawn ? '<small class="withdrawalText">−' + formatCurrency(activity.withdrawn) + '</small>' : '') +
            '</div>';
        }).join("");
    }

    renderCalendarDateDetails(totals);
}

function calendarMonthCells(year, month, totals, maximum) {
    let offset = (new Date(year, month, 1).getDay() + 6) % 7;
    let days = new Date(year, month + 1, 0).getDate();
    let html = "";

    for (let blank = 0; blank < offset; blank++) {
        html += '<span class="calendarDaySpacer" aria-hidden="true"></span>';
    }

    for (let day = 1; day <= days; day++) {
        let key = calendarDateKey(new Date(year, month, day));
        html += calendarDayButton(key, totals, maximum, false);
    }

    return html;
}

function renderCalendarDateDetails(totals) {
    let selectedKey = savingsCalendarSelectedDate;
    let dateTotals = totals[selectedKey] || { added: 0, withdrawn: 0, transactions: [] };

    document.querySelector("#calendarSelectedDate").textContent =
        calendarFormatDate(selectedKey, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    let summaryParts = [];
    if (dateTotals.added) summaryParts.push("Added " + formatCurrency(dateTotals.added));
    if (dateTotals.withdrawn) summaryParts.push("Withdrawn " + formatCurrency(dateTotals.withdrawn));
    document.querySelector("#calendarSelectedDateSummary").textContent =
        summaryParts.length ? summaryParts.join(" · ") : "No savings activity on this date.";

    let transactions = dateTotals.transactions.slice().sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    let rows = transactions.map(function(transaction) {
        let amount = Number(transaction.amount);
        let goal = saveSmartData.goals.find(function(item) { return item.id === transaction.goalId; });
        let goalName = goal?.name || transaction.goalName || "Savings goal";
        let isDeposit = amount >= 0;
        return '<div class="calendarTransactionRow ' + (isDeposit ? "deposit" : "withdrawal") + '">' +
            '<span class="calendarTransactionType">' + (isDeposit ? "Added" : "Withdrawn") + '</span>' +
            '<span class="calendarTransactionGoal">' + escapeHTML(goalName) + '</span>' +
            '<strong>' + (isDeposit ? "+" : "−") + formatCurrency(Math.abs(amount)) + '</strong>' +
            '</div>';
    });

    document.querySelector("#calendarDateTransactions").innerHTML = rows.length
        ? rows.join("")
        : '<p class="calendarEmptyState">No transactions on this date.</p>';
}
function handleSavingsCalendarClick(event) {
    let viewButton = event.target.closest("[data-calendar-view]");
    if (viewButton) {
        savingsCalendarView = viewButton.dataset.calendarView;
        renderSavingsCalendar();
        return;
    }

    let monthButton = event.target.closest("[data-calendar-month]");
    if (monthButton) {
        let parts = monthButton.dataset.calendarMonth.split("-").map(Number);
        savingsCalendarYear = parts[0];
        savingsCalendarMonth = parts[1] - 1;
        savingsCalendarView = "monthly";
        renderSavingsCalendar();
        return;
    }

    let dateButton = event.target.closest("[data-calendar-date]");
    if (dateButton) {
        savingsCalendarSelectedDate = dateButton.dataset.calendarDate;
        renderSavingsCalendar();
        return;
    }

    let actionButton = event.target.closest("[data-calendar-action]");
    if (actionButton) {
        if (savingsCalendarView === "yearly") {
            savingsCalendarYear += actionButton.dataset.calendarAction === "next" ? 1 : -1;
        } else if (savingsCalendarView === "monthly") {
            let monthDate = new Date(savingsCalendarYear, savingsCalendarMonth +
                (actionButton.dataset.calendarAction === "next" ? 1 : -1), 1);
            savingsCalendarYear = monthDate.getFullYear();
            savingsCalendarMonth = monthDate.getMonth();
        }
        renderSavingsCalendar();
    }
}

