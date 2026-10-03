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