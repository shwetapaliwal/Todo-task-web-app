window.addEventListener("load", boot, false);
//creates basic structure of the page on loading.

function boot() {
    var todoDataBase = window.sessionStorage;
    var ToDoManagerObj = new ToDoManager(todoDataBase);
    var FooterButtonsObj = new FooterButtons(ToDoManagerObj, todoDataBase);
    var inputBoxObj = new InputBox(ToDoManagerObj, FooterButtonsObj, todoDataBase);
    var oldItems = getAllStoredItems(todoDataBase);
    var oldItemContainer = new createOldItemsList(oldItems, ToDoManagerObj, FooterButtonsObj);
}
// creates input box and add events to keypress enter

function InputBox(todomanager, buttons, database) {
    this.dbObject = database;
    this.todomanagerObj = todomanager;
    this.buttonsObj = buttons;
    this.create();
    this.addEvent();
}
InputBox.prototype = {
    create: function() {
        var toDoList = getDom("#toDoList");
        var input = createDomElement("div", {
            id: "userInput"
        });
        var box = createDomElement("input", {
            type: "text",
            id: "newItem",
            placeholder: "what needs to be done?"
        });
        box.autofocus;
        input.appendChild(box);
        toDoList.appendChild(input);
        // var togellAll = createDomElement("input", {
        // 	id: "togellAll",
        // 	type: "checkbox",
        // 	title: "Show & hide"
        // });
        // input.appendChild(togellAll);
    },
    addEvent: function() {
        var todomanager = this.todomanagerObj;
        var buttons = this.buttonsObj;
        var dbObject = this.dbObject;
        var inputbox = getDom("#newItem");
        inputbox.addEventListener("keypress", keyPressHandler, false);

        function keyPressHandler(e) {
            var e = window.event || e;
            var keyunicode = e.charCode || e.keyCode;
            if (keyunicode === 13) {
                var pattExpWithSpace = /\s[a-z]/i;
                var pattExpWithOutSpace = /[a-z]/i;
                var value = this.value;
                var withSpace = pattExpWithSpace.test(value);
                var withoutSpace = pattExpWithOutSpace.test(value);
                if (withSpace || withoutSpace) {
                    var listItem = new ToDoItem(dbObject);
                    createItemContainer(todomanager, buttons, listItem.dom);
                    storeItem(listItem.id, value, dbObject, "incomplete")
                }
                this.value = "";
            }
        }
    }
};
//creates basic buttons and add events to them

function FooterButtons(todomanager, database) {
    this.todomanagerObj = todomanager;
    this.databaseobj = database;
}
FooterButtons.prototype = {
    create: function() {
        var toDoList = getDom("#toDoList");
        var menu = createDomElement("div", {
            id: "menu",
            class: "present"
        });
        var totalitems = createDomElement("span", {
            id: "itemsleft"
        });
        var span = createDomElement("span");
        span.innerHTML = "total Task";
        var all = createDomElement("button", {
            id: "all",
            title: "show All"
        });
        all.innerHTML = "All";
        var active = createDomElement("button", {
            id: "active",
            title: "Show Active"
        });
        active.innerHTML = "Active";
        var completed = createDomElement("button", {
            id: "showComplete",
            title: "Show Completed"
        });
        completed.innerHTML = "Completed";
        var clear = createDomElement("button", {
            id: "clearCompleted",
            title: "clear Completed"
        });
        clear.innerHTML = "clear Completed";
        menu.appendChild(totalitems);
        menu.appendChild(span);
        menu.appendChild(all);
        menu.appendChild(active);
        menu.appendChild(completed);
        menu.appendChild(clear);
        this.menu = menu;
        toDoList.appendChild(menu);
    },
    show: function() {
        this.menu.style.visibility = "visible";
    },
    showAll: function() {
        var ul = getDom("ul");
        if (ul.style.display == "") {
            ul.style.display = "none";
        } else {
            ul.style.display = "";
        }
    },
    addEvent: function() {
        var thisObj = this.menu;
        var obj = this;
        thisObj.childNodes[2].addEventListener("click", function() {
            obj.all();
        }, false);
        thisObj.childNodes[3].addEventListener("click", function() {
            obj.showActive();
        }, false);
        thisObj.childNodes[4].addEventListener("click", function() {
            obj.showCompleted();
        }, false);
        thisObj.childNodes[5].addEventListener("click", function() {
            obj.clearCompleted();
        }, false);
        // var togellall = getDom("#togellAll");
        // togellall.addEventListener("click", function() {
        // 	obj.showAll();
        // }, false);
    },
    all: function() {
        var items = getDomAll("li");
        var length = items.length;
        for (var i = 0; i < length; i++) {
            items[i].style.display = "block";
        }
    },
    showActive: function() {
        var items = getDomAll("li");
        var length = items.length;
        for (var i = 0; i < length; i++) {
            if (items[i].className === "done") {
                items[i].style.display = "none";
            } else {
                items[i].style.display = "";
            }
        }
    },
    showCompleted: function() {
        var items = getDomAll("li");
        var length = items.length;
        for (var i = 0; i < length; i++) {
            if (items[i].className === "done") {
                items[i].style.display = "";
            } else {
                items[i].style.display = "none";
            }
        }
    },
    clearCompleted: function() {
        var items = getDomAll(".done");
        var ul = getDom("ul");
        var length = items.length;
        for (var i = 0; i < length; i++) {
            ul.removeChild(items[i]);
            this.databaseobj.removeItem(items[i].id);
            this.todomanagerObj.allitems.pop(items[i]);
            var total = this.todomanagerObj.allitems.length;
            var itemsleft = getDom("#itemsleft");
            itemsleft.innerHTML = total;
        }
    },
}
// creates handler that handels the task of deleting,adding etc

