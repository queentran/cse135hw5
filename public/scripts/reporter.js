// display static data and initilize listener event
function loadDOMHandler() {
    displayStaticData();
    initEventListeners();
}
 
// Static data
  
// display static data
function displayStaticData() {
    if (window.location.pathname.endsWith('Reportertest.html')) {
        displayUserAgent();
        displayUserLanguage();
        checkCookie();
        checkJavaScript();
        checkImage();
        checkCSS();
        displayScreenDimension();
        displayWindowSize();
        displayConnectionType();
    }
}
  
// get user-agent
function displayUserAgent() {
    document.getElementById('user-agent').innerHTML = navigator.userAgent;
}
  
// get user language
function displayUserLanguage() {
    document.getElementById('user-language').innerHTML = navigator.language;
}
  
// check cookie enabled
function checkCookie() {
    document.getElementById('check-cookie').innerHTML = navigator.cookieEnabled;
}
  
// check javascript enabled
function checkJavaScript() {
    document.getElementById('check-javascript').innerHTML = navigator.javaEnabled();
}
  
// check images enabled
function checkImage() {
    if (document.images != null) {
        document.getElementById('check-image').innerHTML = 'true';
    }
    else {
        document.getElementById('check-image').innerHTML = 'false';
    }
}
  
// check CSS enabled
function checkCSS() {
    if (document.styleSheets != null){
        document.getElementById('check-css').innerHTML = true;
    } else {
        document.getElementById('check-css').innerHTML = false;
    }
}

// display screen dimensions
function displayScreenDimension() {
    document.getElementById('get-dimension').innerHTML = window.screen.width + 'x' + window.screen.height;
}
  
// display window size
function displayWindowSize() {
    document.getElementById('get-windows-size').innerHTML = window.innerWidth + 'x' + window.innerHeight;
}
  
// display effective connection type
function displayConnectionType() {
    if (typeof(navigator.connection) == 'undefined') {
        document.getElementById('get-connection').innerHTML = 'navigator.connection API is not supported';
    } else {
        document.getElementById('get-connection').innerHTML = navigator.connection.effectiveType;
    }
}
  
  
// save and display performance data
function loadHandler() {
    savePerformanceData();
    displayPerformanceData()
}

// Performance data
  
// save performance data in localStorage
function savePerformanceData() {
    saveLoadStartTime();
    saveLoadEndTime();
    saveLoadTotalTime();
    saveResponseDuration();
    saveDomainLookupDuration();
}
  
// Save load start time in localStorage
function saveLoadStartTime() {
    deleteData('loadStartTime');
    var storageKey = 'loadStartTime_' + genKey();
    var storageVal = {
        loadStartTime: window.performance.timing.navigationStart
    };
    window.localStorage.setItem(storageKey, JSON.stringify(storageVal));
}
  
// Save load end time in localStorage
function saveLoadEndTime() {
    deleteData('loadEndTime');
    var storageKey = 'loadEndTime_' + genKey();
    var storageVal = {
        loadEndTime: window.performance.timing.domContentLoadedEventEnd
    };
    window.localStorage.setItem(storageKey, JSON.stringify(storageVal));
}
  
// save total load time in localStorage
function saveLoadTotalTime() {
    var storageKey = 'loadTotalTime_' + genKey();
    var storageVal = {
        loadTotalTime: (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart)
    };
    window.localStorage.setItem(storageKey, JSON.stringify(storageVal));
}
  
// save response duration in localStorage
function saveResponseDuration() {
    deleteData('responseDuration');
    var storageKey = 'responseDuration_' + genKey();
    var storageVal = {responseDuration: (window.performance.timing.responseEnd - window.performance.timing.responseStart)};
    window.localStorage.setItem(storageKey, JSON.stringify(storageVal));
}
  
// save domain lookup duration in localStorage
function saveDomainLookupDuration() {
    deleteData('domainLookupDuration');
    var storageKey = 'domainLookupDuration_' + genKey();
    var storageVal = {domainLookupDuration: (window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart)};
    window.localStorage.setItem(storageKey, JSON.stringify(storageVal));
}
  
// display collected performance data stored in localStorage
function displayPerformanceData() {
    if (window.location.pathname.endsWith('Reportertest.html')) {
      displayLoadStartTime();
      displayLoadEndTime();
      displayLoadTotalTime();
      displayResponseDuration();
      displayDomainLookupDuration();
    }
}
  
