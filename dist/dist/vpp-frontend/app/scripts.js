'use strict';


angular.module('vppApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
    'pascalprecht.translate',
    'cgNotify'

]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, $httpProvider) {

        $urlRouterProvider.otherwise("/");
        //$locationProvider.html5Mode(true);

        // Set the preferred language
        $translateProvider.preferredLanguage('en');

        // Set headers w/ interceptor
        //$httpProvider.interceptors.push('authInterceptor');
    })
    .factory('authInterceptor', function ($rootScope, $q, $cookieStore) {
        return {

            // Add authorization token to headers
            request: function (config) {
                config.headers = config.headers || {};
                if ($cookieStore && $cookieStore.get('sessionId')) {
                    config.headers.sessionid = $cookieStore.get('sessionId');
                }

                return config;
            },

            // Intercept 401s
            responseError: function (response) {
                if (response.status === 401) {
                    // remove any stale tokens
                    $cookieStore.remove('sessionId');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    })
    .run(function ($rootScope, $location) {});
/* ========================================================================
 * bootstrap-switch - v3.3.2
 * http://www.bootstrap-switch.org
 * ========================================================================
 * Copyright 2012-2013 Mattia Larentis
 *
 * ========================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================================
 */

(function () {
    var __slice = [].slice;

    (function ($, window) {
        "use strict";
        var BootstrapSwitch;
        BootstrapSwitch = (function () {
            function BootstrapSwitch(element, options) {
                if (options == null) {
                    options = {};
                }
                this.$element = $(element);
                this.options = $.extend({}, $.fn.bootstrapSwitch.defaults, {
                    state: this.$element.is(":checked"),
                    size: this.$element.data("size"),
                    animate: this.$element.data("animate"),
                    disabled: this.$element.is(":disabled"),
                    readonly: this.$element.is("[readonly]"),
                    indeterminate: this.$element.data("indeterminate"),
                    inverse: this.$element.data("inverse"),
                    radioAllOff: this.$element.data("radio-all-off"),
                    onColor: this.$element.data("on-color"),
                    offColor: this.$element.data("off-color"),
                    onText: this.$element.data("on-text"),
                    offText: this.$element.data("off-text"),
                    labelText: this.$element.data("label-text"),
                    handleWidth: this.$element.data("handle-width"),
                    labelWidth: this.$element.data("label-width"),
                    baseClass: this.$element.data("base-class"),
                    wrapperClass: this.$element.data("wrapper-class")
                }, options);
                this.$wrapper = $("<div>", {
                    "class": (function (_this) {
                        return function () {
                            var classes;
                            classes = ["" + _this.options.baseClass].concat(_this._getClasses(_this.options.wrapperClass));
                            classes.push(_this.options.state ? "" + _this.options.baseClass + "-on" : "" + _this.options.baseClass + "-off");
                            if (_this.options.size != null) {
                                classes.push("" + _this.options.baseClass + "-" + _this.options.size);
                            }
                            if (_this.options.disabled) {
                                classes.push("" + _this.options.baseClass + "-disabled");
                            }
                            if (_this.options.readonly) {
                                classes.push("" + _this.options.baseClass + "-readonly");
                            }
                            if (_this.options.indeterminate) {
                                classes.push("" + _this.options.baseClass + "-indeterminate");
                            }
                            if (_this.options.inverse) {
                                classes.push("" + _this.options.baseClass + "-inverse");
                            }
                            if (_this.$element.attr("id")) {
                                classes.push("" + _this.options.baseClass + "-id-" + (_this.$element.attr("id")));
                            }
                            return classes.join(" ");
                        };
                    })(this)()
                });
                this.$container = $("<div>", {
                    "class": "" + this.options.baseClass + "-container"
                });
                this.$on = $("<span>", {
                    html: this.options.onText,
                    "class": "" + this.options.baseClass + "-handle-on " + this.options.baseClass + "-" + this.options.onColor
                });
                this.$off = $("<span>", {
                    html: this.options.offText,
                    "class": "" + this.options.baseClass + "-handle-off " + this.options.baseClass + "-" + this.options.offColor
                });
                this.$label = $("<span>", {
                    html: this.options.labelText,
                    "class": "" + this.options.baseClass + "-label"
                });
                this.$element.on("init.bootstrapSwitch", (function (_this) {
                    return function () {
                        return _this.options.onInit.apply(element, arguments);
                    };
                })(this));
                this.$element.on("switchChange.bootstrapSwitch", (function (_this) {
                    return function () {
                        return _this.options.onSwitchChange.apply(element, arguments);
                    };
                })(this));
                this.$container = this.$element.wrap(this.$container).parent();
                this.$wrapper = this.$container.wrap(this.$wrapper).parent();
                this.$element.before(this.options.inverse ? this.$off : this.$on).before(this.$label).before(this.options.inverse ? this.$on : this.$off);
                if (this.options.indeterminate) {
                    this.$element.prop("indeterminate", true);
                }
                this._init();
                this._elementHandlers();
                this._handleHandlers();
                this._labelHandlers();
                this._formHandler();
                this._externalLabelHandler();
                this.$element.trigger("init.bootstrapSwitch");
            }

            BootstrapSwitch.prototype._constructor = BootstrapSwitch;

            BootstrapSwitch.prototype.state = function (value, skip) {
                if (typeof value === "undefined") {
                    return this.options.state;
                }
                if (this.options.disabled || this.options.readonly) {
                    return this.$element;
                }
                if (this.options.state && !this.options.radioAllOff && this.$element.is(":radio")) {
                    return this.$element;
                }
                if (this.options.indeterminate) {
                    this.indeterminate(false);
                }
                value = !!value;
                this.$element.prop("checked", value).trigger("change.bootstrapSwitch", skip);
                return this.$element;
            };

            BootstrapSwitch.prototype.toggleState = function (skip) {
                if (this.options.disabled || this.options.readonly) {
                    return this.$element;
                }
                if (this.options.indeterminate) {
                    this.indeterminate(false);
                    return this.state(true);
                } else {
                    return this.$element.prop("checked", !this.options.state).trigger("change.bootstrapSwitch", skip);
                }
            };

            BootstrapSwitch.prototype.size = function (value) {
                if (typeof value === "undefined") {
                    return this.options.size;
                }
                if (this.options.size != null) {
                    this.$wrapper.removeClass("" + this.options.baseClass + "-" + this.options.size);
                }
                if (value) {
                    this.$wrapper.addClass("" + this.options.baseClass + "-" + value);
                }
                this._width();
                this._containerPosition();
                this.options.size = value;
                return this.$element;
            };

            BootstrapSwitch.prototype.animate = function (value) {
                if (typeof value === "undefined") {
                    return this.options.animate;
                }
                value = !!value;
                if (value === this.options.animate) {
                    return this.$element;
                }
                return this.toggleAnimate();
            };

            BootstrapSwitch.prototype.toggleAnimate = function () {
                this.options.animate = !this.options.animate;
                this.$wrapper.toggleClass("" + this.options.baseClass + "-animate");
                return this.$element;
            };

            BootstrapSwitch.prototype.disabled = function (value) {
                if (typeof value === "undefined") {
                    return this.options.disabled;
                }
                value = !!value;
                if (value === this.options.disabled) {
                    return this.$element;
                }
                return this.toggleDisabled();
            };

            BootstrapSwitch.prototype.toggleDisabled = function () {
                this.options.disabled = !this.options.disabled;
                this.$element.prop("disabled", this.options.disabled);
                this.$wrapper.toggleClass("" + this.options.baseClass + "-disabled");
                return this.$element;
            };

            BootstrapSwitch.prototype.readonly = function (value) {
                if (typeof value === "undefined") {
                    return this.options.readonly;
                }
                value = !!value;
                if (value === this.options.readonly) {
                    return this.$element;
                }
                return this.toggleReadonly();
            };

            BootstrapSwitch.prototype.toggleReadonly = function () {
                this.options.readonly = !this.options.readonly;
                this.$element.prop("readonly", this.options.readonly);
                this.$wrapper.toggleClass("" + this.options.baseClass + "-readonly");
                return this.$element;
            };

            BootstrapSwitch.prototype.indeterminate = function (value) {
                if (typeof value === "undefined") {
                    return this.options.indeterminate;
                }
                value = !!value;
                if (value === this.options.indeterminate) {
                    return this.$element;
                }
                return this.toggleIndeterminate();
            };

            BootstrapSwitch.prototype.toggleIndeterminate = function () {
                this.options.indeterminate = !this.options.indeterminate;
                this.$element.prop("indeterminate", this.options.indeterminate);
                this.$wrapper.toggleClass("" + this.options.baseClass + "-indeterminate");
                this._containerPosition();
                return this.$element;
            };

            BootstrapSwitch.prototype.inverse = function (value) {
                if (typeof value === "undefined") {
                    return this.options.inverse;
                }
                value = !!value;
                if (value === this.options.inverse) {
                    return this.$element;
                }
                return this.toggleInverse();
            };

            BootstrapSwitch.prototype.toggleInverse = function () {
                var $off, $on;
                this.$wrapper.toggleClass("" + this.options.baseClass + "-inverse");
                $on = this.$on.clone(true);
                $off = this.$off.clone(true);
                this.$on.replaceWith($off);
                this.$off.replaceWith($on);
                this.$on = $off;
                this.$off = $on;
                this.options.inverse = !this.options.inverse;
                return this.$element;
            };

            BootstrapSwitch.prototype.onColor = function (value) {
                var color;
                color = this.options.onColor;
                if (typeof value === "undefined") {
                    return color;
                }
                if (color != null) {
                    this.$on.removeClass("" + this.options.baseClass + "-" + color);
                }
                this.$on.addClass("" + this.options.baseClass + "-" + value);
                this.options.onColor = value;
                return this.$element;
            };

            BootstrapSwitch.prototype.offColor = function (value) {
                var color;
                color = this.options.offColor;
                if (typeof value === "undefined") {
                    return color;
                }
                if (color != null) {
                    this.$off.removeClass("" + this.options.baseClass + "-" + color);
                }
                this.$off.addClass("" + this.options.baseClass + "-" + value);
                this.options.offColor = value;
                return this.$element;
            };

            BootstrapSwitch.prototype.onText = function (value) {
                if (typeof value === "undefined") {
                    return this.options.onText;
                }
                this.$on.html(value);
                this._width();
                this._containerPosition();
                this.options.onText = value;
                return this.$element;
            };

            BootstrapSwitch.prototype.offText = function (value) {
                if (typeof value === "undefined") {
                    return this.options.offText;
                }
                this.$off.html(value);
                this._width();
                this._containerPosition();
                this.options.offText = value;
                return this.$element;
            };

            BootstrapSwitch.prototype.labelText = function (value) {
                if (typeof value === "undefined") {
                    return this.options.labelText;
                }
                this.$label.html(value);
                this._width();
                this.options.labelText = value;
                return this.$element;
            };

            BootstrapSwitch.prototype.handleWidth = function (value) {
                if (typeof value === "undefined") {
                    return this.options.handleWidth;
                }
                this.options.handleWidth = value;
                this._width();
                this._containerPosition();
                return this.$element;
            };

            BootstrapSwitch.prototype.labelWidth = function (value) {
                if (typeof value === "undefined") {
                    return this.options.labelWidth;
                }
                this.options.labelWidth = value;
                this._width();
                this._containerPosition();
                return this.$element;
            };

            BootstrapSwitch.prototype.baseClass = function (value) {
                return this.options.baseClass;
            };

            BootstrapSwitch.prototype.wrapperClass = function (value) {
                if (typeof value === "undefined") {
                    return this.options.wrapperClass;
                }
                if (!value) {
                    value = $.fn.bootstrapSwitch.defaults.wrapperClass;
                }
                this.$wrapper.removeClass(this._getClasses(this.options.wrapperClass).join(" "));
                this.$wrapper.addClass(this._getClasses(value).join(" "));
                this.options.wrapperClass = value;
                return this.$element;
            };

            BootstrapSwitch.prototype.radioAllOff = function (value) {
                if (typeof value === "undefined") {
                    return this.options.radioAllOff;
                }
                value = !!value;
                if (value === this.options.radioAllOff) {
                    return this.$element;
                }
                this.options.radioAllOff = value;
                return this.$element;
            };

            BootstrapSwitch.prototype.onInit = function (value) {
                if (typeof value === "undefined") {
                    return this.options.onInit;
                }
                if (!value) {
                    value = $.fn.bootstrapSwitch.defaults.onInit;
                }
                this.options.onInit = value;
                return this.$element;
            };

            BootstrapSwitch.prototype.onSwitchChange = function (value) {
                if (typeof value === "undefined") {
                    return this.options.onSwitchChange;
                }
                if (!value) {
                    value = $.fn.bootstrapSwitch.defaults.onSwitchChange;
                }
                this.options.onSwitchChange = value;
                return this.$element;
            };

            BootstrapSwitch.prototype.destroy = function () {
                var $form;
                $form = this.$element.closest("form");
                if ($form.length) {
                    $form.off("reset.bootstrapSwitch").removeData("bootstrap-switch");
                }
                this.$container.children().not(this.$element).remove();
                this.$element.unwrap().unwrap().off(".bootstrapSwitch").removeData("bootstrap-switch");
                return this.$element;
            };

            BootstrapSwitch.prototype._width = function () {
                var $handles, handleWidth;
                $handles = this.$on.add(this.$off);
                $handles.add(this.$label).css("width", "");
                handleWidth = this.options.handleWidth === "auto" ? Math.max(this.$on.width(), this.$off.width()) : this.options.handleWidth;
                $handles.width(handleWidth);
                this.$label.width((function (_this) {
                    return function (index, width) {
                        if (_this.options.labelWidth !== "auto") {
                            return _this.options.labelWidth;
                        }
                        if (width < handleWidth) {
                            return handleWidth;
                        } else {
                            return width;
                        }
                    };
                })(this));
                this._handleWidth = this.$on.outerWidth();
                this._labelWidth = this.$label.outerWidth();
                this.$container.width((this._handleWidth * 2) + this._labelWidth);
                return this.$wrapper.width(this._handleWidth + this._labelWidth);
            };

            BootstrapSwitch.prototype._containerPosition = function (state, callback) {
                if (state == null) {
                    state = this.options.state;
                }
                this.$container.css("margin-left", (function (_this) {
                    return function () {
                        var values;
                        values = [0, "-" + _this._handleWidth + "px"];
                        if (_this.options.indeterminate) {
                            return "-" + (_this._handleWidth / 2) + "px";
                        }
                        if (state) {
                            if (_this.options.inverse) {
                                return values[1];
                            } else {
                                return values[0];
                            }
                        } else {
                            if (_this.options.inverse) {
                                return values[0];
                            } else {
                                return values[1];
                            }
                        }
                    };
                })(this));
                if (!callback) {
                    return;
                }
                return setTimeout(function () {
                    return callback();
                }, 50);
            };

            BootstrapSwitch.prototype._init = function () {
                var init, initInterval;
                init = (function (_this) {
                    return function () {
                        _this._width();
                        return _this._containerPosition(null, function () {
                            if (_this.options.animate) {
                                return _this.$wrapper.addClass("" + _this.options.baseClass + "-animate");
                            }
                        });
                    };
                })(this);
                if (this.$wrapper.is(":visible")) {
                    return init();
                }
                return initInterval = window.setInterval((function (_this) {
                    return function () {
                        if (_this.$wrapper.is(":visible")) {
                            init();
                            return window.clearInterval(initInterval);
                        }
                    };
                })(this), 50);
            };

            BootstrapSwitch.prototype._elementHandlers = function () {
                return this.$element.on({
                    "change.bootstrapSwitch": (function (_this) {
                        return function (e, skip) {
                            var state;
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            state = _this.$element.is(":checked");
                            _this._containerPosition(state);
                            if (state === _this.options.state) {
                                return;
                            }
                            _this.options.state = state;
                            _this.$wrapper.toggleClass("" + _this.options.baseClass + "-off").toggleClass("" + _this.options.baseClass + "-on");
                            if (!skip) {
                                if (_this.$element.is(":radio")) {
                                    $("[name='" + (_this.$element.attr('name')) + "']").not(_this.$element).prop("checked", false).trigger("change.bootstrapSwitch", true);
                                }
                                return _this.$element.trigger("switchChange.bootstrapSwitch", [state]);
                            }
                        };
                    })(this),
                    "focus.bootstrapSwitch": (function (_this) {
                        return function (e) {
                            e.preventDefault();
                            return _this.$wrapper.addClass("" + _this.options.baseClass + "-focused");
                        };
                    })(this),
                    "blur.bootstrapSwitch": (function (_this) {
                        return function (e) {
                            e.preventDefault();
                            return _this.$wrapper.removeClass("" + _this.options.baseClass + "-focused");
                        };
                    })(this),
                    "keydown.bootstrapSwitch": (function (_this) {
                        return function (e) {
                            if (!e.which || _this.options.disabled || _this.options.readonly) {
                                return;
                            }
                            switch (e.which) {
                            case 37:
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                return _this.state(false);
                            case 39:
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                return _this.state(true);
                            }
                        };
                    })(this)
                });
            };

            BootstrapSwitch.prototype._handleHandlers = function () {
                this.$on.on("click.bootstrapSwitch", (function (_this) {
                    return function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        _this.state(false);
                        return _this.$element.trigger("focus.bootstrapSwitch");
                    };
                })(this));
                return this.$off.on("click.bootstrapSwitch", (function (_this) {
                    return function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        _this.state(true);
                        return _this.$element.trigger("focus.bootstrapSwitch");
                    };
                })(this));
            };

            BootstrapSwitch.prototype._labelHandlers = function () {
                return this.$label.on({
                    "mousedown.bootstrapSwitch touchstart.bootstrapSwitch": (function (_this) {
                        return function (e) {
                            if (_this._dragStart || _this.options.disabled || _this.options.readonly) {
                                return;
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            _this._dragStart = (e.pageX || e.originalEvent.touches[0].pageX) - parseInt(_this.$container.css("margin-left"), 10);
                            if (_this.options.animate) {
                                _this.$wrapper.removeClass("" + _this.options.baseClass + "-animate");
                            }
                            return _this.$element.trigger("focus.bootstrapSwitch");
                        };
                    })(this),
                    "mousemove.bootstrapSwitch touchmove.bootstrapSwitch": (function (_this) {
                        return function (e) {
                            var difference;
                            if (_this._dragStart == null) {
                                return;
                            }
                            e.preventDefault();
                            difference = (e.pageX || e.originalEvent.touches[0].pageX) - _this._dragStart;
                            if (difference < -_this._handleWidth || difference > 0) {
                                return;
                            }
                            _this._dragEnd = difference;
                            return _this.$container.css("margin-left", "" + _this._dragEnd + "px");
                        };
                    })(this),
                    "mouseup.bootstrapSwitch touchend.bootstrapSwitch": (function (_this) {
                        return function (e) {
                            var state;
                            if (!_this._dragStart) {
                                return;
                            }
                            e.preventDefault();
                            if (_this.options.animate) {
                                _this.$wrapper.addClass("" + _this.options.baseClass + "-animate");
                            }
                            if (_this._dragEnd) {
                                state = _this._dragEnd > -(_this._handleWidth / 2);
                                _this._dragEnd = false;
                                _this.state(_this.options.inverse ? !state : state);
                            } else {
                                _this.state(!_this.options.state);
                            }
                            return _this._dragStart = false;
                        };
                    })(this),
                    "mouseleave.bootstrapSwitch": (function (_this) {
                        return function (e) {
                            return _this.$label.trigger("mouseup.bootstrapSwitch");
                        };
                    })(this)
                });
            };

            BootstrapSwitch.prototype._externalLabelHandler = function () {
                var $externalLabel;
                $externalLabel = this.$element.closest("label");
                return $externalLabel.on("click", (function (_this) {
                    return function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        if (event.target === $externalLabel[0]) {
                            return _this.toggleState();
                        }
                    };
                })(this));
            };

            BootstrapSwitch.prototype._formHandler = function () {
                var $form;
                $form = this.$element.closest("form");
                if ($form.data("bootstrap-switch")) {
                    return;
                }
                return $form.on("reset.bootstrapSwitch", function () {
                    return window.setTimeout(function () {
                        return $form.find("input").filter(function () {
                            return $(this).data("bootstrap-switch");
                        }).each(function () {
                            return $(this).bootstrapSwitch("state", this.checked);
                        });
                    }, 1);
                }).data("bootstrap-switch", true);
            };

            BootstrapSwitch.prototype._getClasses = function (classes) {
                var c, cls, _i, _len;
                if (!$.isArray(classes)) {
                    return ["" + this.options.baseClass + "-" + classes];
                }
                cls = [];
                for (_i = 0, _len = classes.length; _i < _len; _i++) {
                    c = classes[_i];
                    cls.push("" + this.options.baseClass + "-" + c);
                }
                return cls;
            };

            return BootstrapSwitch;

        })();
        $.fn.bootstrapSwitch = function () {
            var args, option, ret;
            option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            ret = this;
            this.each(function () {
                var $this, data;
                $this = $(this);
                data = $this.data("bootstrap-switch");
                if (!data) {
                    $this.data("bootstrap-switch", data = new BootstrapSwitch(this, option));
                }
                if (typeof option === "string") {
                    return ret = data[option].apply(data, args);
                }
            });
            return ret;
        };
        $.fn.bootstrapSwitch.Constructor = BootstrapSwitch;
        return $.fn.bootstrapSwitch.defaults = {
            state: true,
            size: null,
            animate: true,
            disabled: false,
            readonly: false,
            indeterminate: false,
            inverse: false,
            radioAllOff: false,
            onColor: "primary",
            offColor: "default",
            onText: "ON",
            offText: "OFF",
            labelText: "&nbsp;",
            handleWidth: "auto",
            labelWidth: "auto",
            baseClass: "bootstrap-switch",
            wrapperClass: "wrapper",
            onInit: function () {},
            onSwitchChange: function () {}
        };
    })(window.jQuery, window);

}).call(this);
'use strict';

angular.module('vppApp')
	.controller('MainCtrl', function ($scope, $http, $timeout, notify) {


	});
'use strict';

angular.module('vppApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('main', {
                url: "/",
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl'
            })
            .state('home', {
                url: "/home",
                templateUrl: 'public/templates/home/home.html',
                controller: 'HomeCtrl'
            })
            .state('map', {
                url: "/map",
                templateUrl: 'public/templates/mapping/mapping.html',
                controller: 'MapCtrl',
                resolve: {
                    promiseObj: function ($q, $rootScope, wish) {
                        var deferred = $q.defer(),
                            deps = {

                                //ESRI Map
                                Map: 'esri/map',
                                esriConfig: 'esri/config',
                                //Map Layer Tools
                                FeatureLayer: 'esri/layers/FeatureLayer',
                                InfoTemplate: 'esri/InfoTemplate',
                                arcgisUtils: 'esri/arcgis/utils',
                                LayerList: 'esri/dijit/LayerList',
                                //Map Popup Tools
                                Popup: 'esri/dijit/Popup',
                                PopupTemplate: 'esri/dijit/PopupTemplate',
                                //Symbol Tools
                                SimpleFillSymbol: 'esri/symbols/SimpleFillSymbol',
                                SimpleMarkerSymbol: 'esri/symbols/SimpleMarkerSymbol',
                                SimpleLineSymbol: 'esri/symbols/SimpleLineSymbol',
                                TextSymbol: 'esri/symbols/TextSymbol',
                                //dojo Stuff
                                Color: 'dojo/_base/Color',
                                parser: 'dojo/parser',
                                GreySkies: 'dojox/charting/themes/GreySkies',
                                number: 'dojo/number',
                                dom: 'dojo/dom',
                                on: 'dojo/on',
                                query: 'dojo/query',
                                domStyle: 'dojo/dom-style',
                                domConstruct: 'dojo/dom-construct',
                                domReady: 'dojo/domReady',
                                //Services
                                GeometryService: 'esri/tasks/GeometryService',
                                Extent: 'esri/geometry/Extent',
                                //Renderers
                                HeatmapRenderer: 'esri/renderers/HeatmapRenderer',
                                ClassBreaksRenderer: 'esri/renderers/ClassBreaksRenderer',
                                SimpleRenderer: 'esri/renderers/SimpleRenderer',
                                ScaleDependentRenderer: 'esri/renderers/ScaleDependentRenderer'
                            };


                        wish.loadDependencies(deps, function () {
                            deferred.resolve();
                            if (!$rootScope.$$phase) {
                                $rootScope.$apply();
                            }
                        });

                        return deferred.promise;
                    }
                }
            })
            .state('database', {
                url: "/database",
                templateUrl: 'public/templates/database/database.html',
                controller: 'DatabaseCtrl'
            })
            .state('about', {
                url: "/about",
                templateUrl: 'public/templates/about/about.html',
                controller: 'AboutCtrl'
            })
            .state('research', {
                url: "/research",
                templateUrl: 'public/templates/research/research.html',
                controller: 'ResearchCtrl'
            });
    })
    .service('wish', function () {

        // it's not require... it's a wish?
        var wish = {};

        function _loadDependencies(deps, next) {
            var reqArr = _.values(deps),
                keysArr = _.keys(deps);

            // use the dojo require (required by arcgis + dojo) && save refs
            // to required obs
            require(reqArr, function () {
                var args = arguments;

                _.each(keysArr, function (name, idx) {
                    wish[name] = args[idx];
                });

                next();
            });
        }

        return {
            loadDependencies: function (deps, next) {
                _loadDependencies(deps, next);
            },

            get: function () {
                return wish;
            }
        };
    });
