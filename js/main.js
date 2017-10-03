var appointments, global, buttons, dropdown, textInput, subheader, modal, clickX, dragX;
var cssBezier = new Ease(new BezierEasing(0.7, 0, 0.3, 1));

var pages = {
  current : "NA",
  init : function(animate) {
    var onStartPage = pages.list.appointmentsDashboard;

    for (var key in pages.list) {
      var page = pages.list[key];
      if( page.hash === window.location.hash.substring(1) ){
        onStartPage = page;
      }
    }
    onStartPage.init(animate);
  },

  gotoPage : function(page, func) {
    $(page.container).load(page.url, function() {
      $(window).scrollTop(0);
      $(".loading-page").removeClass("loading");

      if (window.location.hash.substr(1) !== page.hash){
        pages.updateHash(page.hash);
      }

      pages.current = page.hash;
      var bodyClasses = $("body").attr('class').split(" ");
      $("body").attr("class", bodyClasses[0]);
      $("body").addClass(page.hash);

      if(func){
        func();
      }
    });
  },

  updateHash : function(newHash){
    if (window.location.hash.substr(1) !== newHash){
      window.location.hash = newHash;
    }
    else{
      pages.init(true);
    }
  },
  list : {
    appointmentsDashboard : {
      container: ".page-content",
      defaultView: "ListView",
      url:"pages/appointmentsDashboardShell.html",
      hash:"dashboard",
      init : function(animate, view) {
        view = typeof view === "undefined" ? this.defaultView : view;
        $(".loading-page").addClass("loading");
        var onComplete = function() {
          pages.gotoPage(pages.list.appointmentsDashboard, function() {
            buttons.renderButtons();
            dropdown.renderDropdowns();
            pages.list["appointments" + view ].init(animate);
          });
        };
        var time = animate ? 500 : 0;
        setTimeout(function(){
          onComplete();
        }, time);
      }
    },
    appointmentsListView : {
      container: ".appointments-view",
      url:"pages/appointmentsListView.html",
      hash:"listView",
      viewName: "ListView",
      init : function(animate) {
        if ($(".dashboard-header").length === 0) {
          if (animate) {
            $(".loading-page").addClass("loading").css("top", "");
          }
          pages.list.appointmentsDashboard.init(animate, pages.list.appointmentsListView.viewName);
          return;
        }
        if (animate) {
          $(".loading-page").css("top", $(".appointments-view").offset().top).addClass("loading");
        }

        var onComplete = function(){
          pages.gotoPage(pages.list.appointmentsListView, function() {
            $(".toggle.viewStyle").addClass("selected-state");
            $(".toggle.viewStyle .toggle-btn[value='List']").addClass("sel");
            $.get("partial/_listdate.html", function(html){
              var $dateRows = $(html);
              $(".appointments-list").append($dateRows);

              // for each day in the template... should always be 7 but i guess we can customize.
              var dateIterator = appointments.startingWeek;
              for (var i = 0; i < $(".date-row").length; i++) {
                var $dateRow = $(".date-row").eq(i);
                var dateObj = appointments.dateStrToObj(dateIterator);
                $dateRow.attr("id", dateObj.dateNoHyphens);
                $dateRow.find(".written-out").html(dateObj.dateString);
                dateIterator = appointments.incrementDate(dateIterator);
              }

              if (appointments.appts === null) {
                appointments.loadAppointments(function() {
                  appointments.drawListView();
                });
              }
              else {
                appointments.drawListView();
              }
            });
          });
        };
        var time = animate ? 500 : 0;
        setTimeout(function(){
          onComplete();
        }, time);
      }
    },
    appointmentsCalView : {
      container: ".appointments-view",
      url: "pages/appointmentsCalView.html",
      hash: "calView",
      viewName: "CalView",
      init: function(animate) {
        if ($(".dashboard-header").length === 0) {
          if (animate) {
            $(".loading-page").addClass("loading").css("top", "");
          }
          pages.list.appointmentsDashboard.init(animate, pages.list.appointmentsCalView.viewName);
          return;
        }
        if (animate) {
          $(".loading-page").css("top", $(".appointments-view").offset().top).addClass("loading");
        }
        var onComplete = function(){
          pages.gotoPage(pages.list.appointmentsCalView, function() {
            $(".toggle.viewStyle").addClass("selected-state");
            $(".toggle.viewStyle .toggle-btn[value='Cal']").addClass("sel");

            $(".calendar-booked-wrap").scrollTop(800);
            $(".calendar-booked-wrap").scroll(function(){
              var scrollPos = $(".calendar-booked-wrap").scrollTop();
              $(".time-markers-inner").css("transform", "translateY(-" + scrollPos + "px)");
            });

            $(".calendar-booked").empty();
            if (appointments.appts === null) {
              appointments.loadAppointments(function() {
                appointments.drawCalView();
              });
            }
            else {
              appointments.drawCalView();
            }
          });
        };
        var time = animate ? 500 : 0;
        setTimeout(function(){
          onComplete();
        }, time);
      }
    }
  },
};

