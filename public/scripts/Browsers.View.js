/**
    Source: https://codelabs.developers.google.com/codelabs/firestore-web/#5
 */
'use strict';

Browsers.prototype.initTemplates = function() {
  this.templates = {};

  var that = this;
  document.querySelectorAll('.template').forEach(function(el) {
    that.templates[el.getAttribute('id')] = el;
  });
};

Browsers.prototype.viewHome = function() {
  this.getAllBrowsers();
};

Browsers.prototype.viewList = function(filters, filter_description) {
  if (!filter_description) {
    filter_description = 'any type of os and any company';
  }

  var mainEl = this.renderTemplate('main-adjusted');
  var headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: true
  });

  this.replaceElement(
    headerEl.querySelector('#section-header'),
    this.renderTemplate('filter-display', {
      filter_description:filter_description
    })
  );

  this.replaceElement(document.querySelector('.header'), headerEl);
  this.replaceElement(document.querySelector('main'), mainEl);

  var that = this;
  headerEl.querySelector('#show-filters').addEventListener('click', function() {
    that.dialogs.filter.show();
  });

  var renderer = {
    remove: function(doc) {
      var locationCardToDelete = mainEl.querySelector('#doc-' + doc.id);
      if (locationCardToDelete) {
        mainEl.querySelector('#cards').removeChild(locationCardToDelete.parentNode);
      }

      return;
    },
    display: function(doc) {
      var data = doc.data();
      data['.id'] = doc.id;
      data['go_to_browser'] = function() {
        that.router.navigate('/browsers/' + doc.id);
      };
  
      var el = that.renderTemplate('browser-card', data);
      el.querySelector('.rating').append(that.renderRating(data.avgRating));
      // Setting the id allows to locating the individual browser card
      el.querySelector('.location-card').id = 'doc-' + doc.id;
  
      var existingLocationCard = mainEl.querySelector('#doc-' + doc.id);
      if (existingLocationCard) {
        // modify
        existingLocationCard.parentNode.before(el);
        mainEl.querySelector('#cards').removeChild(existingLocationCard.parentNode);
      } else {
        // add
        mainEl.querySelector('#cards').append(el);
      }
    },
    empty: function() {
      var headerEl = that.renderTemplate('header-base', {
        hasSectionHeader: true
      });

      var noResultsEl = that.renderTemplate('no-results');

      that.replaceElement(
        headerEl.querySelector('#section-header'),
        that.renderTemplate('filter-display', {
          filter_description: filter_description
        })
      );

      headerEl.querySelector('#show-filters').addEventListener('click', function() {
        that.dialogs.filter.show();
      });

      that.replaceElement(document.querySelector('.header'), headerEl);
      that.replaceElement(document.querySelector('main'), noResultsEl);
      return;
    }
  };

  if (filters.company || filters.os || filters.price || filters.sort !== 'Rating' ) {
    this.getFilteredbrowsers({
      company: filters.company || 'Any',
      os: filters.os || 'Any',
      sort: filters.sort
    }, renderer);
  } else {
    this.getAllBrowsers(renderer);
  }

  var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
  toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');

  mdc.autoInit();
};

Browsers.prototype.viewSetup = function() {
  var headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: false
  });

  var config = this.getFirebaseConfig();
  var nobrowsersEl = this.renderTemplate('no-browsers', config);

  var button = nobrowsersEl.querySelector('#add_mock_data');
  var addingMockData = false;

  var that = this;
  button.addEventListener('click', function(event) {
    if (addingMockData) {
      return;
    }
    addingMockData = true;

    event.target.style.opacompany = '0.4';
    event.target.innerText = 'Please wait...';

    that.addMockBrowsers().then(function() {
      that.rerender();
    });
  });

  this.replaceElement(document.querySelector('.header'), headerEl);
  this.replaceElement(document.querySelector('main'), nobrowsersEl);

  firebase
    .firestore()
    .collection('browsers')
    .limit(1)
    .onSnapshot(function(snapshot) {
      if (snapshot.size && !addingMockData) {
        that.router.navigate('/');
      }
    });
};