// Add filters here
'use strict';

angular.module('vppApp')
    .config(function ($translateProvider) {

		// Make sure translation are escaped properly
		$translateProvider.useSanitizeValueStrategy('sanitize');

		// English translations
		$translateProvider.translations('en', {
            HEADLINE: 'Viva La Costume'
        });
    });
'use strict';

angular.module('vppApp')
    .config(function ($translateProvider) {

		// Make sure translation are escaped properly
		$translateProvider.useSanitizeValueStrategy('sanitize');

		// French translations
        $translateProvider.translations('jp', {
            HEADLINE: 'ビバラコスチューム'
        });
    });
// 'use strict';

// angular.module('vppApp')
// 	.factory('Auth', function Auth($location, $rootScope, $http, $cookieStore, $q) {
// 		var currentUser = {};
// 		if ($cookieStore && $cookieStore.get('sessionId')) {
// 			currentUser = {
// 				sessionId: $cookieStore.get('sessionId')
// 			};
// 		}

// 		return {

// 			/**
// 			 * Authenticate user and save token
// 			 *
// 			 * @param  {Object}   user     - login info
// 			 * @param  {Function} callback - optional
// 			 * @return {Promise}
// 			 */
// 			login: function(user, callback) {
// 				var cb = callback || angular.noop;
// 				var deferred = $q.defer();

