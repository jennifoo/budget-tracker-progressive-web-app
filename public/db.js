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


// Take transaction send via front-end and store into object store
function saveRecord(record) {
  // Tap into storage and make it accesible
  const transaction = db.transaction(["pending"], "readwrite");

  // Specify which storage and identify with variable
  const store = transaction.objectStore("pending");

  // Front end is sending an object and it's being stored here after .catch (failed POST to database)
  store.add(record)

}

// Once online, check to see if anything is in the object sore and POST to /api/transaction/bulk (need to send over object) which will InsertMany into Transaction table.
function checkDatabase() {

}

// Listens for when the browser is online again in order to run the checkDatabase function
window.addEventListener("online", checkDatabase);





/* const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Enter a name for transaction"
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);
const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
*/
