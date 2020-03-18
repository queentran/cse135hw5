/**
    Source: https://codelabs.developers.google.com/codelabs/firestore-web/#5
 */
'use strict';

const provider = new firebase.auth.GoogleAuthProvider();

/**
 * Initializes the Browsers app.
 */
function Browsers() {
    this.filters = {
        company: '',
        os: '',
        sort: 'Rating'
    };

    this.dialogs = {};

    var that = this;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            updateNavigationLink();
            that.initTemplates();
            that.initRouter();
            that.initReviewDialog();
            that.initFilterDialog();
        } else {
            // Navigate to login page
            window.location.href = '/login.html';
        }
    });
}

function updateNavigationLink() {
    document.getElementById('speedPage').style.visibility = 'visible';
    document.getElementById('browserPage').style.visibility = 'visible';
    document.getElementById('logoutPage').href = '/login.html';
}

window.addEventListener('load', function() {
    // Add event listener for signout button
    document.getElementById('logoutPage').addEventListener('click', signOut);
});

function signOut() {
    firebase.auth().signOut();
}

/**
 * Initializes the router for the Browsers app.
 */
//var Navigo = require('navigo');
Browsers.prototype.initRouter = function() {
    this.router = new Navigo();

    var that = this;
    this.router
        .on({
            '/': function() {
                that.updateQuery(that.filters);
            }
        })
        .on({
            '/setup': function() {
                that.viewSetup();
            }
        })
        .on({
            '/browsers/*': function() {
                var path = that.getCleanPath(document.location.pathname);
                var id = path.split('/')[2];
                that.viewBrowser(id);
            }
        })
        .resolve();

    firebase
        .firestore()
        .collection('browsers')
        .limit(1)
        .onSnapshot(function(snapshot) {
            if (snapshot.empty) {
                that.router.navigate('/setup');
            }
        });
};

Browsers.prototype.getCleanPath = function(dirtyPath) {
    if (dirtyPath.startsWith('/index.html')) {
        return dirtyPath.split('/').slice(1).join('/');
    } else {
        return dirtyPath;
    }
};

Browsers.prototype.getFirebaseConfig = function() {
    return firebase.app().options;
};

Browsers.prototype.getRandomItem = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

Browsers.prototype.data = {
    companies: [
        'Microsoft',
        'Mozzilla',
        'Google',
        'Apple'     
    ],
    oses: [
        'Linux',
        'Windows',
        'Mac'
    ],
    ratings: [
        {
            rating: 1,
            text: 'Bad'
        },
        {
            rating: 2,
            text: 'Not good'
        },
        {
            rating: 3,
            text: 'Just okay'
        },
        {
            rating: 4,
            text: 'Pretty good'
        },
        {
            rating: 5,
            text: 'Very good'
        }
    ]
};

window.onload = function() {
    window.app = new Browsers();
};