Browsers.prototype.initReviewDialog = function() {
  var dialog = document.querySelector('#dialog-add-review');
  this.dialogs.add_review = new mdc.dialog.MDCDialog(dialog);

  var that = this;
  this.dialogs.add_review.listen('MDCDialog:accept', function() {
    var pathname = that.getCleanPath(document.location.pathname);
    var id = pathname.split('/')[2];

    that.addRating(id, {
      rating: rating,
      text: dialog.querySelector('#text').value,
      userName: 'Anonymous (Web)',
      timestamp: new Date(),
      userId: firebase.auth().currentUser.uid
    }).then(function() {
      that.rerender();
    });
  });

  var rating = 0;

  dialog.querySelectorAll('.star-input i').forEach(function(el) {
    var rate = function() {
      var after = false;
      rating = 0;
      [].slice.call(el.parentNode.children).forEach(function(child) {
        if (!after) {
          rating++;
          child.innerText = 'star';
        } else {
          child.innerText = 'star_border';
        }
        after = after || child.isSameNode(el);
      });
    };
    el.addEventListener('mouseover', rate);
  });
};

Browsers.prototype.initFilterDialog = function() {
  // TODO: Reset filter dialog to init state on close.
  this.dialogs.filter = new mdc.dialog.MDCDialog(document.querySelector('#dialog-filter-all'));

  var that = this;
  this.dialogs.filter.listen('MDCDialog:accept', function() {
    that.updateQuery(that.filters);
  });

  var dialog = document.querySelector('aside');
  var pages = dialog.querySelectorAll('.page');

  this.replaceElement(
    dialog.querySelector('#os-list'),
    this.renderTemplate('item-list', { items: ['Any'].concat(this.data.oses) })
  );

  this.replaceElement(
    dialog.querySelector('#company-list'),
    this.renderTemplate('item-list', { items: ['Any'].concat(this.data.companies) })
  );

  var renderAllList = function() {
    that.replaceElement(
      dialog.querySelector('#all-filters-list'),
      that.renderTemplate('all-filters-list', that.filters)
    );

    dialog.querySelectorAll('#page-all .mdc-list-item').forEach(function(el) {
      el.addEventListener('click', function() {
        var id = el.id.split('-').slice(1).join('-');
        displaySection(id);
      });
    });
  };

  var displaySection = function(id) {
    if (id === 'page-all') {
      renderAllList();
    }

    pages.forEach(function(sel) {
      if (sel.id === id) {
        sel.style.display = 'block';
      } else {
        sel.style.display = 'none';
      }
    });
  };

  pages.forEach(function(sel) {
    var type = sel.id.split('-')[1];
    if (type === 'all') {
      return;
    }

    sel.querySelectorAll('.mdc-list-item').forEach(function(el) {
      el.addEventListener('click', function() {
        that.filters[type] = el.innerText.trim() === 'Any'? '' : el.innerText.trim();
        displaySection('page-all');
      });
    });
  });

  displaySection('page-all');
  dialog.querySelectorAll('.back').forEach(function(el) {
    el.addEventListener('click', function() {
      displaySection('page-all');
    });
  });
};

Browsers.prototype.updateQuery = function(filters) {
  var query_description = '';

  if (filters.os !== '') {
    query_description += filters.os + ' places';
  } else {
    query_description += 'any browser';
  }

  if (filters.company !== '') {
    query_description += ' and ' + filters.company;
  } else {
    query_description += ' .';
  }

  if (filters.sort === 'Rating') {
    query_description += ' sorted by rating';
  } else if (filters.sort === 'Reviews') {
    query_description += ' sorted by # of reviews';
  }

  this.viewList(filters, query_description);
};

Browsers.prototype.viewbrowser = function(id) {
  var sectionHeaderEl;

  var that = this;
  return this.getBrowser(id)
    .then(function(doc) {
      var data = doc.data();
      var dialog =  that.dialogs.add_review;

      data.show_add_review = function() {
        // Reset the state before showing the dialog
        dialog.root_.querySelector('#text').value = '';
        dialog.root_.querySelectorAll('.star-input i').forEach(function(el) {
          el.innerText = 'star_border';
        });

        dialog.show();
      };

      sectionHeaderEl = that.renderTemplate('browser-header', data);
      sectionHeaderEl
        .querySelector('.rating')
        .append(that.renderRating(data.avgRating));

      return doc.ref.collection('ratings').orderBy('timestamp', 'desc').get();
    })
    .then(function(ratings) {
      var mainEl;

      if (ratings.size) {
        mainEl = that.renderTemplate('main');

        ratings.forEach(function(rating) {
          var data = rating.data();
          var el = that.renderTemplate('review-card', data);
          el.querySelector('.rating').append(that.renderRating(data.rating));
          mainEl.querySelector('#cards').append(el);
        });
      } else {
        mainEl = that.renderTemplate('no-ratings', {
          add_mock_data: function() {
            that.addMockRatings(id).then(function() {
              that.rerender();
            });
          }
        });
      }

      var headerEl = that.renderTemplate('header-base', {
        hasSectionHeader: true
      });

      that.replaceElement(document.querySelector('.header'), sectionHeaderEl);
      that.replaceElement(document.querySelector('main'), mainEl);
    })
    .then(function() {
      that.router.updatePageLinks();
    })
    .catch(function(err) {
      console.warn('Error rendering page', err);
    });
};