global = {
  transistionEnd : 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
  breakpts : {
    sml : 710,
    med : 1010,
    lrg : 1490
  },
  breakpt : function() {
    var ww = window.innerWidth;
    var breakptval = 'lrg';

    for( var key in global.breakpts){
      if( global.breakpts[key] >= ww ){
        breakptval = key;
        break;
      }
    }
    return breakptval;
  },
  pxToInt : function(string) {
    var numString = string.split("px")[0];
    return parseInt(numString);
  },
  strToCamelCase : function(string) {
    string = string.toLowerCase();
    var strArray = string.split(" ");
    if (strArray.length === 1) {
      return string;
    }
    else {
      var newString = strArray[0];
      for (var i = 1; i < strArray.length; i++) {
        newString += strArray[i].charAt(0).toUpperCase() + strArray[i].slice(1);
      }
      return newString;
    }
  },
  decimalToTime : function(decimal) {
    var hour = Math.floor(decimal);
    var ampm = "am";
    var min = Math.floor((decimal % 1) * 60);
    min = (min < 10) ? "0" + min : min;

    if (hour >= 12) {
      hour = (hour === 12) ? hour : hour % 12;
      ampm = "pm";
    }

    return hour + ":" + min + ampm;
  },
  scrollTo : function($div, animate, onComplete) {
    var spot = $div.offset().top - 115;

    if (pages.current === "listView") {
      spot = $div.offset().top - 115 - 53;
    }
    var time = typeof animate === "undefined" ? 500 : 0;

    $('html,body').animate({
      scrollTop : spot
    }, time, function(){
      if (typeof onComplete !== "undefined") {
        onComplete();
      }
    });
  },
  scrollToHorizontally : function($div, $container, animate, onComplete) {
    var spot = $div.position().left;
    var time = typeof animate === "undefined" ? 500 : 0;
    $container.animate({
      scrollLeft : spot
    }, time, function(){
      if (typeof onComplete !== "undefined") {
        onComplete();
      }
    });
  },
  toTitleCase : function(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  },
  shuffleArray : function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },
  toggleGrid : function() {
    $(".grid").toggleClass("off");
  },
  closeEverything : function() {
    dropdown.closeAll();
    $(".action-dropdown.expanded").each(function(){
      buttons.closeActionButton($(this).siblings(".button"));
    });
  },
  toggleSlideout : function() {
    if ($(".slideout").hasClass("collapsed")){
      global.openSlideout();
    }
    else {
      global.closeSlideout();
    }
  },
  openSlideout : function() {
    $(".slideout").removeClass("collapsed");
    $("body").addClass("locked");
  },
  closeSlideout : function() {
    $(".slideout").addClass("collapsed");
    $("body.locked").removeClass("locked");

    //appointments
    var id = $(".appt-item.selected").attr("id");
    var apptObj = _.findWhere(appointments.appts, {_id: id});
    if (apptObj) {
      appointments.redrawAppointmentItem( apptObj );
    }
    $(".appt-item.selected").removeClass("selected");
  },
  render : function(obj, tpl, target, replace, onComplete) {
    replace = typeof replace === "undefined" ? true : replace;

    $.get("templates/_"+tpl+".html", function(html) {
      // if you want a helper method in the render.
      Handlebars.registerHelper("eq", function(a, b){
        return a === b;
      });

      // specific to appointments dash project.
      Handlebars.registerHelper("decimalToTime", function(decimal){
        return global.decimalToTime(decimal);
      });
      Handlebars.registerHelper("shouldHaveTooltip", function(planStatus, potentialNoShow){
        return (planStatus !== "active") || potentialNoShow;
      });
      Handlebars.registerHelper("convertProviderName", function(providerName){
        return providerName.toLowerCase().replace(/\s/g, "-");
      });
      Handlebars.registerHelper("multiply", function(a, b){
        return (parseFloat(a) * parseFloat(b)) + "px";
      });

      var template = Handlebars.compile(html);
      var rendered = template(obj);

      if(typeof onComplete !== 'undefined'){
        onComplete();
      }

      if (typeof target !== "undefined") {
        if (replace) {
          $(target).html(rendered);
        }
        else {
          $(target).append(rendered);
        }
      }

    });
  },
  refreshWithNewData : function(container, template, newData, time, callback) {
    time = typeof time === "undefined" ? 0.2 : time;

    TweenLite.to($(container), time, {
      "alpha" : 0,
      "ease" : cssBezier,
      onComplete : function(){
        global.render(newData, template, container, true, function(){
          TweenLite.to($(container), time, {
            "alpha" : 1,
            "ease" : cssBezier,
            onComplete: function() {
              if (typeof callback !== "undefined") {
                setTimeout(callback, 0.2);
              }
            }
          });
        });
      }
    });
  }
};

