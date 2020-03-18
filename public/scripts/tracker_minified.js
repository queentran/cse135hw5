var emulator = false;
var hostedSite;
var endpointTracker;
var endpointCollect;
if (emulator) {
    hostedSite = 'http://localhost:5000';
    endpointTracker = 'http://localhost:5001/cse135hw4-82ae1/us-central1/tracker';
    endpointCollect = 'http://localhost:5001/cse135hw4-82ae1/us-central1/collect';
} else {
    hostedSite = 'https://cse135hw4-82ae1.firebaseapp.com';
    endpointTracker = 'https://us-central1-cse135hw4-82ae1.cloudfunctions.net/tracker';
    endpointCollect = 'https://us-central1-cse135hw4-82ae1.cloudfunctions.net/collect';
}

// receive session cookie from /tracker endpoint
fetch(endpointTracker, {
    method: 'HEAD',
    credentials: 'include'
})
.then(res => {
    if (!res.ok) {
        console.error('Error: /tracker endpoint');
    }
})
.catch(err => {
    console.error(err);
});

// handle DOM load completion
window.addEventListener('DOMContentLoaded', loadDOMHandler);

// handle window complete load
window.addEventListener('load', loadHandler);

// array of JSON objects to hold collected user data
var collectedData = [];

// period start time to push data to /collect endpoint
const periodTime = 10; //seconds
var periodicStore = setInterval(pushData, (periodTime * 1000));

// previous vertical scroll
var preScrollY = window.scrollY;

// idle time in seconds
const idleTime = 5;

// check if next event triggers pause/idle
var idleCheck = false;

// idle check change
var timeoutidleCheck = window.setTimeout(function() {
  idleCheck = true;
}, (idleTime * 1000));

// last pause/idle event time
var lastEventTime = Date.now();

// dynamic event timeout
const timeoutDynamicEventCollectInterval = 1000; // 1 sec
var timeoutDynamicEventCollectState = false;
var timeoutDynamicEventCollectTimer;

// Pause collection timeout
const timeoutPauseCollectInterval = timeoutDynamicEventCollectInterval;
var timeoutPauseCollectState = false;
var timeoutPauseCollectTimer;


// Called upon DOM completing load
function loadDOMHandler() {
    // Collect static data
    collectUserAgent();
    collectLanguage();
    collectCookieEnabled();
    collectJavaEnabled();
    collectImageEnabled();
    collectCSSEnabled();
    collectScreenDimensions();
    collectWindowSize();
    collectEffectiveConnectionType();
    // initialize dynamic event listeners
    initDynamicEventListeners();
}

// call upon DOM and dependencies
function loadHandler() {
    // collect performance data
    collectLoadStartTime();
    collectLoadEndTime();
    collectLoadTotalTime();
    collectResponseDuration();
    collectDomainLookupDuration();
}

// initialize event listeners for dynamic events
function initDynamicEventListeners() {
   window.addEventListener('click', collectDynamicEventClick);
    window.addEventListener('mousemove', collectDynamicEventMouseMove);
    window.addEventListener('keydown', collectDynamicEventKeyDown);
    window.addEventListener('scroll', collectDynamicEventScroll);
    window.addEventListener('beforeunload', collectDynamicEventBeforeUnload);
    window.addEventListener('click', collectDynamicEventPauseOrIdle);
    window.addEventListener('mousemove', collectDynamicEventPauseOrIdle);
    window.addEventListener('keydown', collectDynamicEventPauseOrIdle);
    window.addEventListener('scroll', collectDynamicEventPauseOrIdle);
}


// static data collection
function collectUserAgent() {
    var bodyObj = {
    dataType: 'static',
    staticDataType: 'useragent',
    dataValue: navigator.userAgent
    };
  collectObject(bodyObj);
}

function collectLanguage() {
    var bodyObj = {
        dataType: 'static',
        staticDataType: 'language',
        dataValue: navigator.language
    };
  collectObject(bodyObj);
}

function collectCookieEnabled() {
    var bodyObj = {
      dataType: 'static',
      staticDataType: 'cookieenabled',
      dataValue: navigator.cookieEnabled
    };
    collectObject(bodyObj);
}

