(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var focusTrap = require('../../');

var el = document.getElementById('demo-four');

document.getElementById('activate-four').addEventListener('click', function() {
  focusTrap.activate('#demo-four', {
    onDeactivate: removeActiveClass,
    initialFocus: '#demo-four',
  });
  el.className = 'trap is-active';
});

document.getElementById('deactivate-four').addEventListener('click', function() {
  focusTrap.deactivate();
  removeActiveClass();
});

function removeActiveClass() {
  el.className = 'trap';
}

},{"../../":6}],2:[function(require,module,exports){
var focusTrap = require('../../');

var el = document.getElementById('demo-one');

document.getElementById('activate-one').addEventListener('click', function() {
  focusTrap.activate('#demo-one', {
    onDeactivate: removeActiveClass,
  });
  el.className = 'trap is-active';
});

document.getElementById('deactivate-one').addEventListener('click', function() {
  focusTrap.deactivate();
  removeActiveClass();
});

function removeActiveClass() {
  el.className = 'trap';
}

},{"../../":6}],3:[function(require,module,exports){
var focusTrap = require('../../');

var el = document.getElementById('demo-three');

document.getElementById('activate-three').addEventListener('click', function() {
  focusTrap.activate(el, {
    onDeactivate: removeActiveClass,
    clickOutsideDeactivates: true,
  });
  el.className = 'trap is-active';
});

document.getElementById('deactivate-three').addEventListener('click', function() {
  focusTrap.deactivate();
  removeActiveClass();
});

function removeActiveClass() {
  el.className = 'trap';
}

},{"../../":6}],4:[function(require,module,exports){
var focusTrap = require('../../');

var el = document.getElementById('demo-two');

document.getElementById('activate-two').addEventListener('click', function() {
  focusTrap.activate('#demo-two', {
    onDeactivate: removeActiveClass,
    initialFocus: '#focused-input',
    escapeDeactivates: false,
  });
  el.className = 'trap is-active';
});

document.getElementById('deactivate-two').addEventListener('click', function() {
  focusTrap.deactivate();
  removeActiveClass();
});

function removeActiveClass() {
  el.className = 'trap';
}

},{"../../":6}],5:[function(require,module,exports){
require('./demo-one');
require('./demo-two');
require('./demo-three');
require('./demo-four');

},{"./demo-four":1,"./demo-one":2,"./demo-three":3,"./demo-two":4}],6:[function(require,module,exports){
var tabbable = require('tabbable');

var trap;
var tabbableNodes;
var previouslyFocused;
var activeFocusTrap;
var config;

function activate(element, options) {
  // There can be only one focus trap at a time
  if (activeFocusTrap) deactivate();
  activeFocusTrap = true;

  trap = (typeof element === 'string')
    ? document.querySelector(element)
    : element;

  config = options || {};
  if (config.escapeDeactivates === undefined) config.escapeDeactivates = true;

  previouslyFocused = document.activeElement;

  updateTabbableNodes();

  tryFocus(firstFocusNode());

  document.addEventListener('focus', checkFocus, true);
  document.addEventListener('click', checkClick, true);
  document.addEventListener('keydown', checkKey, true);
}

function firstFocusNode() {
  var node;

  if (!config.initialFocus) {
    node = tabbableNodes[0];
    if (!node) {
      throw new Error('You can\'t have a focus-trap without at least one focusable element');
    }
    return node;
  }

  if (typeof config.initialFocus === 'string') {
    node = document.querySelector(config.initialFocus);
  } else {
    node = config.initialFocus;
  }
  if (!node) {
    throw new Error('The `initialFocus` selector you passed refers to no known node');
  }
  return node;
}

function deactivate() {
  if (!activeFocusTrap) return;
  activeFocusTrap = false;

  document.removeEventListener('focus', checkFocus, true);
  document.removeEventListener('click', checkClick, true);
  document.removeEventListener('keydown', checkKey, true);

  if (config.onDeactivate) config.onDeactivate();

  setTimeout(function() {
    tryFocus(previouslyFocused);
  }, 0);
}

function checkClick(e) {
  if (trap.contains(e.target)) return;
  if (config.clickOutsideDeactivates) {
    deactivate();
    e.target.focus();
  } else {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}

function checkFocus(e) {
  updateTabbableNodes();
  if (trap.contains(e.target)) return;
  tryFocus(tabbableNodes[0]);
}

function checkKey(e) {
  if (e.key === 'Tab' || e.keyCode === 9) {
    handleTab(e);
  }

  if (config.escapeDeactivates && isEscapeEvent(e)) {
    deactivate();
  }
}

function handleTab(e) {
  e.preventDefault();
  updateTabbableNodes();
  var currentFocusIndex = tabbableNodes.indexOf(e.target);
  var lastTabbableNode = tabbableNodes[tabbableNodes.length - 1];
  var firstTabbableNode = tabbableNodes[0];
  if (e.shiftKey) {
    if (e.target === firstTabbableNode) {
      tryFocus(lastTabbableNode);
      return;
    }
    tryFocus(tabbableNodes[currentFocusIndex - 1]);
    return;
  }
  if (e.target === lastTabbableNode) {
    tryFocus(firstTabbableNode);
    return;
  }
  tryFocus(tabbableNodes[currentFocusIndex + 1]);
}

function updateTabbableNodes() {
  tabbableNodes = tabbable(trap);
}

function tryFocus(node) {
  if (!node || !node.focus) return;
  node.focus();
  if (node.tagName.toLowerCase() === 'input') {
    node.select();
  }
}

function isEscapeEvent(e) {
  return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
}

module.exports = {
  activate: activate,
  deactivate: deactivate,
};

},{"tabbable":7}],7:[function(require,module,exports){
module.exports = function(el) {
  var basicTabbables = [];
  var orderedTabbables = [];

  var candidateNodelist = el.querySelectorAll('input, select, a, textarea, button, [tabindex]');
  var candidates = Array.prototype.slice.call(candidateNodelist);

  var candidate, candidateIndex;
  for (var i = 0, l = candidates.length; i < l; i++) {
    candidate = candidates[i];
    candidateIndex = candidate.tabIndex;

    if (
      candidateIndex < 0
      || (candidate.tagName === 'INPUT' && candidate.type === 'hidden')
      || (candidate.tagName === 'A' && !candidate.href && !candidate.tabIndex)
      || candidate.disabled
      || isHidden(candidate)
    ) {
      continue;
    }

    if (candidateIndex === 0) {
      basicTabbables.push(candidate);
    } else {
      orderedTabbables.push({
        tabIndex: candidateIndex,
        node: candidate,
      });
    }
  }

  var tabbableNodes = orderedTabbables
    .sort(function(a, b) {
      return a.tabIndex - b.tabIndex;
    })
    .map(function(a) {
      return a.node
    });

  Array.prototype.push.apply(tabbableNodes, basicTabbables);

  return tabbableNodes;
}

var nodeCache = {};
var nodeCacheIndex = 1;
function isHidden(node) {
  if (node === document.documentElement) {
    return false;
  }

  if (node.tabbableCacheIndex) {
    return nodeCache[node.tabbableCacheIndex];
  }

  var result = false;
  var style = window.getComputedStyle(node);
  if (style.visibility === 'hidden' || style.display === 'none') {
    result = true;
  } else if (node.parentNode) {
    result = isHidden(node.parentNode);
  }

  node.tabbableCacheIndex = nodeCacheIndex;
  nodeCache[node.tabbableCacheIndex] = result;
  nodeCacheIndex++;

  return result;
}

},{}]},{},[5]);