appointments = {
  appts : null,
  daysInMonths: [31,28,31,30,31,30,31,31,30,31,30,31],
  monthsShort: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  dow: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  startingWeek: "2017-10-01 Sunday Oct.", // must be a sunday.
  today: "2017-10-03 Tuesday Oct.",
  durationSettings: {
    "sick" : {
      "new" : 0.75,
      "returning" : 0.5
    },
    "physical" : {
      "new" : 1,
      "returning" : 0.75
    },
    "pregnancyVisit" : {
      "new" : 1,
      "returning" : 0.5
    },
    "wellWomanExam" : {
      "new" : 0.75,
      "returning" : 0.5
    }
  },
  dateStrToObj : function(dateString) {
    var dateArray = dateString.split(" ");

    return {
      "dateWithHyphens" : dateArray[0],
      "dateNoHyphens" : parseInt(dateArray[0].replace(/-/g, "")),
      "dateString" : dateArray[2] + " " + dateArray[0].split("-")[2] + ", " + dateArray[0].split("-")[0],
      "dayOfWeek" : dateArray[1],
      "dayOfWeekShort" : dateArray[1].substr(0,3),
      "month" : dateArray[2]
    };
  },
  getAppointmentsByDaySorted : function(appointmentsList) {
    var appointmentsByDay = _.groupBy(appointmentsList, function(appt) {
      return appt.date.split(" ")[0].replace(/-/g, "");
    });
    for (var key in appointmentsByDay) {
      var apptsList = appointmentsByDay[key];
      appointmentsByDay[key] = _.sortBy(apptsList, function(appt) {
        return appt.startTime;
      });
    }
    return appointmentsByDay;
  },
  getAppointmentsByDayAndProvider : function(appointmentsList) {
    var appointmentsByDay = _.groupBy(appointmentsList, function(appt) {
      return appt.date.split(" ")[0].replace(/-/g, "");
    });
    for (var key in appointmentsByDay) {
      var apptsList = appointmentsByDay[key];
      appointmentsByDay[key] = _.sortBy(apptsList, function(appt) {
        return appt.provider.name;
      });
      appointmentsByDay[key] = _.groupBy(appointmentsByDay[key], function(appt) {
        return appt.provider.name;
      });
      for (var provider in appointmentsByDay[key]) {
        appointmentsByDay[key][provider] = _.sortBy(appointmentsByDay[key][provider], function(appt) {
          return appt.startTime;
        });
      }
    }
    return appointmentsByDay;
  },
  incrementDate : function(dateString, numberOfDays) {
    numberOfDays = typeof numberOfDays === "undefined" ? 1 : numberOfDays;

    var dateArray = dateString.split(" ");
    var dateJsObj = new Date(dateArray[0]);
    dateJsObj.setDate(dateJsObj.getDate() + numberOfDays + 1);
    var year = dateJsObj.getFullYear();
    var month = ( (dateJsObj.getMonth()+1) < 10) ? ("0" + (dateJsObj.getMonth()+1)) : (dateJsObj.getMonth()+1);
    var date = (dateJsObj.getDate() < 10) ? ("0" + dateJsObj.getDate()) : dateJsObj.getDate();
    var dateHyphen = year + "-" + month + "-" + date;
    var dow = appointments.dow[dateJsObj.getDay()];
    var monthWord = appointments.monthsShort[dateJsObj.getMonth()] + ".";
    return dateHyphen + " " + dow + " " + monthWord;
  },
  durationByApptAndPatient : function(apptObject) {
    var type = global.strToCamelCase(apptObject.type);
    var patientType = apptObject.member.newPatient ? "new" : "returning";
    return appointments.durationSettings[type][patientType];
  },
  determineStatus : function(apptObject) {
    var today = appointments.dateStrToObj(appointments.today).dateNoHyphens;
    var appt = appointments.dateStrToObj(apptObject.date).dateNoHyphens;
    var past = today > appt;

    apptObject.past = past;

    // coding in that noshows trump cancels.
    // the order / sequence of these returns matter.
    if (!past) {
      apptObject.noShow = false;
      apptObject.lateCancel = false;
    }

    if (apptObject.noShow) {
      apptObject.lateCancel = false;
      apptObject.canceled = false;
      return "no-show";
    }
    apptObject.canceled = apptObject.lateCancel || apptObject.canceled;

    if (apptObject.canceled) {
      return "canceled";
    }

    if (past) {
      return "complete";
    }

    return "booked";
  },
  toggleBooleanToggleSwitch : function(apptObject, fieldKey) {
    var currentStatus = apptObject[fieldKey];
    var newStatus = !currentStatus;
    apptObject[fieldKey] = newStatus;
    // $(".toggleSwitch." + fieldKey).siblings(".toggleSwitchTextWrap").removeClass("" + currentStatus).addClass("" + newStatus);
  },
  typeReasonToFields : function(apptObject) {
    var apptTypeArray = apptObject.typeReason.split("-");
    apptObject.type = apptTypeArray[0];
    apptObject.reasonForVisit = apptTypeArray[1];
  },
  drawListView : function() {
    var appointmentsByDay = appointments.getAppointmentsByDaySorted(appointments.appts);
    for (var key in appointmentsByDay) {
      var apptsList = appointmentsByDay[key];
      var apptsListObj = { "appointments" : apptsList };
      global.render(apptsListObj, "appointments-list-item", $("#" + key + " .appointments-wrapper"));
    }
    subheader.scrollHelper($("html").scrollTop());
  },
  drawCalView : function(callback) {
    var apptsByDayByProv = appointments.getAppointmentsByDayAndProvider(appointments.appts);
    var today = appointments.dateStrToObj(appointments.today).dateNoHyphens;

    // render header
    $.get("partial/_calendar-header.html", function(html){
      var $calendarHeaderRow = $(html);
      $(".calendar-header").empty();
      var dateIterator = appointments.startingWeek;

      // 7 days in a week, 7 showing at a time.
      for (var i = 0; i < 7; i++) {
        var dateObj = appointments.dateStrToObj(dateIterator);
        var id = dateObj.dateNoHyphens;
        $calendarHeaderRow.attr("key", dateObj.dayOfWeek.toLowerCase());
        $calendarHeaderRow.find(".date-wrap").html(dateObj.dayOfWeekShort + ". " + dateObj.dateString);
        $calendarHeaderRow.find(".providers-wrap").empty();
        var past = today > id;

        // wrapper to hold all the booked appts. determine if its a past day here.
        var $dayWrap = $("<div />", {
          class : "day-wrap"
        });
        if (past) {
          $calendarHeaderRow.addClass("past");
          $dayWrap.addClass("past");
        }

        // handle days with empty appointments
        if (!apptsByDayByProv[id]) {
          $dayWrap.addClass("empty");
        }

        for (var provider in apptsByDayByProv[id]){
          var providerName = provider.toLowerCase().replace(/\s/g, "-");
          $calendarHeaderRow.find(".providers-wrap").append("<div class='provider-header title4 " + providerName + "'>" + provider + "</div>");
          var byDayProvArrayObj = { "appointments" : apptsByDayByProv[id][provider] };
          var $providerWrap = $("<div class='provider-wrap " + providerName + "'></div>");
          global.render(byDayProvArrayObj, "booked-appts-by-dayprov-cal", $providerWrap, false);
          $dayWrap.append($providerWrap);
        }

        $(".calendar-booked").append($dayWrap);

        dateIterator = appointments.incrementDate(dateIterator);
        $(".calendar-header").append($calendarHeaderRow);
        $calendarHeaderRow = $calendarHeaderRow.clone().removeClass("past");
      }

      subheader.horizontalScrollHelper($(".appointments-calendar"));
      $(".appointments-calendar").scroll(function(){
        subheader.horizontalScrollHelper($(".appointments-calendar"));
      });

      if (typeof callback !== "undefined") {
        callback();
      }
    });
  },
  redrawAppointmentRow : function(apptObject, callback) {
    var id = apptObject._id;
    apptObject.status = appointments.determineStatus(apptObject);
    var $apptWrapper = $(".appt-wrapper#" + id);
    var apptArrayObj = { "appointments" : [apptObject] };
    $apptWrapper.wrap('<div class="temp-wrapper"></div>');
    global.refreshWithNewData(".appointments-wrapper .temp-wrapper", "appointments-list-item", apptArrayObj, 0, function(){
      $(".temp-wrapper .appt-wrapper").unwrap();

      if (typeof callback !== "undefined") {
        callback();
      }
    });
  },
  redrawAppointmentBlock : function(apptObject, callback) {
    apptObject.status = appointments.determineStatus(apptObject);
    $(".calendar-booked").empty();
    appointments.drawCalView(callback);
  },
  redrawAppointmentItem : function(apptObject, callback) {
    if (pages.current === "listView") {
      appointments.redrawAppointmentRow( apptObject, callback );
    }
    else {
      appointments.redrawAppointmentBlock( apptObject, callback );
    }
  },
  loadAppointments : function(callback) {
    $.getJSON("js/json/appointments.json", function(data) {
      var allAppointments = data.appointments;
      for (var i = 0; i < allAppointments.length; i++) {
        appointments.typeReasonToFields(allAppointments[i]);
        allAppointments[i].duration = appointments.durationByApptAndPatient(allAppointments[i]);
        allAppointments[i].endTime = allAppointments[i].startTime + allAppointments[i].duration;
        allAppointments[i].status = appointments.determineStatus(allAppointments[i]);
        allAppointments[i].potentialNoShow = allAppointments[i].member.newPatient ? false : allAppointments[i].potentialNoShow;
        allAppointments[i].dateObject = appointments.dateStrToObj(allAppointments[i].date);
        allAppointments[i].provider.addressLine1 = allAppointments[i].provider.address.split(",")[0];
        allAppointments[i].provider.addressLine2 = allAppointments[i].provider.address.split(",")[1];
      }

      appointments.appts = data.appointments;

      if (typeof callback !== "undefined") {
        callback();
      }
    });
  }
};

