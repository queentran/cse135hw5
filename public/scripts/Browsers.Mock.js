/**
    Source: https://codelabs.developers.google.com/codelabs/firestore-web/#5
 */
'use strict';

/**
 * Adds a set of mock Browsers to the Cloud Firestore.
 */
Browsers.prototype.addMockBrowsers = function() {
  var promises = [];

  for (var i = 0; i < 20; i++) {
    var name =
        this.getRandomItem(this.data.words) +
        ' ' +
        this.getRandomItem(this.data.words);
    var os = this.getRandomItem(this.data.oses);
    var company = this.getRandomItem(this.data.companies);
    var photoID = Math.floor(Math.random() * 22) + 1;
    var photo = './images/chrome.jpg';
    var numRatings = 0;
    var avgRating = 0;

    var promise = this.addBrowser({
      name: name,
      os: os,
      company: company,
      numRatings: numRatings,
      avgRating: avgRating,
      photo: photo
    });

    if (!promise) {
      alert('addBrowser() is not implemented yet!');
      return Promise.reject();
    } else {
      promises.push(promise);
    }
  }

  return Promise.all(promises);
};

/**
 * Adds a set of mock Ratings to the given Browser.
 */
Browsers.prototype.addMockRatings = function(browserID) {
  var ratingPromises = [];
  for (var r = 0; r < 5*Math.random(); r++) {
    var rating = this.data.ratings[
      parseInt(this.data.ratings.length*Math.random())
    ];
    rating.userName = 'Bot (Web)';
    rating.timestamp = new Date();
    rating.userId = firebase.auth().currentUser.uid;
    ratingPromises.push(this.addRating(browserID, rating));
  }
  return Promise.all(ratingPromises);
};