// 				$http.get('app/json/login.json').
// 					success(function(data) {

// 						$cookieStore.put('sessionId', data.sessionid);

// 						currentUser = {
// 							sessionId: data.sessionid
// 						};

// 						deferred.resolve(data);
// 						return cb();
// 					}).
// 					error(function(err) {
// 						this.logout();
// 						deferred.reject(err);
// 						return cb(err);
// 					}.bind(this));

// 				return deferred.promise;
// 			},

// 			/**
// 			 * Delete access token and user info
// 			 *
// 			 * @param  {Function}
// 			 */
// 			logout: function() {
// 				$cookieStore.remove('sessionId');
// 				currentUser = {};
// 			},

// 			/**
// 			 * Gets all available info on authenticated user
// 			 *
// 			 * @return {Object} user
// 			 */
// 			getCurrentUser: function() {
// 				return currentUser;
// 			},

// 			/**
// 			 * Get auth token
// 			 */
// 			getSessionId: function() {
// 				return $cookieStore.get('sessionId');
// 			}
// 		};
// 	});

'use strict';

angular.module('vppApp')
	.factory('User', function ($resource) {
		// TODO
	});

'use strict';

angular.module('vppApp')
	.directive("footerTemplate", function ($http, $compile, $translate) {
		return {
			restrict: 'EA',
			scope: {
				snippets: '='
			},
			templateUrl: 'footer/footer.directive.html',
			link: function($scope) {

				$scope.changeLanguage = function (key) {
					$translate.use(key);
				};

				// Add tab support for 508 compliance
				$scope.changeLanguageOnEnter = function (key, e) {

					if(e.which === 13) {
						$translate.use(key);
					}

				};

				$scope.adaReturnToStart = function(){
					$('#user-link').focus();
					return false;
				};
			}
		};
	});
