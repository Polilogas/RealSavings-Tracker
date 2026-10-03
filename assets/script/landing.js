// LANDING PAGE CALCULATOR
let calculatorTarget = document.querySelector("#calculatorTarget");
let calculatorMonthly = document.querySelector("#calculatorMonthly");
let calculateSavingsButton = document.querySelector("#calculateSavingsButton");
let calculatorError = document.querySelector("#calculatorError");
let calculatorResultValue = document.querySelector("#calculatorResultValue");
let calculatorResultText = document.querySelector(".calculatorResult p");
let calculatorResultDate = document.querySelector("#calculatorResultDate");

// CALCULATE SAVINGS BUTTON
calculateSavingsButton.addEventListener("click", function() {
    calculateSavings();
});

// CALCULATE SAVINGS
function calculateSavings() {
    let target = Number(calculatorTarget.value);
    let monthly = Number(calculatorMonthly.value);

    if (target <= 0 || monthly <= 0) {
        return;
    }

    let months = Math.ceil(target / monthly);
    let completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + months);
    let completionDateText = completionDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });
    let years = Math.floor(months / 12);
    let remainingMonths = months % 12;
    let timeText = "";

    if (monthly > target) {
        timeText = "Less than 1 month";
        calculatorResultDate.textContent = "";

    } else if (years > 0) {
        timeText += years + (years === 1 ? " year" : " years");

        if (remainingMonths > 0) {
            timeText += " and " + remainingMonths + " " + (remainingMonths === 1 ? "month" : "months");
        }

    } else {
        timeText = months + (months === 1 ? " month" : " months");
    }

    calculatorResultValue.textContent = timeText;
    calculatorResultText.textContent = "At this rate, you could reach your savings goal in approximately " + timeText + ".";
    calculatorResultDate.textContent = "Estimated completion: " + completionDateText;
}

// CHECK CALCULATOR INPUTS
calculatorTarget.addEventListener("input", checkCalculatorInputs);
calculatorMonthly.addEventListener("input", checkCalculatorInputs);

function resetCalculatorResult() {
    calculatorResultValue.textContent = "—";
    calculatorResultText.textContent = "Enter your goal and monthly savings to see your estimated timeline.";
    calculatorResultDate.textContent = "";
}

function checkCalculatorInputs() {
    let target = Number(calculatorTarget.value);
    let monthly = Number(calculatorMonthly.value);
    calculatorError.style.display = "none";
    calculatorError.textContent = "";
    resetCalculatorResult();
    calculateSavingsButton.disabled = true;

    if (calculatorTarget.value === "" || calculatorMonthly.value === "") {
        return;
    }

    if (target <= 0 || monthly <= 0) {

        calculatorError.textContent = "You can't calculate savings using zero or negative numbers.";
        calculatorError.style.display = "block";

        return;
    }

    calculateSavingsButton.disabled = false;
}

checkCalculatorInputs();

// HERO GOAL DATES

function updateHeroGoalDates() {

    let today = new Date();

    let finishDate = new Date(today);
    finishDate.setDate(finishDate.getDate() + 302);

    let startDay = String(today.getDate()).padStart(2, "0");
    let startMonth = String(today.getMonth() + 1).padStart(2, "0");
    let startYear = today.getFullYear();

    let finishDay = String(finishDate.getDate()).padStart(2, "0");
    let finishMonth = String(finishDate.getMonth() + 1).padStart(2, "0");
    let finishYear = finishDate.getFullYear();

    document.querySelector("#heroGoalStartDate").textContent =
        "Start: " + startDay + "/" + startMonth + "/" + startYear;

    document.querySelector("#heroGoalFinishDate").textContent =
        "Finish: " + finishDay + "/" + finishMonth + "/" + finishYear;
}

updateHeroGoalDates();