var hostSite='https://cse135hw5-7d7b0.firebaseapp.com';
var endpointTracker='https://us-central1-cse135hw5-7d7b0.cloudfunctions.net/tracker';
var endpointCollect='https://us-central1-cse135hw5-7d7b0.cloudfunctions.net/collect';

/*var firebaseConfig = {
    apiKey: "AIzaSyCoy8PJSZzkOPiFu5wi8cGIyGWXemqBZ5s",
    authDomain: "cse135hw5-7d7b0.firebaseapp.com",
    databaseURL: "https://cse135hw5-7d7b0.firebaseio.com",
    projectId: "cse135hw5-7d7b0",
    storageBucket: "cse135hw5-7d7b0.appspot.com",
    messagingSenderId: "194867213159",
    appId: "1:194867213159:web:8d9d3fe6e4c5dd55f175c2",
    measurementId: "G-WZQJL8ZRF9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);*/

// Firebase firestore database
var db = firebase.firestore();
var collectionID = 'COLLECTION_KEY';
var documentID = 'DOCUMENT_KEY';


fetch(endpointTracker,{method:'HEAD',credentials:'include'}).then(res=>{
    if (!res.ok) {
        console.error('/tracker endpoint error');
    }
}).catch(e=>{
    console.error(e);
});

// DOM load
window.addEventListener('DOMContentLoaded',loadDOMHandler);
// Window load
window.addEventListener('load',loadHandler);

var collectedData = [];
var preScrollY = window.scrollY;
const idleTime = 5;
var idleCheck = false;
var timeoutidleCheck = window.setTimeout(function() {idleCheck = true}, (idleTime*1000));
var lastEventTime = Date.now();
const timeoutDynamicEventCollectInterval = 1000;
var timeoutDynamicEventCollectState = false;
var timeoutDynamicEventCollectTimer;
const timeoutPauseCollectInterval = timeoutDynamicEventCollectInterval;
var timeoutPauseCollectState = false;
var timeoutPauseCollectTimer;

function loadDOMHandler() {
    collectUserAgent();
    collectLanguage();
    collectCookieEnabled();
    collectJavaEnabled();
    collectImageEnabled();
    collectCSSEnabled();
    collectScreenDimensions();
    collectWindowSize();
    collectEffectiveConnectionType();
    initDynamicEventListeners()
}

function loadHandler() {
    collectLoadStartTime();
    collectLoadEndTime();
    collectLoadTotalTime();
    collectResponseDuration();
    collectDomainLookupDuration()
}

function initDynamicEventListeners() {
    window.addEventListener('click',collectDynamicEventClick);
    window.addEventListener('mousemove',collectDynamicEventMouseMove);
    window.addEventListener('keydown',collectDynamicEventKeyDown);
    window.addEventListener('scroll',collectDynamicEventScroll);
    window.addEventListener('beforeunload',collectDynamicEventBeforeUnload);
    window.addEventListener('click',collectDynamicEventPauseOrIdle);
    window.addEventListener('mousemove',collectDynamicEventPauseOrIdle);
    window.addEventListener('keydown',collectDynamicEventPauseOrIdle);
    window.addEventListener('scroll',collectDynamicEventPauseOrIdle)
}

function collectUserAgent() {
    var bodyObject = {
        dataType:'static',staticDataType:'useragent',dataValue:navigator.userAgent
    };
    collectObject(bodyObject)
}

function collectLanguage() {
    var bodyObject = {
        dataType:'static',staticDataType:'language',dataValue:navigator.language
    };
    collectObject(bodyObject)
}

function collectCookieEnabled() {
    var bodyObject = { 
        dataType:'static',staticDataType:'cookieenabled',dataValue:navigator.cookieEnabled
    };
    collectObject(bodyObject)
}

function collectJavaEnabled(){
    var bodyObject = {
        dataType:'static',staticDataType:'javaenabled',dataValue:navigator.javaEnabled()
    };
    collectObject(bodyObject)
}

