window.onload = loaded;

const entriesTableBody = document.querySelector("#entries-table tbody");

/**
 * Simple Function that will be run when the browser is finished loading.
 */
function loaded() {
    // Assign to a variable so we can set a breakpoint in the debugger!
    const hello = sayHello();
    console.log(hello);

    // Load entries when the page loads
    loadEntries();
}

/**
 * This function returns the string 'hello'
 * @return {string} the string hello
 */
export function sayHello() {
    return 'hello';
}

// Function to load all entries from the database
function loadEntries() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://dss1akncn5.execute-api.us-east-2.amazonaws.com/items");
    xhr.addEventListener("load", function () {
        if (xhr.status === 200) {
            const entries = JSON.parse(xhr.response);
            entriesTableBody.innerHTML = ""; // Clear existing rows
            entries.forEach(entry => {
                addEntryToTable(entry);
            });
        } else {
            alert("Failed to load entries.");
        }
    });
    xhr.send();
}

// Function to add an entry to the table
function addEntryToTable(entry) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${entry.id}</td>
        <td>${entry.category}</td>
        <td>${entry.date}</td>
        <td>${JSON.stringify(entry.data)}</td>
        <td><button class="delete-btn" data-id="${entry.id}">Delete</button></td>
    `;
    entriesTableBody.appendChild(row);

    // Add event listener to the delete button
    row.querySelector(".delete-btn").addEventListener("click", function () {
        deleteEntry(entry.id, row);
    });
}

// Function to delete an entry from the database
function deleteEntry(id, row) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", `https://dss1akncn5.execute-api.us-east-2.amazonaws.com/items/${id}`);
    xhr.addEventListener("load", function () {
        if (xhr.status === 200) {
            row.remove(); // Remove the row from the table
            alert(`Entry with ID ${id} deleted successfully.`);
        } else {
            alert("Failed to delete entry.");
        }
    });
    xhr.send();
}

// Handle adding a new entry
document.getElementById("add-entry-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const id = new Date().getTime().toString(); // Generate a unique ID
    const category = document.getElementById("entry-category").value;
    const date = document.getElementById("entry-date").value;
    const data = JSON.parse(document.getElementById("entry-data").value); // Parse JSON input

    const entry = { id, category, date, data };

    // Send the entry to the API Gateway
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://dss1akncn5.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function () {
        if (xhr.status === 200) {
            addEntryToTable(entry); // Add the new entry to the table
            document.getElementById("add-entry-form").reset();
            alert("Entry added successfully!");
        } else {
            alert("Failed to add entry.");
        }
    });
    xhr.send(JSON.stringify(entry));
});
