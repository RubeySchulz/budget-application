let db;

const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event){
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true});
}

// upon successful
request.onsuccess = function(event){
    db = event.target.result;

    if(navigator.onLine){
        uploadTransaction();
    }
};

request.onerror = function(event){
    console.log(event.target.errorCode);
}

function saveRecord(record){
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const transactionObjectStore = transaction.objectStore('new_transaction');

    transactionObjectStore.add(record);
};

function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const transactionObjectStore = transaction.objectStore('new_transaction');

    const getAll = transactionObjectStore.getAll();

    getAll.onsuccess = function() {
        if(getAll.result.length > 0){
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message){
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_transaction'], 'readwrite');
                // access the object store
                const transactionObjectStore = transaction.objectStore('new_transaction');
                // clear all items in your store
                transactionObjectStore.clear();

                alert('All saved transactions have been submitted');
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
}