function collectJavaEnabled() {
    var bodyObj = {
        dataType: 'static',
        staticDataType: 'javaenabled',
        dataValue: navigator.javaEnabled()
    };
    collectObject(bodyObj);
}

function collectImageEnabled() {
    var bodyObj;
    var val = false;
    var testImg = document.createElement('img');
    testImg.style.display = 'none';
    testImg.src = '../images/test-image.jpeg';
    document.getElementsByTagName('BODY')[0].appendChild(testImg);
    testImg.onload = function() {
        if (testImg.width > 0) {
            val = true;
        }
        bodyObj = {
            dataType: 'static',
            staticDataType: 'imageenabled',
            dataValue: val
        };
        collectObject(bodyObj);
    };
    document.getElementsByTagName('BODY')[0].removeChild(testImg);
}

function collectCSSEnabled() {
    var val = false;
    var testDiv = document.createElement('div');
    document.getElementsByTagName('BODY')[0].appendChild(testDiv);
    testDiv.style.width = '123px';
    if (testDiv.style.width == '123px') {
        val = true;
    };
    document.getElementsByTagName('BODY')[0].removeChild(testDiv);
  
    var bodyObj = {
        dataType: 'static',
        staticDataType: 'cssenabled',
        dataValue: val
    };
    collectObject(bodyObj);
}

function collectScreenDimensions() {
    var bodyObj = {
        dataType: 'static',
        staticDataType: 'screendimensions',
        dataValue: (window.screen.width + ' x ' + window.screen.height)
    };
    collectObject(bodyObj);
}

function collectWindowSize() {
    var bodyObj = {
        dataType: 'static',
        staticDataType: 'windowsize',
        dataValue: (window.innerWidth + ' x ' + window.innerHeight)
    };
    collectObject(bodyObj);
}

function collectEffectiveConnectionType() {
    var val;
    if (typeof(navigator.connection) === undefined) {
        val = 'navigator.connection API not supported';
    } else {
        val = navigator.connection.effectiveType;
    }

    var bodyObj = {
        dataType: 'static',
        staticDataType: 'effectiveconnectiontype',
        dataValue: val
    };
    collectObject(bodyObj);
}

// performance data collection

function collectLoadStartTime() {
    var bodyObj = {
        dataType: 'performance',
        perfDataType: 'loadstarttime',
        date: generateDate(),
        dataValue: (window.performance.timing.navigationStart)
    };
    collectObject(bodyObj);
}

function collectLoadEndTime() {
    var bodyObj = {
        dataType: 'performance',
        perfDataType: 'loadendtime',
        date: generateDate(),
        dataValue: (window.performance.timing.domContentLoadedEventEnd)
    };
    collectObject(bodyObj);
}

function collectLoadTotalTime() {
    var bodyObj = {
        dataType: 'performance',
        perfDataType: 'loadtotaltime',
        date: generateDate(),
        dataValue: ((window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart) + ' ms')
    };
    collectObject(bodyObj);
}

function collectResponseDuration() {
    var bodyObj = {
        dataType: 'performance',
        perfDataType: 'responseduration',
        date: generateDate(),
        dataValue: ((window.performance.timing.responseEnd - window.performance.timing.responseStart) + ' ms')
    };
    collectObject(bodyObj);
}

function collectDomainLookupDuration() {
    var bodyObj = {
      dataType: 'performance',
      perfDataType: 'domainlookupduration',
      date: generateDate(),
      dataValue: ((window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart) + ' ms')
    };
    collectObject(bodyObj);
}

// dynamic event data collection

function collectDynamicEventClick(e) {
    if(timeoutDynamicEventCollect()) {
        return;
    }
    var bodyObj = {
        dataType: 'dynamic',
        eventType: 'click',
        date: generateDate(),
        url: window.location.href,
        sourceTag: e.target.tagName,
        buttonPressed: e.button,
        buttonsDepressed: e.buttons,
        xCoorDOM: e.clientX,
        yCoorDOM: e.clientY,
        xCoorScreen: e.screenX,
        yCoorScreen: e.screenY,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey
    };
    collectObject(bodyObj);
}

