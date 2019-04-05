/*!
 * DigitalClock Javascript library v1.0.0
 * https://github.com/sjakovic/digital-clock-js
 * Digital clock library for showing digital date on web pages
 *
 * Author: Simo Jakovic,
 * Website: https://jakovic.com
 *
 * Released under the MIT license
 */

(function (window) {
    "use strict";

    // Interval for refreshing time
    let interval = null;

    // Inheritance pattern:
    // https://stackoverflow.com/questions/783818/how-do-i-create-a-custom-error-in-javascript
    function DigitalClockError() {
        let temp = Error.apply(this, arguments);
        temp.name = this.name = "DigitalClockError";
        this.stack = temp.stack;
        this.message = temp.message;
    }

    let IntermediateInheritor = function () {
    };

    IntermediateInheritor.prototype = Error.prototype;

    DigitalClockError.prototype = new IntermediateInheritor();

    const DigitalClock = {
        version: '1.0.0',

        options: {
            date: '',
            time: '',
            showDate: true,
            showTime: true,
            cssDate: 'digitalclock-date',
            cssTime: 'digitalclock-time',
            language: {
                weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            }
        },

        errors: {
            DigitalClockError: DigitalClockError
        },

        hooks: {}, // callback hook functions

        init: function (elem, options) {

            // Attach already created element or pass element ID
            if (typeof(elem) === 'string') {
                elem = document.getElementById(elem) || document.querySelector(elem);
            }
            if (!elem) {
                return this.dispatch('error', new DigitalClockError("Could not locate DOM element to attach to."));
            }

            if ((options === null) || (typeof options !== "object")) {
                options = Object.assign({}, this.options);
            } else {
                let defaultOptions = Object.assign({}, this.options);
                options = Object.assign(defaultOptions, options)
            }

            elem.innerHTML = this.template(options);

            interval = setInterval(function () {
                this.start(elem, options);
            }.bind(this), 1000);

        },

        template: function (params) {
            let html = '';

            if (params.showDate) {
                let css = (params.cssDate !== '') ? `class="${params.cssDate}"` : '';
                html += `<span ${css}>${params.date}</span>`;
            }

            if (params.showTime) {
                let css = (params.cssTime !== '') ? `class="${params.cssTime}"` : '';
                html += `<span ${css}>${params.time}</span>`;
            }

            return html;
        },

        start: function (elem, options) {
            let d = new Date();
            let dateArr = [
                options.language.weekdays[d.getDay()], ', ', d.getDate(), ' ',
                options.language.months[d.getMonth()], ' ', d.getFullYear()
            ];
            let timeArr = [d.getHours(), this.leadingZero(d.getMinutes()), this.leadingZero(d.getSeconds())];

            elem.innerHTML = this.template(Object.assign(options, {
                date: dateArr.join(''),
                time: timeArr.join(':')
            }));
        },

        leadingZero: function (number) {
            return (number < 10 ? '0' : '') + number;
        },

        set: function () {
            // set one or more params
            // variable argument list: 1 param = hash, 2 params = key, value
            if (arguments.length == 1) {
                for (var key in arguments[0]) {
                    this.params[key] = arguments[0][key];
                }
            }
            else {
                this.params[arguments[0]] = arguments[1];
            }
        },

        on: function (name, callback) {
            // set callback hook
            name = name.replace(/^on/i, '').toLowerCase();
            if (!this.hooks[name]) this.hooks[name] = [];
            this.hooks[name].push(callback);
        },

        off: function (name, callback) {
            // remove callback hook
            name = name.replace(/^on/i, '').toLowerCase();
            if (this.hooks[name]) {
                if (callback) {
                    // remove one selected callback from list
                    var idx = this.hooks[name].indexOf(callback);
                    if (idx > -1) this.hooks[name].splice(idx, 1);
                }
                else {
                    // no callback specified, so clear all
                    this.hooks[name] = [];
                }
            }
        },

        dispatch: function () {
            // fire hook callback, passing optional value to it
            var name = arguments[0].replace(/^on/i, '').toLowerCase();
            var args = Array.prototype.slice.call(arguments, 1);

            if (this.hooks[name] && this.hooks[name].length) {
                for (var idx = 0, len = this.hooks[name].length; idx < len; idx++) {
                    var hook = this.hooks[name][idx];

                    if (typeof(hook) == 'function') {
                        // callback is function reference, call directly
                        hook.apply(this, args);
                    }
                    else if ((typeof(hook) == 'object') && (hook.length == 2)) {
                        // callback is PHP-style object instance method
                        hook[0][hook[1]].apply(hook[0], args);
                    }
                    else if (window[hook]) {
                        // callback is global function name
                        window[hook].apply(window, args);
                    }
                } // loop
                return true;
            }
            else if (name == 'error') {
                let message;
                if ((args[0] instanceof DigitalClockError)) {
                    message = args[0].message;
                } else {
                    message = "Could not access digital clock: " + args[0].name + ": " +
                        args[0].message + " " + args[0].toString();
                }

                // Default error handler if no custom one specified
                console.log("DigitalClock.js Error: " + message);
            }

            return false; // no hook defined
        }
    };

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return DigitalClock;
        });
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = DigitalClock;
    }
    else {
        window.DigitalClock = DigitalClock;
    }

}(window));