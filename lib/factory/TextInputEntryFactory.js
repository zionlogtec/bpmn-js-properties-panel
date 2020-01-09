'use strict';

var escapeHTML = require('../Utils').escapeHTML;
var getRoot = require('../Utils').getRoot

var domQuery = require('min-dom').query;

var entryFieldDescription = require('./EntryFieldDescription');


var textField = function (options, defaultParameters) {

  // Default action for the button next to the input-field
  var defaultButtonAction = function (element, inputNode) {
    var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);
    input.value = '';

    return true;
  };

  // default method to determine if the button should be visible
  var defaultButtonShow = function (element, inputNode) {
    var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);

    return input.value !== '';
  };


  var resource = defaultParameters,
    label = options.label || resource.id,
    dataValueLabel = options.dataValueLabel,
    buttonLabel = (options.buttonLabel || 'X'),
    actionName = (typeof options.buttonAction != 'undefined') ? options.buttonAction.name : 'clear',
    actionMethod = (typeof options.buttonAction != 'undefined') ? options.buttonAction.method : defaultButtonAction,
    showName = (typeof options.buttonShow != 'undefined') ? options.buttonShow.name : 'canClear',
    showMethod = (typeof options.buttonShow != 'undefined') ? options.buttonShow.method : defaultButtonShow,
    canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
    canBeHidden = !!options.hidden && typeof options.hidden === 'function',
    description = options.description,
    beforeInput = options.beforeInput ? options.beforeInput : '',
    afterInput = options.afterInput ? options.afterInput : '',
    styleInput = options.styleInput ? options.styleInput : '',
    clearButtonStyle = options.clearButtonStyle ? options.clearButtonStyle : '',
    hidden = options.hidden ? options.hidden : false;

  resource.html =
    '<div style="' + (hidden ? 'display: none;' : '') + '">' +
    '<label for="camunda-' + escapeHTML(resource.id) + '" ' +
    (canBeDisabled ? 'data-disable="isDisabled" ' : '') +
    (canBeHidden ? 'data-show="isHidden" ' : '') +
    (dataValueLabel ? 'data-value="' + escapeHTML(dataValueLabel) + '"' : '') + '>' + escapeHTML(label) + '</label>' +
    '<div class="bpp-field-wrapper" ' +
    (canBeDisabled ? 'data-disable="isDisabled"' : '') +
    (canBeHidden ? 'data-show="isHidden"' : '') +
    '>' +
    beforeInput +
    '<input id="camunda-' + escapeHTML(resource.id) + '" style="' + escapeHTML(styleInput) + '" type="text" name="' + escapeHTML(options.modelProperty) + '" ' +
    (canBeDisabled ? 'data-disable="isDisabled"' : '') +
    (canBeHidden ? 'data-show="isHidden"' : '') +
    ' />' +
    '<button class="' + escapeHTML(actionName) + '" style="' + escapeHTML(clearButtonStyle) + '" data-action="' + escapeHTML(actionName) + '" data-show="' + escapeHTML(showName) + '" ' +
    (canBeDisabled ? 'data-disable="isDisabled"' : '') +
    (canBeHidden ? ' data-show="isHidden"' : '') + '>' +
    '<span>' + escapeHTML(buttonLabel) + '</span>' +
    '</button>'
    + afterInput +
    '</div></div>';


  if (options.hasOwnProperty('appliesTo')) {
    resource.appliesTo = options.appliesTo;
  }

  // add description below text input entry field
  if (description) {
    resource.html += entryFieldDescription(description);
  }

  resource[actionName] = actionMethod;
  resource[showName] = showMethod;

  if (canBeDisabled) {
    resource.isDisabled = function () {
      return options.disabled.apply(resource, arguments);
    };
  }

  if (canBeHidden) {
    resource.isHidden = function () {
      return !options.hidden.apply(resource, arguments);
    };
  }

  resource.cssClasses = ['bpp-textfield'];

  return resource;
};

module.exports = textField;