buttons = {
  inputSizeMap : {
    closed : {
      "xsmall" : "medium",
      "small"  : "large",
      "medium" : "xlarge",
    },
    open : {
      "xsmall" : "medium",
      "small"  : "medium",
      "medium" : "large",
    }
  },
  renderButtons : function(onComplete, $parent) {
    var $buttons = typeof $parent !== "undefined" ? $parent.find(".partial.button") : $(".partial.button");

    $buttons.each(function(i){
      var btn = $(".partial.button")[i];
      var $btn = $(btn);

      var theme = $btn.attr("data-theme");
      var size = $btn.attr("data-size");
      var text = $btn.attr("data-text");
      var icon = typeof $btn.attr("data-icon") !== "undefined" ? $btn.attr("data-icon").split(" ") : [];
      var state = $btn.attr("data-state");
      var customStyle = typeof $btn.attr("data-custom-style") !== "undefined" ? $btn.attr("data-custom-style") : "";
      var actions = typeof $btn.attr("data-actions") !== "undefined" ? $btn.attr("data-actions").split(",") : "";
      // var actionKeyboard = typeof $btn.attr("data-actionkeyboard") !== "undefined" ? $btn.attr("data-actionkeyboard").split(",") : "";
      var actionIcons = typeof $btn.attr("data-actionicons") !== "undefined" ? $btn.attr("data-actionicons").split(",") : "";

      $.get("partial/_button.html", function(html){
        var $btnShell = $(html);
        $btnShell.addClass(theme + " " + size + " " + state + " " + customStyle);
        if (state === "icon-only" || state === "icon-only-action") {
          var $buttonIconWrap = $("<div />", {
            class: "button-icon-wrap icon-" + icon[0]
          });
          if (icon.length > 1) {
            $buttonIconWrap.addClass(icon[1]);
          }
          var iconSize = "medium";
          if (size === "small") {
            iconSize = "small";
          }
          $buttonIconWrap.addClass("icon-" + iconSize);
          $btnShell.find(".button").html($buttonIconWrap);
        }
        else if (state === "icon") {
          var $iconWrap = $("<div />", {
            class: "icon-wrap icon-" + icon[0]
          });
          if (icon.length > 1) {
            $iconWrap.addClass(icon[1]);
          }
          var iconSize2 = "small";
          if (size === "xlarge") {
            iconSize2 = "medium";
          }
          $iconWrap.addClass("icon-" + iconSize2);
          $btnShell.find(".button").html($iconWrap).append(text);
        }
        else {
          $btnShell.find(".button").html(text);
        }

        if (state === "action" || state === "icon-only-action") {
          var $actionDropdown = $("<div />", {
            class : "action-dropdown"
          });

          for (var k = 0; k < actions.length; k++) {
            var $option = $("<div />", {
              class : "button-action",
              html: "<div class='action-title'>" + actions[k] + "</div>"
            });

            if (actionIcons.length > 0) {
              $option.addClass("icon " + actionIcons[k]);
            }

            $actionDropdown.append($option);
          }
          $btnShell.prepend($actionDropdown);
        }

        $btn.parent().append($btnShell);

        if ($buttons.length - 1 === i) {
          $buttons.remove();
          if (typeof onComplete !== "undefined") {
            onComplete();
          }
        }
      });
    });
  },
  toggleActionButton : function($button) {
    if ($button.siblings(".action-dropdown").hasClass("expanded")){
      global.closeEverything();
    }
    else {
      global.closeEverything();
      buttons.openActionButton($button);
    }
  },
  openActionButton : function($button) {
    var $actions = $button.siblings(".action-dropdown");
    var $buttonActions = $actions.find(".button-action");
    var toBeHeight = global.pxToInt($actions.css("padding-top")) + global.pxToInt($actions.css("padding-bottom")) + 2;
    $buttonActions.each(function(){
      toBeHeight += $(this).outerHeight();
    });

    if ($actions.offset().top + toBeHeight > $(window).height()) {
      $actions.addClass("goUp");
    }
    else {
      $actions.removeClass("goUp");
    }

    if ( ($actions.offset().left - $actions.width()) < 50 ) {
      $actions.addClass("goRight");
    }
    else {
      $actions.removeClass("goRight");
    }

    $actions.addClass("expanded");
    TweenLite.to($actions, 0.2, {
      height: toBeHeight
    });
  },
  closeActionButton : function($button) {
    var $actions = $button.siblings(".action-dropdown");
    $actions.removeClass("expanded");
    TweenLite.to($actions, 0.2, {
      height: "100%"
    });
  }
};