Browsers.prototype.renderTemplate = function(id, data) {
  var template = this.templates[id];
  var el = template.cloneNode(true);
  el.removeAttribute('hidden');
  this.render(el, data);
  return el;
};

Browsers.prototype.render = function(el, data) {
  if (!data) {
    return;
  }

  var that = this;
  var modifiers = {
    'data-fir-foreach': function(tel) {
      var field = tel.getAttribute('data-fir-foreach');
      var values = that.getDeepItem(data, field);

      values.forEach(function(value, index) {
        var cloneTel = tel.cloneNode(true);
        tel.parentNode.append(cloneTel);

        Object.keys(modifiers).forEach(function(selector) {
          var children = Array.prototype.slice.call(
            cloneTel.querySelectorAll('[' + selector + ']')
          );
          children.push(cloneTel);
          children.forEach(function(childEl) {
            var currentVal = childEl.getAttribute(selector);

            if (!currentVal) {
              return;
            }
            childEl.setAttribute(
              selector,
              currentVal.replace('~', field + '/' + index)
            );
          });
        });
      });

      tel.parentNode.removeChild(tel);
    },
    'data-fir-content': function(tel) {
      var field = tel.getAttribute('data-fir-content');
      tel.innerText = that.getDeepItem(data, field);
    },
    'data-fir-click': function(tel) {
      tel.addEventListener('click', function() {
        var field = tel.getAttribute('data-fir-click');
        that.getDeepItem(data, field)();
      });
    },
    'data-fir-if': function(tel) {
      var field = tel.getAttribute('data-fir-if');
      if (!that.getDeepItem(data, field)) {
        tel.style.display = 'none';
      }
    },
    'data-fir-if-not': function(tel) {
      var field = tel.getAttribute('data-fir-if-not');
      if (that.getDeepItem(data, field)) {
        tel.style.display = 'none';
      }
    },
    'data-fir-attr': function(tel) {
      var chunks = tel.getAttribute('data-fir-attr').split(':');
      var attr = chunks[0];
      var field = chunks[1];
      tel.setAttribute(attr, that.getDeepItem(data, field));
    },
    'data-fir-style': function(tel) {
      var chunks = tel.getAttribute('data-fir-style').split(':');
      var attr = chunks[0];
      var field = chunks[1];
      var value = that.getDeepItem(data, field);

      if (attr.toLowerCase() === 'backgroundimage') {
        value = 'url(' + value + ')';
      }
      tel.style[attr] = value;
    }
  };

  var preModifiers = ['data-fir-foreach'];

  preModifiers.forEach(function(selector) {
    var modifier = modifiers[selector];
    that.useModifier(el, selector, modifier);
  });

  Object.keys(modifiers).forEach(function(selector) {
    if (preModifiers.indexOf(selector) !== -1) {
      return;
    }

    var modifier = modifiers[selector];
    that.useModifier(el, selector, modifier);
  });
};

Browsers.prototype.useModifier = function(el, selector, modifier) {
  el.querySelectorAll('[' + selector + ']').forEach(modifier);
};

Browsers.prototype.getDeepItem = function(obj, path) {
  path.split('/').forEach(function(chunk) {
    obj = obj[chunk];
  });
  return obj;
};

Browsers.prototype.renderRating = function(rating) {
  var el = this.renderTemplate('rating', {});
  for (var r = 0; r < 5; r += 1) {
    var star;
    if (r < Math.floor(rating)) {
      star = this.renderTemplate('star-icon', {});
    } else {
      star = this.renderTemplate('star-border-icon', {});
    }
    el.append(star);
  }
  return el;
};

Browsers.prototype.replaceElement = function(parent, content) {
  parent.innerHTML = '';
  parent.append(content);
};

Browsers.prototype.rerender = function() {
  this.router.navigate(document.location.pathname + '?' + new Date().getTime());
};
