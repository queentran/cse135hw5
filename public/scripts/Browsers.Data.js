/**
    Source: https://codelabs.developers.google.com/codelabs/firestore-web/#5
 */
'use strict';

Browsers.prototype.addBrowser = function(data) {
  var collection = firebase.firestore().collection('browsers');
  return collection.add(data);
};

Browsers.prototype.getAllBrowsers = function(renderer) {
  /*
    TODO: Retrieve list of browsers
  */
  var query = firebase.firestore()
      .collection('browsers')
      .orderBy('avgRating', 'desc')
      .limit(50);

  this.getDocumentsInQuery(query, renderer);
};

Browsers.prototype.getDocumentsInQuery = function(query, renderer) {
  /*
    TODO: Render all documents in the provided query
  */
  query.onSnapshot(function(snapshot) {
    if (!snapshot.size) return renderer.empty(); // Display "There are no browsers".

    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        renderer.remove(change.doc);
      } else {
        renderer.display(change.doc);
      }
    });
  });
};

Browsers.prototype.getBrowser = function(id) {
  /*
    TODO: Retrieve a single restaurant
  */
  return firebase.firestore().collection('browsers').doc(id).get();
};

Browsers.prototype.getFilteredBrowsers = function(filters, renderer) {
  /*
    TODO: Retrieve filtered list of browsers
  */
  var query = firebase.firestore().collection('browsers');

  if (filters.os !== 'Any') {
    query = query.where('os', '==', filters.os);
  }

  if (filters.company !== 'Any') {
    query = query.where('company', '==', filters.company);
  }

  if (filters.sort === 'Rating') {
    query = query.orderBy('avgRating', 'desc');
  } else if (filters.sort === 'Reviews') {
    query = query.orderBy('numRatings', 'desc');
  }

  this.getDocumentsInQuery(query, renderer);
};

Browsers.prototype.addRating = function(browserID, rating) {
  /*
    TODO: Retrieve add a rating to a restaurant
  */
  var collection = firebase.firestore().collection('browsers');
  var document = collection.doc(browserID);
  var newRatingDocument = document.collection('ratings').doc();

  return firebase.firestore().runTransaction(function(transaction) {
    return transaction.get(document).then(function(doc) {
      var data = doc.data();

      var newAverage =
          (data.numRatings * data.avgRating + rating.rating) /
          (data.numRatings + 1);

      transaction.update(document, {
        numRatings: data.numRatings + 1,
        avgRating: newAverage
      });
      return transaction.set(newRatingDocument, rating);
    });
  });
};
