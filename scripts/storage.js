function getAllStoredItems(dbName) {
    var storedItems = new Object();
    var len = dbName.length;
    debugger;
    for (var i = 0; i < len; i++) {
        storedItems[i] = dbName[i];
    }

    console.log(storedItems);
    return storedItems;
}

function getItemFromDb(dbName) {
    var arrayofData = [];
    var tempArray = [];
    var len = dbName.length;
    debugger;
    for (var i = 0; i < len; i++) {
        dataObj = JSON.parse(dbName[i]);
        tempArray.push(dataObj);
    }
    // for (var i in dbName) {
    // 	dataObj = JSON.parse(dbName[i]);
    // 	tempArray.push(dataObj);
    // }
    tempArray.sort(function(a, b) {
        return a.id - b.id
    })
    return tempArray;
}



function storeItem(key, value, dbName, status) {
    var dataObj = new Object;
    dataObj.id = key;
    dataObj.value = value;
    dataObj.status = status;
    console.log(dataObj);
    dataObjString = JSON.stringify(dataObj);
    dbName.setItem(key, this.dataObjString);
}

function changeDbItemStatus(context, value, a, item) {
    context.removeItem(item.id);
    var b = JSON.parse(a);
    b.status = value;
    var c = JSON.stringify(b);
    context.setItem(item.id, c);
}