'use strict';

angular.module('vppApp')
    .directive("navTemplate", function () {
        return {
            restrict: 'EA',
            scope: {
                snippets: '='
            },
            templateUrl: 'navbar/navbar.directive.html',
            link: function ($scope) {

                // Placeholder
                $scope.user = {
                    name: 'What is this?'
                };
            }
        };
    });

'use strict';

angular.module('vppApp')
	.controller('AboutCtrl',[
		'$scope',
		function($scope){
		
		}
	]
);
'use strict';

angular.module('vppApp')
    .controller('DatabaseCtrl', [
  '$scope',
  function ($scope) {
            //Page Controls
            $('.divControl').click(function () {
                $(".divFade").each(function () {
                    if ($('.divFade').css("visibility") == "hidden") {
                        // handle non visible state
                    } else {
                        // handle visible state
                        $('.divFade').fadeOut(10);
                    }
                });
            });

            $('#dbSummaryMI').click(function () {
                $("#DataSummary").fadeIn(1000);
            });

            $('#dbPoliciesMI').click(function () {
                $("#Policies").fadeIn(1000);
            });

            $('#vwDataBTN').click(function () {
                $("#DataTable").fadeIn(1000);
            });

            $('#vwOptionsBTN').click(function () {
                $("#DataSummary").fadeIn(1000);
            });
            //End of Page Controls


            $("input[type=\"checkbox\"], input[type=\"radio\"]").not("[data-switch-no-init]").bootstrapSwitch();

            $("input[type=\"checkbox\"], input[type=\"radio\"]").on('switchChange.bootstrapSwitch', function (event, state) {
                //var LayerName = $(this).attr('name');

                console.log($(this).attr('name')); // DOM element
                //console.log(event); // jQuery event
                console.log(state); // true | false

                //            if (state) {
                //                switch (var) {
                //                case "":
                //                    
                //                    break;
                //                case "":
                //                    
                //                    break;
                //                case "":
                //                    
                //                    break;
                //
                //                }
                //            } else {
                //                switch (var) {
                //                case "":
                //                    
                //                    break;
                //                case "":
                //                    
                //                    break;
                //                case "":
                //                    
                //                    break;
                //                }
                //            }

            });

  }
 ]);
