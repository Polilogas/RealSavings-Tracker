// CLEAR MONEY INPUTS
function clearMoneyInputs() {
    document.querySelector("#addMoney").value = "";
    document.querySelector("#addTotalMoney").value = "";
    document.querySelector("#removeMoney").value = "";
    document.querySelector("#updateTotalMoney").value = "";
    document.querySelector("#removeMoneyWindow input[type='button']").disabled = false;
}