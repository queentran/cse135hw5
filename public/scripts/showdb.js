endpoint = 'https://us-central1-cse135hw5-7d7b0.cloudfunctions.net/showdb';

var viewContainer;
var viewList;

// refresh period time
const refreshPeriodInSec = 10;
var periodicRefresh;

// load handler
window.onload = function() {
    // refresh data
    viewContainer = document.getElementById('div_firestore-show');
    viewList = document.getElementById('ul_firestore-show');

    // loading message
    let refreshNote = document.createElement('p');
    refreshNote.innerHTML = 'Loading data...';
    viewContainer.appendChild(refreshNote);

    // period refresh
    periodicRefresh = window.setTimeout(function() {
      // refresh view in DOM
      refreshView();

      // refresh period
      periodicRefresh = setInterval(refreshView, (refreshPeriodInSec * 1000));
    }, 5000);
};

// refresh view in DOM
function refreshView() {
    // call /showdb endpoint and receive array of JSON objects
    fetch(endpoint, {
        method: 'GET',
      credentials: 'include'
    })
    .then(res => {        
        if (!res.ok) { // no session ID sent in request
            // show error description
            return res.text();
        } else { // no error, extract data from response body
        // parse response body into JSON object
        return res.json();
        }
    })
    .then(passedIn => {
        if (typeof passedIn === 'string') {
            deleteView();
            // display error message
            console.error('/showdb: ' + passedIn);
            let refreshNote = document.createElement('p');
            refreshNote.innerHTML = passedIn;
            viewContainer.appendChild(refreshNote);
            return 0;
        }

        // get from response body
        let dataObjArray = passedIn;

        // delete view data
        deleteView();

        // length = 0, no data for this session ID
        if (dataObjArray.length == 0) {
            // display message
            console.error('No data in database for ' + 'session ID.');
            
            let refreshNote = document.createElement('p');
            refreshNote.innerHTML = 'No data found in database for your session ID.';
            viewContainer.appendChild(refreshNote);          
            return 0;
        }

        // display data
        let i;
        for (i = 0; i < dataObjArray.length; i++) {
            let currDataObj = dataObjArray[i];
            let currLI = document.createElement('li');
            currLI.className = 'viewListElement';
            for (let key in currDataObj) {
                if(currDataObj.hasOwnProperty(key)) {
                    let currField = document.createElement('div');
                    currField.className = 'viewListElement';
                    currField.innerHTML
                    = key + ': ' + currDataObj[key];
                    currLI.appendChild(currField);
                }
            }
          viewList.appendChild(currLI);
        }
        return 0;
    })
    .catch (err => {
      console.error(err);
      // delete view data
      deleteView();
      // display message
      let refreshNote = document.createElement('p');
      refreshNote.innerHTML
      = 'Error fetching from database.';
      viewContainer.appendChild(refreshNote);

    });
}

function deleteView() {
    // clear list items
    while(viewList.firstChild) {
        viewList.removeChild(viewList.lastChild);
    }

    // clear all
    while(viewContainer.lastChild !== viewList) {
      viewContainer.removeChild(viewContainer.lastChild);
    }
}