function collectImageEnabled() {
    var bodyObject;
    var dataValue = false;
    var testImage = document.createElement('img');
    testImage.style.display = 'none';
    testImage.src = './../images/white_roses.jpg';
    document.getElementsByTagName('BODY')[0].appendChild(testImage);
    testImage.onload = function() {
        if (testImage.width > 0) {
            dataValue = true;
        }
        
        bodyObject = {
            dataType:'static',staticDataType:'imageenabled',dataValue:dataValue
        };            
        collectObject(bodyObject)
    };
    
    document.getElementsByTagName('BODY')[0].removeChild(testImage);
}

function collectCSSEnabled() {
    var dataValue = false;
    var testDiv = document.createElement('div');
    document.getElementsByTagName('BODY')[0].appendChild(testDiv);
    testDiv.style.width = '100px';
    
    if (testDiv.style.width == '100px') {
        dataValue = true;
    };
    
    document.getElementsByTagName('BODY')[0].removeChild(testDiv);
    var bodyObject = {
        dataType:'static',staticDataType:'cssenabled',dataValue:dataValue
    };   
    collectObject(bodyObject);
}

function collectScreenDimensions() {
    var bodyObject = {
        dataType:'static',staticDataType:'screendimensions',dataValue:(window.screen.width+' x '+window.screen.height)
    };    
    collectObject(bodyObject);
}

function collectWindowSize() {
    var bodyObject = {
        dataType:'static',staticDataType:'windowsize',dataValue:(window.innerWidth+' x '+window.innerHeight)
    };    
    collectObject(bodyObject);
}

function collectEffectiveConnectionType() {
    var dataValue;
    if (typeof(navigator.connection) === undefined) {
        dataValue = 'navigator.connection API not supported';
    } else {
        dataValue = navigator.connection.effectiveType;
    }
    
    var bodyObject = {
        dataType:'static',staticDataType:'effectiveconnectiontype',dataValue:dataValue
    };    
    collectObject(bodyObject);
}

function collectLoadStartTime() { 
    var bodyObject = {
        dataType:'performance',perfDataType:'loadstarttime',date:createDate(),dataValue:(window.performance.timing.navigationStart+' ms since UNIX epoch')
    };    
    collectObject(bodyObject);
}

function collectLoadEndTime() {
    var bodyObject = {
        dataType:'performance',perfDataType:'loadendtime',date:createDate(),dataValue:(window.performance.timing.domContentLoadedEventEnd+' ms since UNIX epoch')
    };    
    collectObject(bodyObject);
}

function collectLoadTotalTime() {
    var bodyObject = { 
        dataType:'performance',perfDataType:'loadtotaltime',date:createDate(),dataValue:((window.performance.timing.domContentLoadedEventEnd-window.performance.timing.navigationStart)+' ms')
    };    
    collectObject(bodyObject);
}

function collectResponseDuration() {
    var bodyObject = {
        dataType:'performance',perfDataType:'responseduration',date:createDate(),dataValue:((window.performance.timing.responseEnd-window.performance.timing.responseStart)+' ms')
    };    
    collectObject(bodyObject);
}

function collectDomainLookupDuration() { 
    var bodyObject = { 
        dataType:'performance',perfDataType:'domainlookupduration',date:createDate(),dataValue:((window.performance.timing.domainLookupEnd-window.performance.timing.domainLookupStart)+' ms')
    };    
    collectObject(bodyObject);
}

function collectDynamicEventClick(e) {
    if (timeoutDynamicEventCollect()) {
        return;
    }
    
    var bodyObject = {
        dataType:'dynamic',eventType:'click',date:createDate(),url:window.location.href,sourceTag:e.target.tagName,buttonPressed:e.button,buttonsDepressed:e.buttons,xCoorDOM:e.clientX,yCoorDOM:e.clientY,xCoorScreen:e.screenX,yCoorScreen:e.screenY,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,shiftKey:e.shiftKey
    };    
    collectObject(bodyObject);
}

function collectDynamicEventMouseMove(e) {
    if (timeoutDynamicEventCollect()) {
        return;
    }
    
    var bodyObject = {
        dataType:'dynamic',eventType:'mousemove',date:createDate(),url:window.location.href,sourceTag:e.target.tagName,buttonPressed:e.button,buttonsDepressed:e.buttons,xCoorDOM:e.clientX,yCoorDOM:e.clientY,xCoorScreen:e.screenX,yCoorScreen:e.screenY,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,shiftKey:e.shiftKey
    };    
    collectObject(bodyObject);
}

