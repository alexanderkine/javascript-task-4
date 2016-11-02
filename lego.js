'use strict';

exports.isStar = false;

var COMMANDS_PRIORITY = ['filterIn', 'select', 'sortBy', 'format', 'limit'];

exports.query = function (collection) {
    var copyCollection = JSON.parse(JSON.stringify(collection));
    var commands = [].slice.call(arguments, 1);
    if (arguments.length === 1) {
        return copyCollection;
    }
    commands = commands.sort(function (a, b) {
        return COMMANDS_PRIORITY[a.name] - COMMANDS_PRIORITY[b.name];
    });
    commands.forEach(function (command) {
        copyCollection = command(copyCollection);
    });

    return copyCollection;
};

exports.select = function () {
    var properties = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (person) {
            return properties.reduce(function (newPerson, property) {
                return selectProperties(person, newPerson, property);
            }, {});
        });
    };
};

function selectProperties(person, newPerson, property) {
    if (!person.hasOwnProperty(property)) {
        return newPerson;
    }
    newPerson[property] = person[property];

    return newPerson;
}

exports.filterIn = function (property, values) {

    return function filterIn(collection) {
        return collection.filter(function (person) {
            return values.some(function (item) {
                return person[property] === item;
            });
        });
    };
};

exports.sortBy = function (property, order) {

    return function sortBy(collection) {
        var sortCollection = collection.sort(function (a, b) {
            return a[property] <= b[property] ? -1 : 1;
        });

        if (order === 'desc') {
            return sortCollection.reverse();
        }

        return sortCollection;
    };
};

exports.format = function (property, formatter) {

    return function format(collection) {
        return collection.map(function (person) {
            if (!person.hasOwnProperty(property)) {
                return person;
            }
            person[property] = formatter(person[property]);

            return person;
        });
    };
};

exports.limit = function (count) {

    return function limit(collection) {

        return collection.slice(0, count);
    };
};

if (exports.isStar) {

    exports.or = function () {
        return;
    };

    exports.and = function () {
        return;
    };
}
