function getDom(item) {
    return document.querySelector(item);
}

function getDomAll(item) {
    return document.querySelectorAll(item);
}

function createDomElement(element, object) {
    var element = document.createElement(element);
    for (var property in object) {
        element.setAttribute(property, object[property]);
    }
    return element;
}