function collectDynamicEventKeyDown(e) {
    if (timeoutDynamicEventCollect()) {
        return;
    }
    
    var bodyObject = {
        dataType:'dynamic',eventType:'keydown',date:createDate(),url:window.location.href,sourceTag:e.target.tagName,key:e.key,physicalKey:e.code,location:e.location,repeat:e.repeat,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,shiftKey:e.shiftKey
    };    
    collectObject(bodyObject);
}

function collectDynamicEventScroll(e) {
    if (timeoutDynamicEventCollect()) {
        return;
    }
    
    var scrollDirection = 'down';
    if (window.scrollY < preScrollY) {
        scrollDirection = 'up';
    }
    
    preScrollY = window.scrollY;
    
    var bodyObject = {
        dataType:'dynamic',eventType:'scroll',date:createDate(),url:window.location.href,sourceTag:e.target.tagName,direction:scrollDirection
    };    
    collectObject(bodyObject);
}

function collectDynamicEventBeforeUnload(e) {
    var bodyObject = {
        dataType:'dynamic',eventType:'beforeunload',date:createDate(),url:window.location.href
    };    
    collectObject(bodyObject);
}

function collectDynamicEventPauseOrIdle(e) {
    clearTimeout(timeoutidleCheck);
    if (idleCheck) {
        collectDynamicEventIdle(e);
    } else {
        collectDynamicEventPause(e);
    }
    
    idleCheck = false;
    timeoutidleCheck = window.setTimeout(function() { dleQualify=true },(idleTime*1000));   
    lastEventTime = Date.now();
}

function collectDynamicEventPause(e) { 
    if (timeoutPauseCollect()) {
        return;
    }
    
    var bodyObject = {
        dataType:'dynamic',eventType:'pause',date:createDate(),url:window.location.href,duration:(Date.now()-lastEventTime)+' ms'
    };    
    collectObject(bodyObject);
}

function collectDynamicEventIdle(e) {
    var bodyObject = {
        dataType:'dynamic',eventType:'idle',date:createDate(),url:window.location.href,duration:(Date.now()-lastEventTime)+' ms'
    };    
    collectObject(bodyObject);
}

function collectObject(obj) {
    collectedData.push(obj);
}


