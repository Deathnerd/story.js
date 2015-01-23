/**
 * Created by Wes Gilleland on 1/21/2015.
 */

/**
 * A convenience function to check if a string has a substring
 * @param foo The substring to search for
 * @returns {boolean}
 */
String.prototype.has = function (foo) {
    return this.indexOf(foo) != -1;
};

/**
 * Checks if the string a string representation of a numeric value
 * @returns {boolean}
 */
String.prototype.isNumber = function () {
    return !isNaN(this);
};

/**
 * Returns the value of the string as a number
 * @returns {number}
 */
String.prototype.toNumber = function () {
    return +this;
};


var Utils = new Class({

    /**
     * Determines a default argument value
     * @param argument
     * @param value
     * @returns {*}
     */
    defaultFor: function (argument, value) {
        return typeof argument !== 'undefined' ? argument : value;
    },

    /**
     * Returns a random string composed of [A-Z a-z 0-9]
     * @param length Defaults to 5
     * @returns {string}
     */
    randomString: function (length) {
        length = this.defaultFor(length, 5);
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(this.randomInt(possible.length));

        return text;
    },

    /**
     * Generate a random integer with length number of numerals
     * @param length Defaults to 2
     * @returns {number}
     */
    randomInt: function (length) {
        return Math.floor(Math.random() * this.defaultFor(length, 2));
    }
});