dropdown = {
  close : function($dropdown) {
    $dropdown.removeClass('expanded');
    $dropdown.find(".typeaheadInput").blur();
  },
  closeAll : function() {
    dropdown.close($(".dropdown.expanded"));
  },
  open : function($dropdown) {
    global.closeEverything();
    $dropdown.addClass('expanded');
    if ($dropdown.find(".typeaheadInput").length > 0){
      if ($dropdown.parents(".dd").hasClass("noheader")) {
        $dropdown.find(".typeaheadInput").val("");
      }
      $dropdown.find(".typeaheadInput").focus();
    }
  },
  toggle : function($dropdown) {
    if ($dropdown.hasClass('expanded')){
      dropdown.close($dropdown);
    }
    else{
      dropdown.open($dropdown);
    }
  },
  selectOption : function($option, $dropdown, callback) {
    var isMulti = $dropdown.parents(".multi").length;

    if (!isMulti){
      $option.siblings(".selected").removeClass("selected");
      $option.addClass("selected");

      if ($option.children().length === 0){
        $dropdown.find(".view .selected").html($option.text());
      }
      else {
        $dropdown.find(".view .selected").html($option.children(':first-child').text());
      }
    }

    else {
      $option.addClass("selected");
      $dropdown.find(".view .selected").html($dropdown.find(".option.selected").length + " selected");
    }

    $dropdown.addClass("nonempty");
    dropdown.close($dropdown);

    if (typeof callback === "function") {
      callback();
    }
  },
  unselectOption : function($option, $dropdown) {
    var isMulti = $dropdown.parents(".multi").length;
    $option.removeClass("selected");
    if (!isMulti){
      $dropdown.find(".view .selected").empty();
      $dropdown.removeClass("nonempty");
    }
    else {
      var numSelected = $dropdown.find(".option.selected").length;
      if (numSelected === 0) {
        $dropdown.find(".view .selected").empty();
        $dropdown.removeClass("nonempty");
      }
      else {
        $dropdown.find(".view .selected").html( + " selected");
      }
    }
    dropdown.close($dropdown);
  },
  renderDropdowns : function(onComplete, $parent) {
    var type = "dropdown";
    if ($(".partial.typeahead").length > 0){
      type = "typeahead";
    }

    var $type = typeof $parent !== "undefined" ? $parent.find(".partial." + type) : $(".partial." + type);

    $type.each(function(i){
      var dropdown = $type[i];
      var $dropdown = $(dropdown);

      var theme = $dropdown.attr("data-theme");
      var size = $dropdown.attr("data-size");
      var header = $dropdown.attr("data-header");
      var disabled = $dropdown.attr("data-disabled") ? "disabled" : "";
      var selected = $dropdown.attr("data-selected");
      var label = $dropdown.attr("data-label");
      var prompt = $dropdown.attr("data-prompt");
      var multi = $dropdown.attr("data-multi");
      var options = $dropdown.attr("data-options").split(",");
      var keys = $dropdown.attr("data-keys").split(",");
      var error = $dropdown.attr("data-error") ? $dropdown.attr("data-error") : "";
      var customStyle = $dropdown.attr("data-custom-style");
      customStyle = typeof customStyle !== "undefined" ? customStyle : "";
      multi = typeof multi !== "undefined" ? "multi" : "";

      $.get("partial/_" + type + ".html", function(html){
        var $dd = $(html);
        $dd.addClass(theme + " " + size + " " + header + " " + disabled + " " + customStyle + " " + multi);
        $dd.find(".label").html(label);
        $dd.find(".option-prompt").html(prompt);

        if ($dd.hasClass("typeahead")) {
          $dd.find('input.typeaheadInput').attr("placeholder", label);
        }

        for (var j=0; j<options.length; j++){
          var $option = $("<div />", {
            class : "option",
            "key" : "" + keys[j],
            html: "" + options[j]
          });
          $dd.find(".options").append($option);
        }
        if (j < 5) {
          $dd.addClass("lessthanfive");
        }

        if (typeof selected !== 'undefined') {
          var $selectedOption = $dd.find(".option[key='" + selected + "']");
          $selectedOption.addClass("selected");
          $dd.find(".view .selected").html($selectedOption.text());
          $dd.find(".dropdown").addClass("nonempty");
        }

        if (error.length > 0) {
          $dd.addClass("error");
          $dd.find(".error-text").html(error);
          $dd.find(".error-text").removeClass("noshow");
        }

        $dropdown.parent().append($dd);
        if ($type.length-1 === i) {
          $type.remove();
          if (typeof onComplete !== "undefined") {
            onComplete();
          }
        }
      });
    });
  },
  searchTypeahead : function($typeahead, query) {
    var $options = [];
    for (var i = 0; i < $typeahead.find(".option").length; i++) {
      $options[i] = $typeahead.find(".option").eq(i);
      $options[i].addClass("noshow");

      var prevQueryMatch = $options[i].find(".query-match").contents();
      $options[i].find(".query-match").replaceWith(prevQueryMatch);
      $options[i].html($options[i].text());
    }

    var results = _.filter($options, function($option) {
      var text = $option.text();
      if (text.toLowerCase().includes(query.toLowerCase())) {
        $option.removeClass("noshow");
        var firstIndex = text.toLowerCase().indexOf(query.toLowerCase());
        var lastIndex = firstIndex + query.length;


        $option.html(text.substring(0, firstIndex) + "<span class='query-match'>" + text.substring(firstIndex, lastIndex) + "</span>" + text.substr(lastIndex));
        return true;
      }
      return false;
    });

    return results;
  }
};

