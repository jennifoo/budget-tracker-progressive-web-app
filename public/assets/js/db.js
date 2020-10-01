// OBJECTIVE: Create Object Store to store failed user POST request when offline. Once online, check storage for items and POST to database then clear out Object Store.

let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
  // db value changes upon version update
  const db = event.target.result;
  // Create Object Store called "pending" with an auto increment column
  db.createObjectStore("pending", { autoIncrement: true});
}

request.onsuccess = function(event) {
  // db value changes upon success
  db = event.target.result;

  // check of browser is online
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log("Error code " + event.target.errorCode);
}

// Take transaction send via front-end and store into object store
function saveRecord(record) {
  // Tap into storage and make it accesible
  const transaction = db.transaction(["pending"], "readwrite");
  // Specify which storage and identify with variable
  const store = transaction.objectStore("pending");

  // Front end is sending an object and it's being stored here after .catch (failed POST to database)
  store.add(record)

}

// Once online, check to see if anything is in the Object Store and POST to /api/transaction/bulk (need to send over object) which will InsertMany into Transaction table.
function checkDatabase() {
  // Tap into storage and make it accesible
  const transaction = db.transaction(["pending"], "readwrite");
  // Specify which storage and identify with variable
  const store = transaction.objectStore("pending");

  const checkAll = store.getAll();

  // After the store method is sucessful
  checkAll.onsuccess = function(){
    // If there are items in Object store
    if (checkAll.result.length > 0) {
      // Post items to database
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(checkAll.result),
        headers: {
          Accept: "application/json, text/plain, */*", "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // Tap into storage and make it accesible
        const transaction = db.transaction(["pending"], "readwrite");
        // Specify which storage and identify with variable
        const store = transaction.objectStore("pending");

        store.clear();
      });
    }
  };
}

// Listens for when the browser is online again in order to run the checkDatabase function
window.addEventListener("online", checkDatabase);
