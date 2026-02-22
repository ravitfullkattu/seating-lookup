// Ensure these variables match your API URL and your search modes
const apiBaseUrl = 'https://seating-app-backend-cw7q.onrender.com'; // Update this URL to your deployed API

// Ensure these variables match your API URL and your search modes
const apiBaseUrl = 'https://seating-lookup-api.onrender.com'; // Update this URL to your deployed API

const searchByNameButton = document.getElementById('search-by-name');
const searchByTableButton = document.getElementById('search-by-table');

const nameSearchSection = document.getElementById('name-search');
const tableSearchSection = document.getElementById('table-search');

const nameSearchButton = document.getElementById('name-search-btn');
const tableSearchButton = document.getElementById('table-search-btn');

const resultsSection = document.getElementById('results');
const resultsTableBody = document.querySelector("#results-table tbody");
const loadingIndicator = document.getElementById("loading");

const nameInput = document.getElementById("name-input");
const tableInput = document.getElementById("table-input");

// Toggle search mode
searchByNameButton.addEventListener("click", () => {
    searchByNameButton.classList.add("active");
    searchByTableButton.classList.remove("active");
    nameSearchSection.classList.remove("hidden");
    tableSearchSection.classList.add("hidden");
});

searchByTableButton.addEventListener("click", () => {
    searchByTableButton.classList.add("active");
    searchByNameButton.classList.remove("active");
    tableSearchSection.classList.remove("hidden");
    nameSearchSection.classList.add("hidden");
});

// Handle search by name
nameSearchButton.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    if (!name) return alert("Please enter a name!");

    resultsSection.classList.add("hidden");
    loadingIndicator.classList.remove("hidden");

    try {
        const response = await fetch(`${apiBaseUrl}/api/people?name=${name}`);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

// Handle search by table
tableSearchButton.addEventListener("click", async () => {
    const tableNumber = tableInput.value.trim();
    if (!tableNumber) return alert("Please enter a table number!");

    resultsSection.classList.add("hidden");
    loadingIndicator.classList.remove("hidden");

    try {
        const response = await fetch(`${apiBaseUrl}/api/table/${tableNumber}`);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

// Display results
function displayResults(data) {
    loadingIndicator.classList.add("hidden");
    resultsSection.classList.remove("hidden");

    if (data.length === 0) {
        resultsTableBody.innerHTML = "<tr><td colspan='3'>No results found</td></tr>";
    } else {
        data.sort((a, b) => a.lastname.localeCompare(b.lastname)); // Sort by last name
        data.forEach(person => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${person.firstname}</td>
                <td>${person.lastname}</td>
                <td>${person.tablenumber}</td>
            `;
            resultsTableBody.appendChild(row);
        });
    }
}

// Version number in the footer
document.getElementById('footer').innerHTML = 'Version: 1.0.0';