subheader = {
  initUnderline : function() {
    var selectedWidth = $(".subheader-nav-item.sel").outerWidth();
    var offset = $(".subheader-nav-item.sel").position().left - 40;
    $(".subheader .underline").css("width", selectedWidth).css("transform", "translateX(" + offset + "px)");
  },
  selectNavItem : function($navItem) {
    $(".subheader-nav-item.sel").removeClass("sel");
    $navItem.addClass("sel");
    subheader.initUnderline();
  },
  scrollTo : function($navItem) {
    var destination = $navItem.attr("key");
    var $destination = $(".subheadAnchor[key=" + destination + "]");
    global.scrollTo($destination);
  },
  scrollToHorizontally : function($navItem, $scrollableContainer) {
    var destination = $navItem.attr("key");
    var $destination = $(".subheadAnchor[key=" + destination + "]");
    global.scrollToHorizontally($destination, $scrollableContainer);
  },
  scrollHelper: function(scroll) {
    var mostFarIndex = 0;
    $(".subheader-nav-item").each(function(i, navItem){
      var destination = $(navItem).attr("key");

      var offset = $(".subheadAnchor[key=" + destination + "]").offset().top - 115;

      if (pages.current === "listView") {
        offset = $(".subheadAnchor[key=" + destination + "]").offset().top - 115 - 53;
      }
      // console.log(offset, scroll, offset < scroll);
      if (offset <= scroll) {
        mostFarIndex = i;
      }
    });

    var mostFarIndexAdjusted = parseInt(mostFarIndex);
    subheader.selectNavItem($(".subheader-nav-item").eq(mostFarIndexAdjusted));
  },

  horizontalScrollHelper : function($scrollableContainer) {
    var mostFarIndex = 0;
    var xScroll = $scrollableContainer.scrollLeft();

    $(".subheader-nav-item").each(function(i, navItem){
      var destination = $(navItem).attr("key");
      var offset = $(".subheadAnchor[key=" + destination + "]").position().left - 15;

      if (offset <= xScroll) {
        mostFarIndex = i;
      }
    });
    subheader.selectNavItem($(".subheader-nav-item").eq(mostFarIndex));
  }
};

modal = {
  openModal : function(contentPartial, size, closeable, callback) {

    size = typeof size !== "undefined" ? size : "large";
    closeable = typeof closeable === "undefined" ? false : closeable;

    if (closeable){
      $(".modal-container").addClass("closeable");
    }
    else {
      $(".modal-container").removeClass("closeable");
    }

    $(".modal").removeClass("small large fullscreen").addClass(size + " " + contentPartial);

    var $modalDiv;
    $.get("partial/_" + contentPartial + "-modal.html", function(modalHtml){
      $modalDiv = $("<div />", {
        class : "modal-content",
        html : modalHtml
      });
      $(".modal").append($modalDiv);
      buttons.renderButtons();
      textInput.renderTextInputs();
      dropdown.renderDropdowns();

      if (typeof callback === "function") {
        callback();
      }
      $(".modal-container").removeClass("closed");
      $("body").addClass("locked");
    });
  },
  closeModal : function() {
    $(".modal-container").addClass("closed");
    setTimeout(function() {
      if ($(".slideout").hasClass("collapsed")) {
        $("body.locked").removeClass("locked");
      }
      $(".modal-content").remove();
      $(".modal").attr("class","modal");
    }, 400);
  }
};

