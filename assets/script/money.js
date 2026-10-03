// MONEY INPUT TO NUMBER
function getMoneyInputValue(input) {
    return Number(input.value.replace(",", "."));
}


// MONEY ROUNDING
function roundMoney(amount) {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
}