function pushData() {
    if (collectedData.length === 0) {
        return;
    }

    if (firebase.auth().currentUser === null) {
        fetch(endpointCollect, {method:'POST',credentials:'include',body:JSON.stringify(collectedData)
        }).then (res => {
            if (!res.ok) {
                console.error('/collect endpoint error');
            }           
            collectedData=[];
        }).catch (e => {
            console.error(e);
        })
    } else {
        var i;
        for (i = 0; i < collectedData.length; i++) {
            collectionID = firebase.auth().currentUser.uid;
            try {
                if (collectedData[i].staticDataType === 'static') {
                    documentID = collectedData[i].staticDataType;
                    db.collection(collectionID).doc(documentID).set({
                        'dataType': collectedData[i].dataType,
                        'staticDataType': collectedData[i].staticDataType,
                        'value': collectedData[i].dataValue});
                } else if (collectedData[i].dataType === 'performance') {
                    documentID = collectedData[i].perfDataType;
                    db.collection(collectionID).doc(documentID).set({
                        'dataType': collectedData[i].dataType,
                        'perfDataType': collectedData[i].perfDataType,
                        'value': collectedData[i].dataValue});
                } else if (collectedData[i].dataType === 'dynamic') {
                    documentID = 'dynamicEvent_' + collectedData[i].date;
                    if (collectedData[i].eventType === 'click') {
                        db.collection(collectionID).doc(documentID).set({ // click event
                            'date': collectedData[i].date,
                            'url': collectedData[i].url,
                            'dataType': collectedData[i].dataType,
                            'eventType': collectedData[i].eventType,
                            'xCoorDOM': collectedData[i].xCoorDOM,
                            'yCoorDOM': collectedData[i].yCoorDOM,
                            'xCoorScreen': collectedData[i].xCoorScreen,
                            'yCoorScreen': collectedData[i].yCoorScreen,
                            'buttonPressed': collectedData[i].buttonPressed,
                            'buttonsDepressed': collectedData[i].buttonsDepressed,
                            'ctrlKey': collectedData[i].ctrlKey,
                            'altKey': collectedData[i].altKey,
                            'shiftKey': collectedData[i].shiftKey,
                            'metaKey': collectedData[i].metaKey});
                        } else if (collectedData[i].eventType === 'mousemove') { // mouse move event
                            db.collection(collectionID).doc(documentID).set({
                                'date': collectedData[i].date,
                                'url': collectedData[i].url,
                                'dataType': collectedData[i].dataType,
                                'eventType': collectedData[i].eventType,
                                'xCoorDOM': collectedData[i].xCoorDOM,
                                'yCoorDOM': collectedData[i].yCoorDOM,
                                'xCoorScreen': collectedData[i].xCoorScreen,
                                'yCoorScreen': collectedData[i].yCoorScreen,
                                'buttonPressed': collectedData[i].buttonPressed,
                                'buttonsDepressed': collectedData[i].buttonsDepressed,
                                'ctrlKey': collectedData[i].ctrlKey,
                                'altKey': collectedData[i].altKey,
                                'shiftKey': collectedData[i].shiftKey,
                                'metaKey': collectedData[i].metaKey});
                        } else if (collectedData[i].eventType === 'keydown') { // key down event
                            db.collection(collectionID).doc(documentID).set({
                                'date': collectedData[i].date,
                                'url': collectedData[i].url,
                                'location': collectedData[i].location,
                                'dataType': collectedData[i].dataType,
                                'eventType': collectedData[i].eventType,
                                'key': collectedData[i].key,
                                'physicalKey': collectedData[i].physicalKey,
                                'repeat': collectedData[i].repeat,
                                'ctrlKey': collectedData[i].ctrlKey,
                                'altKey': collectedData[i].altKey,
                                'shiftKey': collectedData[i].shiftKey,
                                'metaKey': collectedData[i].metaKey});
                        } else if (collectedData[i].eventType === 'scroll') { // scroll event
                            db.collection(collectionID).doc(documentID).set({
                                'dataType': collectedData[i].dataType,
                                'eventType': collectedData[i].eventType,
                                'date': collectedData[i].date,
                                'url': collectedData[i].url,                                                
                                'direction': collectedData[i].direction});
                        } else if (collectedData[i].eventType === 'beforeunload') { // before unload event
                            db.collection(collectionID).doc(documentID).set({
                                'dataType': collectedData[i].dataType,
                                'eventType': collectedData[i].eventType,
                                'date': collectedData[i].date,
                                'url': collectedData[i].url});
                        } else if (collectedData[i].eventType === 'pause') { // pause event
                            db.collection(collectionID).doc(documentID).set({
                                'dataType': collectedData[i].dataType,
                                'eventType': collectedData[i].eventType,
                                'date': collectedData[i].date,
                                'url': collectedData[i].url,
                                'duration': collectedData[i].duration});
                        } else if (collectedData[i].eventType === 'idle') { // idle event
                            db.collection(collectionID).doc(documentID).set({
                                'dataType': collectedData[i].dataType,
                                'eventType': collectedData[i].eventType,
                                'date': collectedData[i].date,
                                'url': collectedData[i].url,
                                'duration': collectedData[i].duration});
                        }
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
}

// Helper: create date string
function createDate() {
    var dateObject = new Date();
    var output = dateObject.getFullYear() + '_' + (dateObject.getMonth() + 1) + '_' + dateObject.getDate() + '_' 
        + dateObject.getHours() + '_' + dateObject.getMinutes() + '_' + dateObject.getSeconds() + '_' + dateObject.getMilliseconds();
    return output;
}

function timeoutDynamicEventCollect() {
    if (timeoutDynamicEventCollectState) {
        return true;
    }
    timeoutDynamicEventCollectState = true;
    timeoutDynamicEventCollectTimer = window.setTimeout(function() {timeoutDynamicEventCollectState=false},timeoutDynamicEventCollectInterval);
    return false;
}

function timeoutPauseCollect() {
    if (timeoutPauseCollectState) {
        return true;
    }
    timeoutPauseCollectState = true;    
    timeoutPauseCollectTimer = window.setTimeout(function(){timeoutPauseCollectState=false},timeoutPauseCollectInterval);
    return false;
}