textInput = {
  renderTextInputs : function(onComplete, $parent) {
    var $inputs = typeof $parent !== "undefined" ? $parent.find(".partial.textInput") : $(".partial.textInput");

    $inputs.each(function(i){
      var textInput = $(".partial.textInput")[i];
      var $textInput = $(textInput);

      var theme = $textInput.attr("data-theme");
      var size = $textInput.attr("data-size");
      var header = $textInput.attr("data-header");
      var disabled = $textInput.attr("data-disabled") ? true : false;
      var label = $textInput.attr("data-label");
      var value = $textInput.attr("data-value");
      var error = $textInput.attr("data-error") ? $textInput.attr("data-error") : "";

      $.get("partial/_textInput.html", function(html){
        var $tf = $(html);
        $tf.addClass(theme + " " + size + " " + header);

        $tf.find('label').text(label);
        $tf.find('input').attr("placeholder", label);

        if (typeof value !== 'undefined') {
          $tf.find("input").val(value).addClass("nonempty");
        }

        if (disabled) {
          $tf.find("input").attr("disabled", "true").addClass("disabled");
        }

        if (error.length > 0) {
          $tf.addClass("error");
          $tf.find(".error-text").html(error);
          $tf.find(".error-text").removeClass("noshow");
        }

        $textInput.parent().append($tf);
        if ($inputs.length-1 === i) {
          $inputs.remove();
          if (typeof onComplete !== "undefined"){
            onComplete();
          }
        }
      });
    });
  }
};