// display last loading start time stored in localStorage
function displayLoadStartTime() {
    var valueToDisplay = JSON.parse(extractData('loadStartTime')[0]).loadStartTime / 1000;
    document.getElementById('performance-start').innerHTML = valueToDisplay;
}

// display last loading end time stored in localStorage
function displayLoadEndTime() {
    var valueToDisplay = JSON.parse(extractData('loadEndTime')[0]).loadEndTime / 1000;
    document.getElementById('performance-end').innerHTML = valueToDisplay;
}
  
// display total loading total time stored in localStorage
function displayLoadTotalTime() {
    var i;
    var extractedData = extractData('loadTotalTime');
    var valueToDisplay = 0;
    for (i = 0; i < extractedData.length; i++) {
      valueToDisplay += ((JSON.parse(extractedData[i]).loadTotalTime) - valueToDisplay) / (i + 1);
    }
    document.getElementById('performance-total').innerHTML = valueToDisplay + ' ms';
}
  
// display response duration data stored in localStorage
function displayResponseDuration() {
    var valueToDisplay = JSON.parse(extractData('responseDuration')[0]).responseDuration;
    document.getElementById('performance-duration').innerHTML = valueToDisplay + ' ms';
}
  
// display domain lookup duration data stored in localStorage
function displayDomainLookupDuration() {
    var valueToDisplay = JSON.parse(extractData('domainLookupDuration')[0]).domainLookupDuration;
    document.getElementById('performance-lookup').innerHTML = valueToDisplay + ' ms';
}
  
// get current date and time in string
function getCurrentTime() {
    var nowTime = new Date();
    var currTime = nowTime.getFullYear() + (nowTime.getMonth() + 1) + nowTime.getDate() + 
    nowTime.getHours() + nowTime.getMinutes() + nowTime.getSeconds() + nowTime.getMilliseconds();
    
    return currTime;
}
  
// generate key for localStorage
function genKey() {
    return window.location.href + '_' + getCurrentTime();
}
  
// extract data from localStorage
function extractData(type) {
    var i;
    var output = [];
    
    for (i = 0; i < window.localStorage.length; i++) {
        if (window.localStorage.key(i).startsWith(type)) {
            output.push(window.localStorage.getItem(window.localStorage.key(i)));
        }
    }
    
    return output;
}
  
// delete data from localStorage
function deleteData(type) {
    var i;
    for (i = 0; i < window.localStorage.length; i++) {
        if (window.localStorage.key(i).startsWith(type)) {
            window.localStorage.removeItem(window.localStorage.key(i));
        }
    }
}
  
// Dynamic data
  
// add event listeners
function initEventListeners() {
    window.addEventListener('click', dynamicHandlerClick);
    window.addEventListener('mousemove', dynamicHandlerMouseMove);
    window.addEventListener('keydown', dynamicHandlerKeydown);
    window.addEventListener('scroll', dynamicHandlerScroll);
    window.addEventListener('beforeunload', dynamicHandlerUnload);
    if (document.getElementById('dynamic-delete') != null) {
        document.getElementById('dynamic-delete')
            .addEventListener('click',handleDeleteAllButton);
    }
}
  
// handle click data
function dynamicHandlerClick(e) {
    saveEventClick(e);
    saveEventPauseOrIdle(e);
    refreshDynamicEvent();
}
  
// handle cursor movement data
function dynamicHandlerMouseMove(e) {
    saveEventMouseMove(e);
    saveEventPauseOrIdle(e);
    refreshDynamicEvent();
}
  
// handle keydown data
function dynamicHandlerKeydown(e) {
    saveEventKeydown(e);
    saveEventPauseOrIdle(e);
    refreshDynamicEvent();
}
  
// handle scroll data
function dynamicHandlerScroll(e) {
    saveEventScroll(e);
    saveEventPauseOrIdle(e);
    refreshDynamicEvent();
}
  
// handle unload data
function dynamicHandlerUnload(e) {
    saveEventUnload(e);
    refreshDynamicEvent();
}
  
// save click event
function saveEventClick(e) {
    var storageKey = 'click_' + genKey();
    var storageVal = {
        dynamicType: 'Click',
        sourceTag: e.target.tagName,
        timeStamp: e.timeStamp + ' ms',
        buttonPressed: e.button,
        buttonsDepressed: e.buttons,
        xCoorDom: e.clientX,
        yCoorDom: e.clientY,
        xCoorScreen: e.screenX,
        yCoorScreen: e.screenY,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey
    };

    window.localStorage.setItem(storageKey, JSON.stringify(storageVal));
}
  