'use strict';

angular.module('vppApp')
	.controller('HomeCtrl', [
		'$scope', 
		function(){
		
		}
	]
);

'use strict';

angular.module('vppApp')
    .controller('MapCtrl', function ($rootScope, $scope, wish) {

        var w = wish.get(),
            blockFacesFL,
            markerSym,
            renderer1,
            renderer2,
            sls,
            sfs,
            popup,
            popupOptions,
            popupTemplate_blockFacesFL,
            symbol,

            BlockFaceURL = 'http://gis.mtc.ca.gov/mtc/rest/services/VPP/vpp_V7/FeatureServer/2';

        w.parser.parse();
        w.esriConfig.defaults.geometryService = new w.GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");


        sls = new w.SimpleLineSymbol("solid", new w.Color("#444444"), 3);
        sfs = new w.SimpleFillSymbol("solid", sls, new w.Color([68, 68, 68, 0.25]));

        popupOptions = {
            fillSymbol: sfs,
            marginLeft: "20",
            marginTop: "20"
        };

        //create a popup to replace the map's info window
        popup = new w.Popup(popupOptions, w.domConstruct.create("div"));

        //Define Primary Basemap
        $scope.map = new w.Map('map', {
            center: [-122.416, 37.783],
            zoom: 11,
            minZoom: 3,
            maxZoom: 20,
            infoWindow: popup,
            basemap: 'topo'
        });

        //Define Feature Layers for Map
        popupTemplate_blockFacesFL = new w.PopupTemplate({
            "title": "Parking Spaces by Block Face",
            "fieldInfos": [{
                    "fieldName": "Total_Spaces",
                    "label": "Total Spaces",
                    "format": {
                        "places": 0,
                        "digitSeparator": true
                    }
            }
        ],
            "description": "There are {Total_Spaces} total parking spaces on this block"
        });

        blockFacesFL = new w.FeatureLayer(BlockFaceURL, {
            id: "blockFaces",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            infoTemplate: popupTemplate_blockFacesFL
        });
        //layer.setDefinitionExpression('AREA>0.01 and M086_07>0');

        //Set Map Renderers
        symbol = new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_SOLID,
            new w.Color([255, 0, 0]));
        var renderer = new w.ClassBreaksRenderer(symbol, "Total_Spaces");

        var Break1Color = new w.Color([56, 168, 0, 1]);
        var Break1LineSymbol = new w.SimpleLineSymbol("solid", Break1Color, 3);

        var Break2Color = new w.Color([139, 209, 0, 1]);
        var Break2LineSymbol = new w.SimpleLineSymbol("solid", Break2Color, 3);

        var Break3Color = new w.Color([255, 255, 0, 1]);
        var Break3LineSymbol = new w.SimpleLineSymbol("solid", Break3Color, 3);

        var Break4Color = new w.Color([255, 128, 0, 1]);
        var Break4LineSymbol = new w.SimpleLineSymbol("solid", Break4Color, 3);

        var Break5Color = new w.Color([255, 0, 0, 1]);
        var Break5LineSymbol = new w.SimpleLineSymbol("solid", Break5Color, 3);

        var Break1_minValue = 0;
        var Break1_maxValue = 6;

        var Break2_minValue = 7;
        var Break2_maxValue = 14;

        var Break3_minValue = 15;
        var Break3_maxValue = 26;

        var Break4_minValue = 27;
        var Break4_maxValue = 54;

        var Break5_minValue = 55;
        var Break5_maxValue = 116;

        renderer.addBreak(Break1_minValue, Break1_maxValue, Break1LineSymbol);
        renderer.addBreak(Break2_minValue, Break2_maxValue, Break2LineSymbol);
        renderer.addBreak(Break3_minValue, Break3_maxValue, Break3LineSymbol);
        renderer.addBreak(Break4_minValue, Break4_maxValue, Break4LineSymbol);
        renderer.addBreak(Break5_minValue, Break5_maxValue, Break5LineSymbol);
        blockFacesFL.setRenderer(renderer);


        //blockFacesFL.maxScale = 30000;
        $scope.map.addLayer(blockFacesFL);
        blockFacesFL.hide();

        //Setting up Simple Lines Renderer for Study Areas
        var studyAreasColor = new w.Color("#999");
        var studyAreasLine = new w.SimpleLineSymbol("solid", studyAreasColor, 5);
        var studyAreasSymbol = new w.SimpleFillSymbol("solid", studyAreasLine, null);
        var studyAreasRenderer = new w.SimpleRenderer(studyAreasSymbol);

        var studyAreasFL = new w.FeatureLayer("http://gis.mtc.ca.gov/mtc/rest/services/VPP/vpp_V7/MapServer/3", {
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"]

        });

        studyAreasFL.setRenderer(studyAreasRenderer);
        $scope.map.addLayer(studyAreasFL);
        studyAreasFL.hide();

        //PDA Popup and Feature Layer Definition
        var PDA_Color = new w.Color("#b266ff");
        var PDA_Line = new w.SimpleLineSymbol("solid", PDA_Color, 3);
        var PDA_Symbol = new w.SimpleFillSymbol("solid", PDA_Line, null);
        var PDA_Renderer = new w.SimpleRenderer(PDA_Symbol);

        var PDA_FL = new w.FeatureLayer("http://gis.mtc.ca.gov/mtc/rest/services/OBAG_PDA/OBAG_PDA/MapServer/0", {
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"]

        });

        PDA_FL.setRenderer(PDA_Renderer);
        $scope.map.addLayer(PDA_FL);
        PDA_FL.hide();

        //COC Popup and Feature Layer Definition
        var popupTemplate_COC_FL = new w.PopupTemplate({
            "title": "Community of Concern",
            "fieldInfos": [{
                    "fieldName": "totpop",
                    "label": "Total Population",
                    "format": {
                        "places": 0,
                        "digitSeparator": true
                    }
         }
        ],
            "description": "Total population is {totpop}"
        });

        var COC_FL = new w.FeatureLayer("http://gis.mtc.ca.gov/mtc/rest/services/Open_Data/Open_Data_Layers/MapServer/14", {
            id: "COC",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            infoTemplate: popupTemplate_COC_FL

        });

        COC_FL.setDefinitionExpression("cocflag = 1");


        //Feature Layer Renderer for COCs
        var COC_Color = new w.Color("#ff9999");
        var COC_Line = new w.SimpleLineSymbol("solid", COC_Color, 3);
        var COC_Symbol = new w.SimpleFillSymbol("solid", COC_Line, null);
        var COC_Renderer = new w.SimpleRenderer(COC_Symbol);
        COC_FL.setRenderer(COC_Renderer);

        $scope.map.addLayer(COC_FL);
        COC_FL.hide();

        //Heatmap Renderer for BlockFaces
        var infoTemplate = new w.InfoTemplate("Attributes",
            "Total Spaces: ${Total_Spaces_1}");

        var serviceURL = "http://gis.mtc.ca.gov/mtc/rest/services/VPP/vpp_V7/FeatureServer/0";
        var heatmapFeatureLayerOptions = {
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["Total_Spaces_1"] //,
                //infoTemplate: infoTemplate
        };
        var heatmapFeatureLayer = new w.FeatureLayer(serviceURL, heatmapFeatureLayerOptions);

        //var blurCtrl = document.getElementById("blurControl");
        //var maxCtrl = document.getElementById("maxControl");
        //var minCtrl = document.getElementById("minControl");
        //var valCtrl = document.getElementById("valueControl");

        var heatmapRenderer = new w.HeatmapRenderer({
            field: "Total_Spaces_1",
            blurRadius: 7,
            maxPixelIntensity: 850,
            minPixelIntensity: 0
        });

        heatmapFeatureLayer.setRenderer(heatmapRenderer);
        $scope.map.addLayer(heatmapFeatureLayer);
        heatmapFeatureLayer.show();


        //Map and Featurelayer Utilities
        dojo.connect($scope.map, "onZoomEnd", checkScale);

        function checkScale(extent, zoomFactor, anchor, level) {
                //document.getElementById("myText").value = level;
                console.clear();
                console.log(level);
                if (level > 14) {
                    blockFacesFL.show();
                    heatmapFeatureLayer.hide();
                } else {
                    blockFacesFL.hide();
                    heatmapFeatureLayer.show();
                    //console.log('Heat Map Visible!')
                }
            }
            //Tool Control Listeners
            //Reset Controls in Tool Panel
        $('.clickable').on('click', function () {
            $(this).closest('.panel').fadeOut(300, function () {
                $("#title").text("");
                $('.tools').fadeOut();
            });
        })

        function clearAllTools() {
                $("#mapNav").fadeOut(0);
                $("#mapOpts").fadeOut(0);
                $("#mapBasemaps").fadeOut(0);
                $("#mapLayers").fadeOut(0);
                $("#mapPrint").fadeOut(0);
            }
            //Show Nav Tools
        $('#mapNavCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-location-arrow fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Map Navigation");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapNav").fadeIn(500);

            //return false;

        });

        //Show Map Options
        $('#mapOptionsCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-ellipsis-h fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Map Type");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapOpts").fadeIn(500);

            //return false;

        });

        //Show BaseMap Controls
        $('#mapBaseCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-globe fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Choose Basemap");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapBasemaps").fadeIn(500);

            //return false;

        });

        //Show BaseMap Controls
        $('#mapLayersCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-th-list fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("View Layers");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapLayers").fadeIn(500);

            //return false;

        });

        //Show Map Print Controls
        $('#mapPrintCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-print fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Print Tools");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapPrint").fadeIn(500);

            //return false;

        });
        $("input[type=\"checkbox\"], input[type=\"radio\"]").not("[data-switch-no-init]").bootstrapSwitch();

        $("input[type=\"checkbox\"], input[type=\"radio\"]").on('switchChange.bootstrapSwitch', function (event, state) {
            var LayerName = $(this).attr('name');

            //console.log($(this).attr('name')); // DOM element
            //console.log(event); // jQuery event
            //console.log(state); // true | false

            if (state) {
                switch (LayerName) {
                case "PDA_FL":
                    PDA_FL.show();
                    break;
                case "COC_FL":
                    COC_FL.show();
                    break;
                case "studyAreasFL":
                    studyAreasFL.show();
                    break;

                }
            } else {
                switch (LayerName) {
                case "PDA_FL":
                    PDA_FL.hide();
                    break;
                case "COC_FL":
                    COC_FL.hide();
                    break;
                case "studyAreasFL":
                    studyAreasFL.hide();
                    break;
                }
            }

        });
    });
'use strict';

angular.module('vppApp')
    .controller('ResearchCtrl', [
  '$scope',
  function ($scope) {



  }
 ]);