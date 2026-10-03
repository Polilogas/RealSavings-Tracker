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
    document.querySelector("#newGoalAmountError").classList.add("hidden");
    document.querySelector("#newGoalDateError").classList.add("hidden");
    document.querySelector("#newGoalTargetError").classList.add("hidden");
    document.querySelector("#newGoalAmountNegativeError").classList.add("hidden");
}