// save cursor movement
function saveEventMouseMove(e) {
    if (timedout_mousemove) {
      return;
    }

    timeout_mousemove();

    var storageKey = 'mousemove_' + genKey();
    var storageVal = {
        dynamicType: 'Mousemove',
        sourceTag: e.target.tagName,
        timeStamp: e.timeStamp + ' ms',
        buttonPressed: e.button,
        buttonsDepressed: e.buttons,
        xCoorDom: e.clientX,
        yCoorDom: e.clientY,
        xCoorScreen: e.screenX,
        yCoorScreen: e.screenY,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey
    };
    window.localStorage.setItem(storageKey, JSON.stringify(storageVal));
}
  
// save keystroke event
function saveEventKeydown(e) {
    if (timedout_keydown) {
      return;
    }

    timeout_keydown();

    var storageKey = 'keydown_' + genKey();
    var storageVal = {
        dynamicType: 'Keydown',
        sourceTag: e.target.tagName,
        timeStamp: e.timeStamp + ' ms',
        key: e.key,
        physicalKey: e.code,
        location: e.location,
        repeat: e.repeat,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey
    };
    window.localStorage.setItem (storageKey, JSON.stringify(storageVal));
}
  
// save scroll event
function saveEventScroll(e) {
    if (timedout_scroll) {
      return;
    }

    timeout_scroll();

    var storageKey = 'scroll_' + genKey();
    var direction;

    if (window.scrollY > oldScrollY) {
        direction = 'down';
    } else {
        direction = 'up';
    }
    oldScrollY = window.scrollY;
    var storageVal = {
        dynamicType: 'Scroll',
        sourceTag: e.target.tagName,
        timeStamp: e.timeStamp + ' ms',
        direction: direction
    };
    window.localStorage.setItem(storageKey, JSON.stringify(storageVal));
}
  
// save page unload event
function saveEventUnload(e) {
    var storageKey = 'unload_' + genKey();
    var storageVal = {
        dynamicType: 'Unload',
        timeStamp: e.timeStamp + ' ms'
    };

    window.localStorage.setItem(storageKey, JSON.stringify(storageVal));
}
  
// save idle (more than 5 seconds) event
function saveEventIdle(e) {
    timeout_pause();

    var storageKey = 'idle_' + genKey();
    var storageVal = {
        dynamicType: 'Idle',
        timeStamp: e.timeStamp + ' ms',
        duration: (Date.now() - lastEventTime) + 'ms'
    };
    window.localStorage.setItem(storageKey, JSON.stringify(storageVal));
  }
  
// save pause (less than 5 seconds)
function saveEventPause(e) {
    if (timedout_pause) {
        return;
    }

    timeout_pause();

    var storageKey = 'pause_' + genKey();
    var storageVal = {
        dynamicType: 'Pause',
        timeStamp: e.timeStamp + ' ms',
        duration: (Date.now() - lastEventTime) + 'ms'
    };
    window.localStorage.setItem(storageKey, JSON.stringify(storageVal));
}
  
// identify if it is pause event or idle event
  function saveEventPauseOrIdle(e) {
    clearTimeout(timeoutID_idle);
    
    if (idle_qualify) {
        saveEventIdle(e);
    } else {
        saveEventPause(e);
    }
    
    idle_qualify = false;
    timeoutID_idle = window.setTimeout(function() {idle_qualify = true;}, 5000);
    lastEventTime = Date.now();
}
  
// delete localStorage entry
function deleteEvent(key) {
    window.localStorage.removeItem(key);
}
  
// delete all localStorage entries
function clearEvents(key) {
    window.localStorage.clear();
}
  
// refresh for dynamic event
function refreshDynamicEvent() {
    if (window.location.pathname.endsWith('Reportertest.html')) {
        var i;
        var currObj;
        document.getElementById('div_dynamic-event-list').innerHTML = '';
        for (i = 0; i < window.localStorage.length; i++) {
            currObj = JSON.parse(window.localStorage.getItem(window.localStorage.key(i)));
            
            if (currObj.hasOwnProperty('dynamicType')) {
            displayDynamicEvent(currObj.dynamicType, window.localStorage.key(i));
        }
      }
    }
}
  
