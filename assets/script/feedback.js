// MONEY FEEDBACK
function showMoneyFeedback(type) {
    let feedbackContainer = document.querySelector("#moneyFeedback");
    feedbackContainer.innerHTML = "";
    let background = document.createElement("div");
    background.classList.add("moneyFeedbackBackground", type);
    feedbackContainer.appendChild(background);
    let addEmojis = ["😊", "🎉", "💰", "✨", "🥳"];
    let removeEmojis = ["😢", "😞", "💸", "😔", "🥀"];
    let emojis;
    if (type === "add") {
        emojis = addEmojis;
    } else {
        emojis = removeEmojis;
    }
    for (let i = 0; i < 10; i++) {
        let particle = document.createElement("span");
        particle.classList.add("moneyParticle");
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.setProperty("--moveX", (Math.random() * 500 - 250) + "px");
        particle.style.setProperty("--moveY", (Math.random() * -350 - 100) + "px");
        particle.style.setProperty("--scale", (Math.random() * 0.7 + 0.8).toFixed(2));
        particle.style.setProperty("--rotation", (Math.random() * 60 - 30) + "deg");
        particle.style.left = (Math.random() * 70 + 15) + "%";
        particle.style.top = (Math.random() * 25 + 55) + "%";
        particle.style.animationDelay = (Math.random() * 0.15) + "s";
        feedbackContainer.appendChild(particle);
    }
    setTimeout(function() {
        feedbackContainer.innerHTML = "";
    }, 1400);
}