function collectDynamicEventMouseMove(e) {
    if (timeoutDynamicEventCollect()) {
        return;
    }

    var bodyObj = {
        dataType: 'dynamic',
        eventType: 'mousemove',
        date: generateDate(),
        url: window.location.href,
        sourceTag: e.target.tagName,
        buttonPressed: e.button,
        buttonsDepressed: e.buttons,
        xCoorDOM: e.clientX,
        yCoorDOM: e.clientY,
        xCoorScreen: e.screenX,
        yCoorScreen: e.screenY,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey
    };
    collectObject(bodyObj);
}

function collectDynamicEventKeyDown(e) {
    if (timeoutDynamicEventCollect()) {
        return;
    }

    var bodyObj = {
        dataType: 'dynamic',
        eventType: 'keydown',
        date: generateDate(),
        url: window.location.href,
        sourceTag: e.target.tagName,
        key: e.key,
        physicalKey: e.code,
        location: e.location,
        repeat: e.repeat,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey
    };
    collectObject(bodyObj);
}

function collectDynamicEventScroll(e) {
    if  (timeoutDynamicEventCollect()) {
        return;
    }

    var scrollDirection = 'down';
    if (window.scrollY < preScrollY) {
        scrollDirection = 'up';
    }
    preScrollY = window.scrollY;
    var bodyObj = {
        dataType: 'dynamic',
        eventType: 'scroll',
        date: generateDate(),
        url: window.location.href,
        sourceTag: e.target.tagName,
        direction: scrollDirection
    };

    collectObject(bodyObj);
}

function collectDynamicEventBeforeUnload(e) {
    var bodyObj = {
        dataType: 'dynamic',
        eventType: 'beforeunload',
        date: generateDate(),
        url: window.location.href
    };
    collectObject(bodyObj);
}

function collectDynamicEventPauseOrIdle(e) {
    clearTimeout(timeoutidleCheck);
    if (idleCheck) {
        collectDynamicEventIdle(e);
    } else {
        collectDynamicEventPause(e);
    }
    idleCheck = false;
    timeoutidleCheck = window.setTimeout(function() {
        idleCheck = true;
    }, (idleTime * 1000));
    lastEventTime = Date.now();
}

function collectDynamicEventPause(e) {
    if (timeoutPauseCollect()) {
        return;
    }
    var bodyObj = {
        dataType: 'dynamic',
        eventType: 'pause',
        date: generateDate(),
        url: window.location.href,
        duration: (Date.now() - lastEventTime) + ' ms'
    };
    collectObject(bodyObj);
}

function collectDynamicEventIdle(e) {
    var bodyObj = {
        dataType: 'dynamic',
        eventType: 'idle',
        date: generateDate(),
        url: window.location.href,
        duration: (Date.now() - lastEventTime) + ' ms'
    };
    collectObject(bodyObj);
}

// ------------------------------------------------------------

// object array to push to /collect endpoint
function collectObject(obj) {
    collectedData.push(obj);
}

// a POST request with array of JSON objects to /collect endpoint
function pushData() {
    if (collectedData.length === 0) {
        return;
    }
    fetch(endpointCollect, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(collectedData)
    })
    .then(res => {
        if(!res.ok) {
            console.error('Error: /collect endpoint with error');
        }
        // clear collected data
        collectedData = [];
    })
    .catch(err => {
      console.error(err);
    });
}

// make string with current date and time
function generateDate() {
    var dateObj = new Date();
    var output = dateObj.getFullYear() + (dateObj.getMonth() + 1) + dateObj.getDate() +
       dateObj.getHours() + dateObj.getMinutes() + dateObj.getSeconds() + dateObj.getMilliseconds();
    return output;
}

// check if dynamic event collection is timeout or not
// if not, set timeout
function timeoutDynamicEventCollect() {
    if (timeoutDynamicEventCollectState) {
        return true;
    }
    timeoutDynamicEventCollectState = true;
    timeoutDynamicEventCollectTimer = window.setTimeout(function() {
        timeoutDynamicEventCollectState = false;
    }, timeoutDynamicEventCollectInterval);
    return false;
}

// check if pause collection is timeout or not
// if not, set timeout
function timeoutPauseCollect() {
    if  (timeoutPauseCollectState) {
        return true;
    }
    timeoutPauseCollectState = true;
    timeoutPauseCollectTimer = window.setTimeout(function() {
        timeoutPauseCollectState = false;
    }, timeoutPauseCollectInterval);
    return false;
}