let db;

conq request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
  // db value changes upon version update
  const db = event.target.result;
  // Create Object Store called "pending" with an auto increment column
  db.createObjectStore("pending", { autoIncrement: true});
}

// Need to be able to push pending transactions into the API post request once online again.

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