$(document).ready(function(){
  pages.init(false);

  $(window).scroll(function(){
    var scroll = $("html, body").scrollTop();
    // if (scroll > 0) {
    //   $(".subheader").addClass("scrolled");
    // }
    // else {
    //   $(".subheader").removeClass("scrolled");
    // }

    subheader.scrollHelper(scroll);
  });

  $(window).resize(function() {
    setTimeout(function() {
      $(".action-dropdown.expanded").each(function(){
        if ($(this).offset().left + 300 > $(document).width()) {
          $(this).addClass("goLeft");
        }
        else {
          $(this).removeClass("goLeft");
        }
      });
    }, 500);
  });

  Mousetrap.bind('ctrl+g', function() {
    global.toggleGrid();
  });

  Mousetrap.bind('esc', function() {
    if ( !$(".modal-container").hasClass("closed") && $(".modal-container").hasClass("closeable") ){
      modal.closeModal();
      return;
    }
    global.closeSlideout();

  });

  // reads text input change
  $(document).on("change", ".fieldwrap input[type='text']", function() {
    if ($(this).val().length > 0){
      $(this).addClass("nonempty");
    }
    else {
      $(this).removeClass("nonempty");
    }

    global.checkCompletion();
  });

  // opens and closes dropdown
  // a little logic to differentiate click vs drag
  $(document).on("mousedown", ".option-prompt, .dropdown .view", function(e){
    clickX = e.clientX;
  });
  $(document).on("mousemove", ".option-prompt, .dropdown .view", function(e){
    dragX = e.clientX;
  });
  $(document).on("click", "input.typeaheadInput", function(e) {
    e.stopPropagation();
  });
  $(document).on("click", ".fieldwrap.dd:not(.disabled), .option-prompt", function(e) {
    e.stopPropagation();
    if (Math.abs(clickX - dragX) > 8) {
      return;
    }
    var $dd = $(this).hasClass("dd") ? $(this).find(".dropdown") : $(this).parents(".dd").find(".dropdown");
    dropdown.toggle($dd);
  });

  $(document).on("click", ".dd .option:not(.selected):not(.disabled)", function(e) {
    e.stopPropagation();
    dropdown.selectOption($(this), $(this).parents(".dropdown"));
  });

  $(document).on("click", ".dd .option.selected:not(.disabled)", function(e) {
    e.stopPropagation();
    dropdown.unselectOption($(this), $(this).parents(".dropdown"));
  });

  $(document).on("click", "body, form, .content", function(e) {
    e.stopPropagation();
    global.closeEverything();
  });

  $(document).on("input", "input.typeaheadInput", function() {
    var $typeahead = $(this);
    $typeahead.parents(".dropdown").addClass('loading');
    setTimeout(function(){
      $typeahead.parents(".dropdown").removeClass('loading');
      var results = dropdown.searchTypeahead($typeahead.parents(".typeahead"), $typeahead.val());
      if (results.length === 0) {
        $typeahead.parents(".dropdown").addClass("empty");
      }
      else {
        $typeahead.parents(".dropdown").removeClass("empty");
      }
    }, Math.round(Math.random() * 300) + 200 );
  });

  $(document).on("click", ".buttonWrap.action .button, .buttonWrap.icon-only-action .button", function(e){
    e.stopPropagation();
    buttons.toggleActionButton($(this));
  });

  $(document).on("click", ".xsmall.header .label", function(){
    $(this).siblings("input[type='text']").focus();
  });

  $(document).on("click", ".popover-text", function(e){
    e.stopPropagation();
    $(this).siblings(".popover").toggleClass("closed");

    var x = $(this).offset().left;
    var windowWidth = $(window).width();
    var popoverWidth = $(this).siblings(".popover").width();
    if (x + popoverWidth > windowWidth) {
      $(this).addClass("flip");
    }
    else {
      $(this).removeClass("flip");
    }
  });

  $(document).on("click", ".popover .close", function(e){
    e.stopPropagation();
    $(this).parents(".popover").toggleClass("closed");
  });

  $(document).on("click", ".checkbox, .checkbox-text", function(e){
    e.stopPropagation();
    var $checkbox = $(this);
    if ($(this).hasClass("checkbox-text")) {
      $checkbox = $(this).siblings(".checkbox");
    }
    $checkbox.toggleClass("checked");
  });

  $(document).on("mouseover", ".tooltip-icon", function(){
    var x = $(this).offset().left;
    var windowWidth = $(window).width();
    var tooltipWidth = $(this).siblings(".tooltip").width();
    if (x + tooltipWidth > windowWidth) {
      $(this).addClass("flip");
    }
    else {
      $(this).removeClass("flip");
    }
  });

  $(document).on("click", ".subheader-nav-item", function(e) {
    e.stopPropagation();
    subheader.selectNavItem($(this));

    //appointments only
    if (pages.current === "calView") {
      subheader.scrollToHorizontally($(this), $(".appointments-calendar"));
    }
    else {
      subheader.scrollTo($(this));
    }

  });

  $(document).on("click", ".modal", function(e) {
    e.stopPropagation();
  });

  $(document).on("click", ".modal .close, .closeable", function(e) {
    e.stopPropagation();
    var $target = $(e.currentTarget);
    if ($target.hasClass("modal") || ($target.parents(".modal").length > 0 && !$target.hasClass("close") ) ){
      return;
    }
    modal.closeModal();
  });

  $(document).on("click", ".toggle:not(.disabled) .toggle-btn:not(.sel)", function(e) {
    e.stopPropagation();
    $(this).parents(".toggle").find(".sel").removeClass("sel");
    $(this).addClass("sel");
  });

  $(document).on("click", ".slideout .close, .slideout.freeze-bg .freeze", function(){
    global.closeSlideout();
  });

  $(document).on("click", ".toggleSwitch", function(){
    $(this).toggleClass("false");
    $(this).toggleClass("true");
  });

  // END OF GLOBAL STUFF.

  $(document).on("click", ".appt-wrapper, .appointment-block", function() {
    var id = $(this).attr("id");
    var apptObj = { "appointments" : [_.findWhere(appointments.appts, {_id: id})] };

    if ($(".slideout").hasClass("collapsed")){
      $(this).addClass("selected");
      global.render(apptObj, "appointment-slideout", $(".slideout .slideoutContent"), true, function(){
        global.openSlideout();
      });
    }
    else {
      if ($(this).hasClass("selected")) {
        global.closeSlideout();
      }
      else {
        var selectedId = $(".appt-item.selected").attr("id");
        appointments.redrawAppointmentItem( _.findWhere(appointments.appts, {_id: selectedId}) );

        $(".appt-item.selected").removeClass("selected");
        $(this).addClass("selected");
        global.refreshWithNewData(".slideout .slideoutContent", "appointment-slideout", apptObj);
      }
    }
  });

  $(document).on("click", ".provider-filter .dd .option", function(e) {
    e.stopPropagation();

    var key = $(this).attr("key");
    $(".appointments-list, .appointments-calendar").removeClass("all-providers claudia-roberts-only karen-mcadoo-only");
    $(".appointments-list, .appointments-calendar").addClass(key);
  });

  $(document).on("click", ".toggleSwitch.noShow, .toggleSwitch.lateCancel", function(){
    var apptID = $(this).parents(".slideout-section.appointment").attr("data-id");
    var apptObject = _.findWhere(appointments.appts, {_id: apptID});
    if ($(this).hasClass("noShow")) {
      appointments.toggleBooleanToggleSwitch(apptObject, "noShow");
    }
    else if ($(this).hasClass("lateCancel")) {
      appointments.toggleBooleanToggleSwitch(apptObject, "lateCancel");
    }
  });

  $(document).on("click", ".slideout .cancelCTA:not(.disabled)", function(){
    modal.openModal("cancelAppointment", "small", true, function(){
      var id = $(".appt-item.selected").attr("id");
      var apptObj = _.findWhere(appointments.appts, {_id: id});
      var apptObjArray = { "appointments" : [apptObj] };
      global.render(apptObjArray, "cancel-appt-modal-datalist", $(".modal .appointment-summary"));
    });
  });

  $(document).on("click", ".cancelReason .dd .option:not(.selected):not(.disabled)", function(e) {
    e.stopPropagation();
    dropdown.selectOption($(this), $(this).parents(".dropdown"), function() {
      $(".full-width-modal-cta.cancel-appt .buttonWrap.disabled").removeClass("disabled");
    });
  });

  $(document).on("click", ".full-width-modal-cta.go-back .button", function(e) {
    e.stopPropagation();
    modal.closeModal();
  });

  $(document).on("click", ".full-width-modal-cta.cancel-appt .buttonWrap:not(.disabled) .button", function(e) {
    e.stopPropagation();
    var id = $(".appt-item.selected").attr("id");
    var apptObj = _.findWhere(appointments.appts, {_id: id});
    apptObj.canceled = true;
    apptObj.lateCancel = $(".data-row.late-cancel .checkbox").hasClass("checked");
    var apptObjArray = { "appointments" : [apptObj] };
    modal.closeModal();
    appointments.redrawAppointmentItem( apptObj, function() {
      $(".appt-item#" + id).addClass("selected");
    });
    global.refreshWithNewData(".slideout .slideoutContent", "appointment-slideout", apptObjArray);
  });

  $(document).on("click", ".toggle.viewStyle .toggle-btn:not(.sel)", function() {
    var view = $(this).attr("value") + "View";
    global.closeSlideout();
    pages.list["appointments" + view].init(true);
  });

});