// display a dynamic event inside localStorage
  function displayDynamicEvent(typestr, storageKey) {
    var newEventDisplay = document.createElement('div');
    newEventDisplay.classList.add('dynamic-event-entry');
    newEventDisplay.appendChild(document.createElement('p'));
    newEventDisplay.children[0].classList.add('dynamic-event-entry-type');
    newEventDisplay.children[0].innerHTML = typestr;
    newEventDisplay.appendChild(document.createElement('img'));
    newEventDisplay.children[1].classList.add('dynamic-event-entry-del');
    newEventDisplay.children[1].src = './images/delete.png';
    newEventDisplay.children[1].alt = 'Delete';
    newEventDisplay.children[1].addEventListener('click', function() {
      handleDeleteButton(newEventDisplay.children[1]);
    });

    var storageKeyHolder = document.createElement('div');
    storageKeyHolder.innerHTML = storageKey;
    storageKeyHolder.hidden=true;
    storageKeyHolder.classList.add('storageKeyHolder');
    newEventDisplay.appendChild(storageKeyHolder);
    newEventDisplay.addEventListener('click', function() {
        displayDynEventInfo(newEventDisplay);
    });

    newEventDisplay.classList.add('dynamic-event-color-' + typestr.toLowerCase());
    document.getElementById('div_dynamic-event-list')
        .appendChild(newEventDisplay);
}
  
// delete dynamic event entry when clicking delete image
function handleDeleteButton(button) {
    deleteEvent(button.parentNode
        .getElementsByClassName('storageKeyHolder')[0].innerHTML);
    refreshDynamicEvent();
}
  
// Delete all entries on clicking button
function handleDeleteAllButton() {
    clearEvents();
}
  
// display dynamic event information in side box
function displayDynEventInfo(entry) {
    var infobox = document.getElementById('div_dynamic-event-info');
    infobox.innerHTML = '';
    var eventObj = JSON.parse(window.localStorage.getItem(entry.getElementsByClassName('storageKeyHolder')[0].innerHTML));
    if (eventObj == null) {
      return;
    }

    var eventData = Object.entries(eventObj);
    eventData.forEach(function(elem) {
        infobox.appendChild(document.createElement('div'));
        infobox.lastChild.appendChild(document.createElement('div'));
        infobox.lastChild.lastChild.classList.add('dynEvent-data-key');
        infobox.lastChild.lastChild.innerHTML = elem[0] + ':';
        infobox.lastChild.appendChild(document.createElement('div'));
        infobox.lastChild.lastChild.classList.add('dynEvent-data-content');
        infobox.lastChild.lastChild.innerHTML = elem[1];
    });
}
  
// set timeout mousemove event
function timeout_mousemove() {
    timedout_mousemove = true;
    clearTimeout(timeoutID_mousemove);
    timeoutID_mousemove = window.setTimeout(function() {
      timedout_mousemove = false;
    }, 500);
  }

// set timeout keydown event
function timeout_keydown() {
    timedout_keydown = true;
    clearTimeout(timeoutID_keydown);
    timeoutID_keydown = window.setTimeout(function() {
      timedout_keydown = false;
    }, 500);
}
  
// set timeout scroll event
function timeout_scroll() {
    timedout_scroll = true;
    clearTimeout(timeoutID_scroll);
    timeoutID_scroll = window.setTimeout(function() {
        timedout_scroll = false;
    }, 500);
}
  
// set timeout pause event
function timeout_pause() {
    timedout_pause = true;
    clearTimeout(timeoutID_pause);
    timeoutID_pause = window.setTimeout(function() {
        timedout_pause = false;
    }, 500);
}
  

// handle DOM load complete
window.addEventListener('DOMContentLoaded', loadDOMHandler);
  
// handle window complete load
window.addEventListener('load', loadHandler);
  
// timeouts for rapidly trigger-able events
var timedout_mousemove = false;
var timeoutID_mousemove;
var timedout_keydown = false;
var timeoutID_keydown;
var timedout_scroll = false;
var timeoutID_scroll;
var timedout_pause = false;
var timeoutID_pause;
  
var oldScrollY = window.scrollY; 
var lastEventTime = Date.now();  
var idle_qualify = false;
var timeoutID_idle = window.setTimeout(function() { idle_qualify = true; }, 2000);