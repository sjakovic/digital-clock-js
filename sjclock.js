//! sjclock.js
//! version : 1.0.0
//! authors : Simo Jakovic
//! license : MIT

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.sjclock = factory();
    }
}(this, function () {
    "use strict";

    var sjclock = function (func) {
        /**
         * Version
         * @type {string}
         */
        var version = '1.0.0';
        /**
         * Interval for refreshing time
         * @type {null}
         */
        var interval = null;

        /**
         * Calendar language
         * @type {string}
         */
        var language = 'sr';

        /**
         * Language translations
         * @type {{sr: {weekdays: string[], months: string[]}}}
         */
        var translations = {
            sr: {
                weekdays: ['Недеља', 'Понедељак', 'Уторак', 'Среда', 'Четвртак', 'Петак', 'Субота'],
                months: ['Јануар', 'Фебруар', 'Март', 'Април', 'Мај', 'Јун', 'Јул', 'Август', 'Септембар', 'Октобар', 'Новембар', 'Децембар']
            },
            srLat: {
                weekdays: ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'],
                months: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']
            }
        };

        /**
         * Utility functions
         * @type {{leadingZero: (function(*): string)}}
         */
        var utils = {
            leadingZero: function (number) {
                return (number < 10 ? '0' : '') + number;
            }
        };

        this.init = function () {
            interval = setInterval(function () {
                this.update();
            }.bind(this), 1000);
        };

        this.update = function () {
            let d = new Date();
            let dateArr = [
                translations[language].weekdays[d.getDay()], ', ', d.getDate(), ' ',
                translations[language].months[d.getMonth()], ' ', d.getFullYear()
            ];
            let timeArr = [d.getHours(), utils.leadingZero(d.getMinutes()), utils.leadingZero(d.getSeconds())];

            document.getElementById('sjclock_date').innerHTML = dateArr.join('');
            document.getElementById('sjclock_time').innerHTML = timeArr.join(':');
        };
    };

    return sjclock;
}));