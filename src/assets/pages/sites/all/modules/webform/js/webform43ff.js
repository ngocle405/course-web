(function ($) {
  'use strict';
  Drupal.behaviors.webform = Drupal.behaviors.webform || {};
  Drupal.behaviors.webform.attach = function (context) {
    Drupal.webform.datepicker(context);
    if (Drupal.settings.webform && Drupal.settings.webform.conditionals) {
      Drupal.webform.conditional(context);
    }
  };
  Drupal.webform = Drupal.webform || {};
  Drupal.webform.datepicker = function (context) {
    $('div.webform-datepicker').each(function () {
      var $webformDatepicker = $(this);
      var $calendar = $webformDatepicker.find('input.webform-calendar');
      if ($calendar.length == 0) {
        return;
      }
      var startDate = $calendar[0].className.replace(/.*webform-calendar-start-(\d{4}-\d{2}-\d{2}).*/, '$1').split('-');
      var endDate = $calendar[0].className.replace(/.*webform-calendar-end-(\d{4}-\d{2}-\d{2}).*/, '$1').split('-');
      var firstDay = $calendar[0].className.replace(/.*webform-calendar-day-(\d).*/, '$1');
      startDate = new Date(startDate[0], startDate[1] - 1, startDate[2]);
      endDate = new Date(endDate[0], endDate[1] - 1, endDate[2]);
      if (startDate > endDate) {
        var laterDate = startDate;
        startDate = endDate;
        endDate = laterDate;
      }
      var startYear = startDate.getFullYear();
      var endYear = endDate.getFullYear();
      $calendar.datepicker({
        dateFormat: 'yy-mm-dd',
        yearRange: startYear + ':' + endYear,
        firstDay: parseInt(firstDay),
        minDate: startDate,
        maxDate: endDate,
        onSelect: function (dateText, inst) {
          var date = dateText.split('-');
          $webformDatepicker
            .find('select.year, input.year')
            .val(+date[0])
            .trigger('change');
          $webformDatepicker
            .find('select.month')
            .val(+date[1])
            .trigger('change');
          $webformDatepicker
            .find('select.day')
            .val(+date[2])
            .trigger('change');
        },
        beforeShow: function (input, inst) {
          var year = $webformDatepicker.find('select.year, input.year').val();
          var month = $webformDatepicker.find('select.month').val();
          var day = $webformDatepicker.find('select.day').val();
          var today = new Date();
          year = year ? year : today.getFullYear();
          month = month ? month : today.getMonth() + 1;
          day = day ? day : today.getDate();
          year = year < startYear || year > endYear ? startYear : year;
          $(input).val(year + '-' + month + '-' + day);
        },
      });
      $calendar.click(function (event) {
        $(this).focus();
        event.preventDefault();
      });
    });
  };
  Drupal.webform.conditional = function (context) {
    $.each(Drupal.settings.webform.conditionals, function (formKey, settings) {
      var $form = $('.' + formKey + ':not(.webform-conditional-processed)');
      $form.each(function (index, currentForm) {
        var $currentForm = $(currentForm);
        $currentForm.addClass('webform-conditional-processed');
        $currentForm.bind('change', { settings: settings }, Drupal.webform.conditionalCheck);
        Drupal.webform.doConditions($form, settings);
      });
    });
  };
  Drupal.webform.conditionalCheck = function (e) {
    var $triggerElement = $(e.target).closest('.webform-component');
    var $form = $triggerElement.closest('form');
    var triggerElementKey = $triggerElement.attr('class').match(/webform-component--[^ ]+/)[0];
    var settings = e.data.settings;
    if (settings.sourceMap[triggerElementKey]) {
      Drupal.webform.doConditions($form, settings);
    }
  };
  Drupal.webform.doConditions = function ($form, settings) {
    var stackPointer;
    var resultStack;
    function executionStackInitialize(andor) {
      stackPointer = -1;
      resultStack = [];
      executionStackPush(andor);
    }
    function executionStackPush(andor) {
      resultStack[++stackPointer] = { results: [], andor: andor };
    }
    function executionStackAccumulate(result) {
      resultStack[stackPointer]['results'].push(result);
    }
    function executionStackPop() {
      var stackFrame = resultStack[stackPointer];
      stackPointer = Math.max(0, stackPointer - 1);
      var $conditionalResults = stackFrame['results'];
      var filteredResults = $.map($conditionalResults, function (val) {
        return val ? val : null;
      });
      return stackFrame['andor'] === 'or'
        ? filteredResults.length > 0
        : filteredResults.length === $conditionalResults.length;
    }
    var targetLocked = [];
    $.each(settings.ruleGroups, function (rgid_key, rule_group) {
      var ruleGroup = settings.ruleGroups[rgid_key];
      executionStackInitialize(ruleGroup['andor']);
      $.each(ruleGroup['rules'], function (m, rule) {
        switch (rule['source_type']) {
          case 'component':
            var elementKey = rule['source'];
            var element = $form.find('.' + elementKey)[0];
            var existingValue = settings.values[elementKey] ? settings.values[elementKey] : null;
            executionStackAccumulate(window['Drupal']['webform'][rule.callback](element, existingValue, rule['value']));
            break;
          case 'conditional_start':
            executionStackPush(rule['andor']);
            break;
          case 'conditional_end':
            executionStackAccumulate(executionStackPop());
            break;
        }
      });
      var conditionalResult = executionStackPop();
      $.each(ruleGroup['actions'], function (aid, action) {
        var $target = $form.find('.' + action['target']);
        var actionResult = action['invert'] ? !conditionalResult : conditionalResult;
        switch (action['action']) {
          case 'show':
            if (actionResult != Drupal.webform.isVisible($target)) {
              var $targetElements = actionResult
                ? $target.find('.webform-conditional-disabled').removeClass('webform-conditional-disabled')
                : $target.find(':input').addClass('webform-conditional-disabled');
              $targetElements.webformProp('disabled', !actionResult);
              $target.toggleClass('webform-conditional-hidden', !actionResult);
              if (actionResult) {
                $target.show();
              } else {
                $target.hide();
                targetLocked[action['target']] = 'hide';
              }
              if ($target.is('tr')) {
                Drupal.webform.restripeTable($target.closest('table').first());
              }
            }
            break;
          case 'require':
            var $requiredSpan = $target.find('.form-required, .form-optional').first();
            if (actionResult != $requiredSpan.hasClass('form-required')) {
              var $targetInputElements = $target.find(
                "input:text,textarea,input[type='email'],select,input:radio,input:file"
              );
              Drupal.detachBehaviors($requiredSpan);
              $targetInputElements.webformProp('required', actionResult).toggleClass('required', actionResult);
              if (actionResult) {
                $requiredSpan.replaceWith(
                  '<span class="form-required" title="' + Drupal.t('This field is required.') + '">*</span>'
                );
              } else {
                $requiredSpan.replaceWith('<span class="form-optional"></span>');
              }
              Drupal.attachBehaviors($requiredSpan);
            }
            break;
          case 'set':
            var isLocked = targetLocked[action['target']];
            var $texts = $target.find("input:text,textarea,input[type='email']");
            var $selects = $target.find('select,select option,input:radio,input:checkbox');
            var $markups = $target.filter('.webform-component-markup');
            if (actionResult) {
              var multiple = $.map(action['argument'].split(','), $.trim);
              $selects.webformVal(multiple);
              $texts.val([action['argument']]);
              $markups.html(action['argument']);
            } else {
              $markups.each(function () {
                var $this = $(this);
                var original = $this.data('webform-markup');
                if (original !== undefined) {
                  $this.html(original);
                }
              });
            }
            if (!isLocked) {
              $selects.webformProp('disabled', actionResult);
              $texts.webformProp('readonly', actionResult);
              targetLocked[action['target']] = actionResult ? 'set' : false;
            }
            break;
        }
      });
    });
  };
  Drupal.webform.stopEvent = function () {
    return false;
  };
  Drupal.webform.conditionalOperatorStringEqual = function (element, existingValue, ruleValue) {
    var returnValue = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase() === ruleValue.toLowerCase()) {
        returnValue = true;
        return false;
      }
    });
    return returnValue;
  };
  Drupal.webform.conditionalOperatorStringNotEqual = function (element, existingValue, ruleValue) {
    var found = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase() === ruleValue.toLowerCase()) {
        found = true;
      }
    });
    return !found;
  };
  Drupal.webform.conditionalOperatorStringContains = function (element, existingValue, ruleValue) {
    var returnValue = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) > -1) {
        returnValue = true;
        return false;
      }
    });
    return returnValue;
  };
  Drupal.webform.conditionalOperatorStringDoesNotContain = function (element, existingValue, ruleValue) {
    var found = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) > -1) {
        found = true;
      }
    });
    return !found;
  };
  Drupal.webform.conditionalOperatorStringBeginsWith = function (element, existingValue, ruleValue) {
    var returnValue = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) === 0) {
        returnValue = true;
        return false;
      }
    });
    return returnValue;
  };
  Drupal.webform.conditionalOperatorStringEndsWith = function (element, existingValue, ruleValue) {
    var returnValue = false;
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    $.each(currentValue, function (n, value) {
      if (value.toLowerCase().lastIndexOf(ruleValue.toLowerCase()) === value.length - ruleValue.length) {
        returnValue = true;
        return false;
      }
    });
    return returnValue;
  };
  Drupal.webform.conditionalOperatorStringEmpty = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    var returnValue = true;
    $.each(currentValue, function (n, value) {
      if (value !== '') {
        returnValue = false;
        return false;
      }
    });
    return returnValue;
  };
  Drupal.webform.conditionalOperatorStringNotEmpty = function (element, existingValue, ruleValue) {
    return !Drupal.webform.conditionalOperatorStringEmpty(element, existingValue, ruleValue);
  };
  Drupal.webform.conditionalOperatorSelectGreaterThan = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    return Drupal.webform.compare_select(currentValue[0], ruleValue, element) > 0;
  };
  Drupal.webform.conditionalOperatorSelectGreaterThanEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    var comparison = Drupal.webform.compare_select(currentValue[0], ruleValue, element);
    return comparison > 0 || comparison === 0;
  };
  Drupal.webform.conditionalOperatorSelectLessThan = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    return Drupal.webform.compare_select(currentValue[0], ruleValue, element) < 0;
  };
  Drupal.webform.conditionalOperatorSelectLessThanEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    var comparison = Drupal.webform.compare_select(currentValue[0], ruleValue, element);
    return comparison < 0 || comparison === 0;
  };
  Drupal.webform.conditionalOperatorNumericEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    var epsilon = 0.000001;
    return currentValue[0] === '' ? false : Math.abs(parseFloat(currentValue[0]) - parseFloat(ruleValue)) < epsilon;
  };
  Drupal.webform.conditionalOperatorNumericNotEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    var epsilon = 0.000001;
    return currentValue[0] === '' ? true : Math.abs(parseFloat(currentValue[0]) - parseFloat(ruleValue)) >= epsilon;
  };
  Drupal.webform.conditionalOperatorNumericGreaterThan = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    return parseFloat(currentValue[0]) > parseFloat(ruleValue);
  };
  Drupal.webform.conditionalOperatorNumericGreaterThanEqual = function (element, existingValue, ruleValue) {
    return (
      Drupal.webform.conditionalOperatorNumericGreaterThan(element, existingValue, ruleValue) ||
      Drupal.webform.conditionalOperatorNumericEqual(element, existingValue, ruleValue)
    );
  };
  Drupal.webform.conditionalOperatorNumericLessThan = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.stringValue(element, existingValue);
    return parseFloat(currentValue[0]) < parseFloat(ruleValue);
  };
  Drupal.webform.conditionalOperatorNumericLessThanEqual = function (element, existingValue, ruleValue) {
    return (
      Drupal.webform.conditionalOperatorNumericLessThan(element, existingValue, ruleValue) ||
      Drupal.webform.conditionalOperatorNumericEqual(element, existingValue, ruleValue)
    );
  };
  Drupal.webform.conditionalOperatorDateEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.dateValue(element, existingValue);
    return currentValue === ruleValue;
  };
  Drupal.webform.conditionalOperatorDateNotEqual = function (element, existingValue, ruleValue) {
    return !Drupal.webform.conditionalOperatorDateEqual(element, existingValue, ruleValue);
  };
  Drupal.webform.conditionalOperatorDateBefore = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.dateValue(element, existingValue);
    return currentValue !== false && currentValue < ruleValue;
  };
  Drupal.webform.conditionalOperatorDateBeforeEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.dateValue(element, existingValue);
    return currentValue !== false && (currentValue < ruleValue || currentValue === ruleValue);
  };
  Drupal.webform.conditionalOperatorDateAfter = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.dateValue(element, existingValue);
    return currentValue !== false && currentValue > ruleValue;
  };
  Drupal.webform.conditionalOperatorDateAfterEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.dateValue(element, existingValue);
    return currentValue !== false && (currentValue > ruleValue || currentValue === ruleValue);
  };
  Drupal.webform.conditionalOperatorTimeEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.timeValue(element, existingValue);
    return currentValue === ruleValue;
  };
  Drupal.webform.conditionalOperatorTimeNotEqual = function (element, existingValue, ruleValue) {
    return !Drupal.webform.conditionalOperatorTimeEqual(element, existingValue, ruleValue);
  };
  Drupal.webform.conditionalOperatorTimeBefore = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.timeValue(element, existingValue);
    return currentValue !== false && currentValue < ruleValue;
  };
  Drupal.webform.conditionalOperatorTimeBeforeEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.timeValue(element, existingValue);
    return currentValue !== false && (currentValue < ruleValue || currentValue === ruleValue);
  };
  Drupal.webform.conditionalOperatorTimeAfter = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.timeValue(element, existingValue);
    return currentValue !== false && currentValue > ruleValue;
  };
  Drupal.webform.conditionalOperatorTimeAfterEqual = function (element, existingValue, ruleValue) {
    var currentValue = Drupal.webform.timeValue(element, existingValue);
    return currentValue !== false && (currentValue > ruleValue || currentValue === ruleValue);
  };
  Drupal.webform.compare_select = function (a, b, element) {
    var optionList = [];
    $('option,input:radio,input:checkbox', element).each(function () {
      optionList.push($(this).val());
    });
    var a_position = optionList.indexOf(a);
    var b_position = optionList.indexOf(b);
    return a_position < 0 || b_position < 0 ? null : a_position - b_position;
  };
  Drupal.webform.isVisible = function ($element) {
    return $element.hasClass('webform-component-hidden')
      ? !$element.find('input').first().hasClass('webform-conditional-disabled')
      : $element.closest('.webform-conditional-hidden').length == 0;
  };
  Drupal.webform.stringValue = function (element, existingValue) {
    var value = [];
    if (element) {
      var $element = $(element);
      if (Drupal.webform.isVisible($element)) {
        $element.find('input[type=checkbox]:checked,input[type=radio]:checked').each(function () {
          value.push(this.value);
        });
        if (!value.length) {
          var selectValue = $element.find('select').val();
          if (selectValue) {
            if ($.isArray(selectValue)) {
              value = selectValue;
            } else {
              value.push(selectValue);
            }
          }
        }
        if (!value.length) {
          $element.find('input:not([type=checkbox],[type=radio]),textarea').each(function () {
            value.push(this.value);
          });
        }
      }
    } else {
      switch ($.type(existingValue)) {
        case 'array':
          value = existingValue;
          break;
        case 'string':
          value.push(existingValue);
          break;
      }
    }
    return value;
  };
  Drupal.webform.dateValue = function (element, existingValue) {
    var value = false;
    if (element) {
      var $element = $(element);
      if (Drupal.webform.isVisible($element)) {
        var day = $element.find('[name*=day]').val();
        var month = $element.find('[name*=month]').val();
        var year = $element.find('[name*=year]').val();
        if (month) {
          month--;
        }
        if (year !== '' && month !== '' && day !== '') {
          value = Date.UTC(year, month, day) / 1000;
        }
      }
    } else {
      if ($.type(existingValue) === 'array' && existingValue.length) {
        existingValue = existingValue[0];
      }
      if ($.type(existingValue) === 'string') {
        existingValue = existingValue.split('-');
      }
      if (existingValue.length === 3) {
        value = Date.UTC(existingValue[0], existingValue[1], existingValue[2]) / 1000;
      }
    }
    return value;
  };
  Drupal.webform.timeValue = function (element, existingValue) {
    var value = false;
    if (element) {
      var $element = $(element);
      if (Drupal.webform.isVisible($element)) {
        var hour = $element.find('[name*=hour]').val();
        var minute = $element.find('[name*=minute]').val();
        var ampm = $element.find('[name*=ampm]:checked').val();
        hour = hour === '' ? hour : parseInt(hour);
        minute = minute === '' ? minute : parseInt(minute);
        if (hour !== '') {
          hour = hour < 12 && ampm == 'pm' ? hour + 12 : hour;
          hour = hour === 12 && ampm == 'am' ? 0 : hour;
        }
        if (hour !== '' && minute !== '') {
          value = Date.UTC(1970, 0, 1, hour, minute) / 1000;
        }
      }
    } else {
      if ($.type(existingValue) === 'array' && existingValue.length) {
        existingValue = existingValue[0];
      }
      if ($.type(existingValue) === 'string') {
        existingValue = existingValue.split(':');
      }
      if (existingValue.length >= 2) {
        value = Date.UTC(1970, 0, 1, existingValue[0], existingValue[1]) / 1000;
      }
    }
    return value;
  };
  $.fn.webformProp =
    $.fn.webformProp ||
    function (name, value) {
      if (value) {
        return $.fn.prop ? this.prop(name, true) : this.attr(name, true);
      } else {
        return $.fn.prop ? this.prop(name, false) : this.removeAttr(name);
      }
    };
  $.fn.webformVal = function (values) {
    this.each(function () {
      var $this = $(this);
      var value = $this.val();
      var on = $.inArray($this.val(), values) != -1;
      if (this.nodeName == 'OPTION') {
        $this.webformProp('selected', on ? value : false);
      } else {
        $this.val(on ? [value] : false);
      }
    });
    return this;
  };
  Drupal.webform.restripeTable = function (table) {
    $('> tbody > tr, > tr', table)
      .filter(':visible:odd')
      .filter('.odd')
      .removeClass('odd')
      .addClass('even')
      .end()
      .end()
      .filter(':visible:even')
      .filter('.even')
      .removeClass('even')
      .addClass('odd');
  };
})(jQuery);