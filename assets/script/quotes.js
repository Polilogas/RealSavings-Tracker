// QUOTES
const quotes = [
    { text: "A goal without a plan is just a wish.", author: "Often attributed to Antoine de Saint-Exupéry" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "Do something today that your future self will thank you for.", author: "Unknown" },
    { text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

// RANDOM QUOTE
function updateRandomQuote() {
    let quoteElement = document.querySelector("#sidebarQuoteText");
    let authorElement = document.querySelector("#sidebarQuoteAuthor");

    if (!quoteElement || !authorElement) {
        return;
    }

    let randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.textContent = quotes[randomIndex].text;
    authorElement.textContent = "— " + quotes[randomIndex].author;
}