function ToDoManager(database) {
    this.databaseobj = database;
}
ToDoManager.prototype = {
    allitems: [],
    create: function() {
        var toDoList = document.querySelector("#toDoList");
        var itemContainer = createDomElement("div", {
            class: "hidden",
            id: "itemContainer"
        });
        var ul = createDomElement("ul", {
            id: "lists",
            class: "view"
        });
        itemContainer.appendChild(ul);
        toDoList.appendChild(itemContainer);
        this.ul = ul;
    },
    add: function(item) {
        this.ul.insertBefore(item, getDom("li"));
        this.allitems.push(item);
        getDom("#itemsleft").innerHTML = this.allitems.length;
    },
    deleteItem: function(item) {
        this.databaseobj.removeItem(item.id);
        this.ul.removeChild(item);
        this.allitems.pop(item);
        getDom("#itemsleft").innerHTML = this.allitems.length;
    },
    markCompleted: function(item) {
        var label = item.childNodes[1];
        var a = this.databaseobj[item.id];
        if (label.className == "incomplete") {
            label.className = "completed";
            item.className = "done";
        } else {
            label.className = "incomplete";
            item.className = "undone";
        }
        changeDbItemStatus(this.databaseobj, label.className, a, item)
    },
    addEvent: function(item) {
        var thisObj = this;
        item.childNodes[0].addEventListener("click", function() {
            thisObj.markCompleted(item);
        }, false);
        item.childNodes[2].addEventListener("click", function() {
            thisObj.deleteItem(item);
        }, false);
    }
};
//creates the structure of the todo task item

function ToDoItem(dbName) {
    var arrayOfData = getItemFromDb(dbName);
    length = arrayOfData.length;
    if (length === 0) {
        this.id = 0
        this.create(this.id);
    } else {
        var lastObj = arrayOfData[length - 1];
        this.id = lastObj.id + 1;
        this.create(this.id);
    }
}
ToDoItem.prototype = {
    create: function(id) {
        var inputbox = getDom("#newItem");
        var value = inputbox.value;
        var li = createDomElement("li", {
            class: "",
            id: this.id
        });
        var input = createDomElement("input", {
            type: "checkbox",
            class: "show",
            title: "Click if Completed"
        });
        li.appendChild(input);
        var label = createDomElement("p", {
            class: "incomplete"
        });
        label.innerHTML = value;
        li.appendChild(label);
        var button = createDomElement("button", {
            class: "destroy",
            title: "delete"
        });
        li.appendChild(button);
        this.dom = li;
    },
    getter: function() {
        return this.dom;
    }
};
//shows old task items on loading the page

function createOldItemsList(Items, manager, menu) {
    this.createItems(Items, manager, menu);
}
//creates a listItem 
createOldItemsList.prototype = {
    createItems: function(Items, manager, menu) {
        for (var i in Items) {
            var item = JSON.parse(Items[i])
            if (item.status == "completed") {
                var className = "done"
            } else {
                var className = "undone"
            }
            var li = createDomElement("li", {
                class: className,
                id: i
            });
            var input = createDomElement("input", {
                type: "checkbox",
                class: "show"
            });
            li.appendChild(input);
            var label = createDomElement("p", {
                class: item.status
            });
            label.innerHTML = item.value;
            li.appendChild(label);
            var button = createDomElement("button", {
                class: "destroy"
            });
            li.appendChild(button);
            createItemContainer(manager, menu, li)
        }
    }
};

function createItemContainer(manager, controls, item) {
    if (getDom("ul") === null) {
        manager.create();
    }
    if (getDom(".present") === null) {
        controls.create();
        controls.show();
        controls.addEvent(this);
    }
    manager.add(item);
    manager.addEvent(item);
}
//class name -- first letter is capt ;
//prop,method,variable ---camel case;