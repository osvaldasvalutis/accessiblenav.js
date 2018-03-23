!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.accessibleNav=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// element-closest | CC0-1.0 | github.com/jonathantneal/closest

(function (ElementProto) {
	if (typeof ElementProto.matches !== 'function') {
		ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
			var element = this;
			var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
			var index = 0;

			while (elements[index] && elements[index] !== element) {
				++index;
			}

			return Boolean(elements[index]);
		};
	}

	if (typeof ElementProto.closest !== 'function') {
		ElementProto.closest = function closest(selector) {
			var element = this;

			while (element && element.nodeType === 1) {
				if (element.matches(selector)) {
					return element;
				}

				element = element.parentNode;
			}

			return null;
		};
	}
})(window.Element.prototype);

},{}],2:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// TODO: supercharge with keyboard arrow presses

(function (window, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['element-closest'], function () {
      return factory(window);
    });
  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {
    module.exports = factory(window, _dereq_('element-closest'));
  } else {
    window.accessibleNav = factory(window);
  }
})(window, function factory(window) {

  'use strict';

  window;

  // default options

  var optionsDefault = {
    selSub: 'ul',
    selItem: 'li',
    selButton: 'a',
    classItemActive: '--active',
    classEnabled: '--jsfied',
    click: true,
    mouseover: true,
    keypress: true,
    outsideClick: true,
    escPress: true

    // the plugin's object

  };var Plugin = function Plugin(containerEl, optionsNew) {

    // instance variables

    var publicMethods = {};
    var options = {};
    var isInited = false;
    var buttons = void 0;

    // instance functions

    var removeAllActiveClasses = function removeAllActiveClasses() {
      var activeItems = containerEl.querySelectorAll(options.selItem + '.' + options.classItemActive);
      if (activeItems.length) {
        activeItems.forEach(function (activeItem) {
          activeItem.classList.remove(options.classItemActive);
        });
      }
    };

    var addClassesUpTheTree = function addClassesUpTheTree(button) {
      var parentItem = button.closest(options.selItem);
      while (parentItem) {
        parentItem.classList.add(options.classItemActive);
        parentItem = parentItem.parentNode.closest(options.selItem);
      }
    };

    var onButtonKeyup = function onButtonKeyup(e) {
      if (e.keyCode != 9) return;
      removeAllActiveClasses();
      addClassesUpTheTree(e.target);
    };

    var onButtonMouseenter = function onButtonMouseenter(e) {
      addClassesUpTheTree(e.target);
    };

    var onButtonMouseleave = function onButtonMouseleave() {
      removeAllActiveClasses();
    };

    var onButtonClick = function onButtonClick(e) {
      var parentItem = e.target.closest(options.selItem);
      if (parentItem.querySelector(options.selSub)) {
        e.preventDefault();
        var isActive = parentItem.classList.contains(options.classItemActive);
        removeAllActiveClasses();
        if (!isActive) {
          parentItem.classList.add(options.classItemActive);
        }
        // TODO: minify code with a custom parents(selector) function
        parentItem = parentItem.parentNode.closest(options.selItem);
        while (parentItem) {
          parentItem.classList.add(options.classItemActive);
          parentItem = parentItem.parentNode.closest(options.selItem);
        }
        // ---
      }
    };

    var onDocumentClick = function onDocumentClick(e) {
      // remove all active classes on outside click
      var doRemove = true;
      // TODO: minify code with a custom closest(selector/element) function
      var el = e.target.parentNode;
      while (el) {
        if (el === containerEl) {
          doRemove = false;
          break;
        }
        el = el.parentNode;
      }
      // ---
      if (doRemove) {
        removeAllActiveClasses();
      }
    };

    var onDocumentKeyup = function onDocumentKeyup(e) {
      // remove all active classes on ESC key press
      if (e.keyCode != 27) return;
      removeAllActiveClasses();
    };

    // instance public methods

    publicMethods.destroy = function () {
      // destroy plugin, deassign tasks
      isInited = false;
      removeAllActiveClasses();
      containerEl.classList.remove(options.classEnabled);

      // TODO: use kollegorna/js-utils/event/addEventListener to minify this
      // code with event namespaces
      buttons.forEach(function (button) {
        if (options.click) {
          button.removeEventListener('click', onButtonClick);
        }

        if (options.mouseover) {
          button.removeEventListener('mouseenter', onButtonMouseenter);
          button.removeEventListener('mouseleave', onButtonMouseleave);
        }

        if (options.keypress) {
          button.removeEventListener('keyup', onButtonKeyup);
        }
      });

      if (options.outsideClick) {
        document.removeEventListener('click', onDocumentClick);
      }

      if (options.escPress) {
        document.removeEventListener('keyup', onDocumentKeyup);
      }
      // ---
    };

    publicMethods.init = function (optionsNew) {
      // init plugin, assign tasks
      if (isInited) return;

      isInited = true;
      options = Object.assign({}, optionsDefault, optionsNew);
      buttons = containerEl.querySelectorAll(options.selButton);

      buttons.forEach(function (button) {
        if (options.click) {
          button.addEventListener('click', onButtonClick);
        }

        if (options.mouseover) {
          button.addEventListener('mouseenter', onButtonMouseenter);
          button.addEventListener('mouseleave', onButtonMouseleave);
        }

        if (options.keypress) {
          button.addEventListener('keyup', onButtonKeyup);
        }
      });

      if (options.outsideClick) {
        document.addEventListener('click', onDocumentClick);
      }

      if (options.escPress) {
        document.addEventListener('keyup', onDocumentKeyup);
      }

      containerEl.classList.add(options.classEnabled);
    };

    publicMethods.init(optionsNew);

    return publicMethods;
  };

  return Plugin;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfMzY0NDM4ZDEuanMiXSwibmFtZXMiOlsid2luZG93IiwiZmFjdG9yeSIsImRlZmluZSIsImFtZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1aXJlIiwiYWNjZXNzaWJsZU5hdiIsIm9wdGlvbnNEZWZhdWx0Iiwic2VsU3ViIiwic2VsSXRlbSIsInNlbEJ1dHRvbiIsImNsYXNzSXRlbUFjdGl2ZSIsImNsYXNzRW5hYmxlZCIsImNsaWNrIiwibW91c2VvdmVyIiwia2V5cHJlc3MiLCJvdXRzaWRlQ2xpY2siLCJlc2NQcmVzcyIsIlBsdWdpbiIsImNvbnRhaW5lckVsIiwib3B0aW9uc05ldyIsInB1YmxpY01ldGhvZHMiLCJvcHRpb25zIiwiaXNJbml0ZWQiLCJidXR0b25zIiwicmVtb3ZlQWxsQWN0aXZlQ2xhc3NlcyIsImFjdGl2ZUl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsImxlbmd0aCIsImZvckVhY2giLCJhY3RpdmVJdGVtIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkQ2xhc3Nlc1VwVGhlVHJlZSIsImJ1dHRvbiIsInBhcmVudEl0ZW0iLCJjbG9zZXN0IiwiYWRkIiwicGFyZW50Tm9kZSIsIm9uQnV0dG9uS2V5dXAiLCJlIiwia2V5Q29kZSIsInRhcmdldCIsIm9uQnV0dG9uTW91c2VlbnRlciIsIm9uQnV0dG9uTW91c2VsZWF2ZSIsIm9uQnV0dG9uQ2xpY2siLCJxdWVyeVNlbGVjdG9yIiwicHJldmVudERlZmF1bHQiLCJpc0FjdGl2ZSIsImNvbnRhaW5zIiwib25Eb2N1bWVudENsaWNrIiwiZG9SZW1vdmUiLCJlbCIsIm9uRG9jdW1lbnRLZXl1cCIsImRlc3Ryb3kiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZG9jdW1lbnQiLCJpbml0IiwiT2JqZWN0IiwiYXNzaWduIiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQUVDLFdBQVNBLE1BQVQsRUFBaUJDLE9BQWpCLEVBQTBCO0FBQ3pCOztBQUVBLE1B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QixZQUF4QixFQUFzQ2hCLGtCQUF0QztBQUNEOztBQUVELFlBQUd0QixRQUFRUCxRQUFYLEVBQXFCO0FBQ25CbUIsaUJBQU8wQixnQkFBUCxDQUF3QixPQUF4QixFQUFpQ3JCLGFBQWpDO0FBQ0Q7QUFDRixPQWJEOztBQWVBLFVBQUdqQixRQUFRTixZQUFYLEVBQXlCO0FBQ3ZCd0MsaUJBQVNJLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DVixlQUFuQztBQUNEOztBQUVELFVBQUc1QixRQUFRTCxRQUFYLEVBQXFCO0FBQ25CdUMsaUJBQVNJLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DUCxlQUFuQztBQUNEOztBQUVEbEMsa0JBQVlZLFNBQVosQ0FBc0JNLEdBQXRCLENBQTBCZixRQUFRVixZQUFsQztBQUNILEtBL0JEOztBQWlDQVMsa0JBQWNvQyxJQUFkLENBQW1CckMsVUFBbkI7O0FBRUEsV0FBT0MsYUFBUDtBQUNBLEdBekpBOztBQTJKRCxTQUFPSCxNQUFQO0FBQ0EsQ0F2TUEsQ0FBRCIsImZpbGUiOiJmYWtlXzM2NDQzOGQxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVE9ETzogc3VwZXJjaGFyZ2Ugd2l0aCBrZXlib2FyZCBhcnJvdyBwcmVzc2VzXG5cbihmdW5jdGlvbih3aW5kb3csIGZhY3RvcnkpIHtcbiAgJ3VzZSBzdHJpY3QnXG5cbiAgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtcbiAgICAgICAgJ2VsZW1lbnQtY2xvc2VzdCcsXG4gICAgICBdLFxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3J5KHdpbmRvdylcbiAgICAgIH1cbiAgICApXG4gIH1cbiAgZWxzZSBpZih0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgcmVxdWlyZSgnZWxlbWVudC1jbG9zZXN0JylcbiAgICApXG4gIH1cbiAgZWxzZSB7XG4gICAgd2luZG93LmFjY2Vzc2libGVOYXYgPSBmYWN0b3J5KHdpbmRvdylcbiAgfVxufSh3aW5kb3csIGZ1bmN0aW9uIGZhY3Rvcnkod2luZG93KSB7XG5cblx0J3VzZSBzdHJpY3QnXG4gIHdpbmRvd1xuXG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuXG4gIGNvbnN0IG9wdGlvbnNEZWZhdWx0ID0ge1xuICAgIHNlbFN1YjogJ3VsJyxcbiAgICBzZWxJdGVtOiAnbGknLFxuICAgIHNlbEJ1dHRvbjogJ2EnLFxuICAgIGNsYXNzSXRlbUFjdGl2ZTogJy0tYWN0aXZlJyxcbiAgICBjbGFzc0VuYWJsZWQ6ICctLWpzZmllZCcsXG4gICAgY2xpY2s6IHRydWUsXG4gICAgbW91c2VvdmVyOiB0cnVlLFxuICAgIGtleXByZXNzOiB0cnVlLFxuICAgIG91dHNpZGVDbGljazogdHJ1ZSxcbiAgICBlc2NQcmVzczogdHJ1ZSxcbiAgfVxuXG4gIC8vIHRoZSBwbHVnaW4ncyBvYmplY3RcblxuICBjb25zdCBQbHVnaW4gPSBmdW5jdGlvbihjb250YWluZXJFbCwgb3B0aW9uc05ldykge1xuXG4gICAgLy8gaW5zdGFuY2UgdmFyaWFibGVzXG5cbiAgICBjb25zdCBwdWJsaWNNZXRob2RzID0ge31cbiAgICBsZXQgb3B0aW9ucyA9IHt9XG4gICAgbGV0IGlzSW5pdGVkID0gZmFsc2VcbiAgICBsZXQgYnV0dG9uc1xuXG4gICAgLy8gaW5zdGFuY2UgZnVuY3Rpb25zXG5cbiAgICBjb25zdCByZW1vdmVBbGxBY3RpdmVDbGFzc2VzID0gKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aXZlSXRlbXMgPSBjb250YWluZXJFbC5xdWVyeVNlbGVjdG9yQWxsKGAke29wdGlvbnMuc2VsSXRlbX0uJHtvcHRpb25zLmNsYXNzSXRlbUFjdGl2ZX1gKVxuICAgICAgaWYoYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIGFjdGl2ZUl0ZW1zLmZvckVhY2goKGFjdGl2ZUl0ZW0pID0+IHtcbiAgICAgICAgICBhY3RpdmVJdGVtLmNsYXNzTGlzdC5yZW1vdmUob3B0aW9ucy5jbGFzc0l0ZW1BY3RpdmUpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYWRkQ2xhc3Nlc1VwVGhlVHJlZSA9IChidXR0b24pID0+IHtcbiAgICAgIGxldCBwYXJlbnRJdGVtID0gYnV0dG9uLmNsb3Nlc3Qob3B0aW9ucy5zZWxJdGVtKVxuICAgICAgd2hpbGUocGFyZW50SXRlbSkge1xuICAgICAgICBwYXJlbnRJdGVtLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5jbGFzc0l0ZW1BY3RpdmUpXG4gICAgICAgIHBhcmVudEl0ZW0gPSBwYXJlbnRJdGVtLnBhcmVudE5vZGUuY2xvc2VzdChvcHRpb25zLnNlbEl0ZW0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgb25CdXR0b25LZXl1cCA9IChlKSA9PiB7XG4gICAgICBpZihlLmtleUNvZGUgIT0gOSkgcmV0dXJuXG4gICAgICByZW1vdmVBbGxBY3RpdmVDbGFzc2VzKClcbiAgICAgIGFkZENsYXNzZXNVcFRoZVRyZWUoZS50YXJnZXQpXG4gICAgfVxuXG4gICAgY29uc3Qgb25CdXR0b25Nb3VzZWVudGVyID0gKGUpID0+IHtcbiAgICAgIGFkZENsYXNzZXNVcFRoZVRyZWUoZS50YXJnZXQpXG4gICAgfVxuXG4gICAgY29uc3Qgb25CdXR0b25Nb3VzZWxlYXZlID0gKCkgPT4ge1xuICAgICAgcmVtb3ZlQWxsQWN0aXZlQ2xhc3NlcygpXG4gICAgfVxuXG4gICAgY29uc3Qgb25CdXR0b25DbGljayA9IChlKSA9PiB7XG4gICAgICBsZXQgcGFyZW50SXRlbSA9IGUudGFyZ2V0LmNsb3Nlc3Qob3B0aW9ucy5zZWxJdGVtKVxuICAgICAgaWYocGFyZW50SXRlbS5xdWVyeVNlbGVjdG9yKG9wdGlvbnMuc2VsU3ViKSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBwYXJlbnRJdGVtLmNsYXNzTGlzdC5jb250YWlucyhvcHRpb25zLmNsYXNzSXRlbUFjdGl2ZSlcbiAgICAgICAgcmVtb3ZlQWxsQWN0aXZlQ2xhc3NlcygpXG4gICAgICAgIGlmKCFpc0FjdGl2ZSkge1xuICAgICAgICAgIHBhcmVudEl0ZW0uY2xhc3NMaXN0LmFkZChvcHRpb25zLmNsYXNzSXRlbUFjdGl2ZSlcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiBtaW5pZnkgY29kZSB3aXRoIGEgY3VzdG9tIHBhcmVudHMoc2VsZWN0b3IpIGZ1bmN0aW9uXG4gICAgICAgIHBhcmVudEl0ZW0gPSBwYXJlbnRJdGVtLnBhcmVudE5vZGUuY2xvc2VzdChvcHRpb25zLnNlbEl0ZW0pXG4gICAgICAgIHdoaWxlKHBhcmVudEl0ZW0pIHtcbiAgICAgICAgICBwYXJlbnRJdGVtLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5jbGFzc0l0ZW1BY3RpdmUpXG4gICAgICAgICAgcGFyZW50SXRlbSA9IHBhcmVudEl0ZW0ucGFyZW50Tm9kZS5jbG9zZXN0KG9wdGlvbnMuc2VsSXRlbSlcbiAgICAgICAgfVxuICAgICAgICAvLyAtLS1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvbkRvY3VtZW50Q2xpY2sgPSAoZSkgPT4geyAvLyByZW1vdmUgYWxsIGFjdGl2ZSBjbGFzc2VzIG9uIG91dHNpZGUgY2xpY2tcbiAgICAgIGxldCBkb1JlbW92ZSA9IHRydWVcbiAgICAgIC8vIFRPRE86IG1pbmlmeSBjb2RlIHdpdGggYSBjdXN0b20gY2xvc2VzdChzZWxlY3Rvci9lbGVtZW50KSBmdW5jdGlvblxuICAgICAgbGV0IGVsID0gZS50YXJnZXQucGFyZW50Tm9kZVxuICAgICAgd2hpbGUoZWwpIHtcbiAgICAgICAgaWYoZWwgPT09IGNvbnRhaW5lckVsKSB7XG4gICAgICAgICAgZG9SZW1vdmUgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgZWwgPSBlbC5wYXJlbnROb2RlXG4gICAgICB9XG4gICAgICAvLyAtLS1cbiAgICAgIGlmKGRvUmVtb3ZlKSB7XG4gICAgICAgIHJlbW92ZUFsbEFjdGl2ZUNsYXNzZXMoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG9uRG9jdW1lbnRLZXl1cCA9IChlKSA9PiB7IC8vIHJlbW92ZSBhbGwgYWN0aXZlIGNsYXNzZXMgb24gRVNDIGtleSBwcmVzc1xuICAgICAgaWYoZS5rZXlDb2RlICE9IDI3KSByZXR1cm5cbiAgICAgIHJlbW92ZUFsbEFjdGl2ZUNsYXNzZXMoKVxuICAgIH1cblxuICAgIC8vIGluc3RhbmNlIHB1YmxpYyBtZXRob2RzXG5cblx0XHRwdWJsaWNNZXRob2RzLmRlc3Ryb3kgPSAoKSA9PiB7IC8vIGRlc3Ryb3kgcGx1Z2luLCBkZWFzc2lnbiB0YXNrc1xuICAgICAgaXNJbml0ZWQgPSBmYWxzZVxuICAgICAgcmVtb3ZlQWxsQWN0aXZlQ2xhc3NlcygpXG4gICAgICBjb250YWluZXJFbC5jbGFzc0xpc3QucmVtb3ZlKG9wdGlvbnMuY2xhc3NFbmFibGVkKVxuXG4gICAgICAvLyBUT0RPOiB1c2Uga29sbGVnb3JuYS9qcy11dGlscy9ldmVudC9hZGRFdmVudExpc3RlbmVyIHRvIG1pbmlmeSB0aGlzXG4gICAgICAvLyBjb2RlIHdpdGggZXZlbnQgbmFtZXNwYWNlc1xuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgaWYob3B0aW9ucy5jbGljaykge1xuICAgICAgICAgIGJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQnV0dG9uQ2xpY2spXG4gICAgICAgIH1cblxuICAgICAgICBpZihvcHRpb25zLm1vdXNlb3Zlcikge1xuICAgICAgICAgIGJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25CdXR0b25Nb3VzZWVudGVyKVxuICAgICAgICAgIGJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgb25CdXR0b25Nb3VzZWxlYXZlKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYob3B0aW9ucy5rZXlwcmVzcykge1xuICAgICAgICAgIGJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uQnV0dG9uS2V5dXApXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmKG9wdGlvbnMub3V0c2lkZUNsaWNrKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Eb2N1bWVudENsaWNrKVxuICAgICAgfVxuXG4gICAgICBpZihvcHRpb25zLmVzY1ByZXNzKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25Eb2N1bWVudEtleXVwKVxuICAgICAgfVxuICAgICAgLy8gLS0tXG5cdFx0fVxuXG5cdFx0cHVibGljTWV0aG9kcy5pbml0ID0gKG9wdGlvbnNOZXcpID0+IHsgLy8gaW5pdCBwbHVnaW4sIGFzc2lnbiB0YXNrc1xuICAgICAgaWYoaXNJbml0ZWQpIHJldHVyblxuXG4gICAgICBpc0luaXRlZCA9IHRydWVcbiAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zRGVmYXVsdCwgb3B0aW9uc05ldylcbiAgICAgIGJ1dHRvbnMgPSBjb250YWluZXJFbC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsQnV0dG9uKVxuXG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBpZihvcHRpb25zLmNsaWNrKSB7XG4gICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25CdXR0b25DbGljaylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG9wdGlvbnMubW91c2VvdmVyKSB7XG4gICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbkJ1dHRvbk1vdXNlZW50ZXIpXG4gICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBvbkJ1dHRvbk1vdXNlbGVhdmUpXG4gICAgICAgIH1cblxuICAgICAgICBpZihvcHRpb25zLmtleXByZXNzKSB7XG4gICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25CdXR0b25LZXl1cClcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgaWYob3B0aW9ucy5vdXRzaWRlQ2xpY2spIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkRvY3VtZW50Q2xpY2spXG4gICAgICB9XG5cbiAgICAgIGlmKG9wdGlvbnMuZXNjUHJlc3MpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbkRvY3VtZW50S2V5dXApXG4gICAgICB9XG5cbiAgICAgIGNvbnRhaW5lckVsLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5jbGFzc0VuYWJsZWQpXG5cdFx0fVxuXG5cdFx0cHVibGljTWV0aG9kcy5pbml0KG9wdGlvbnNOZXcpXG5cblx0XHRyZXR1cm4gcHVibGljTWV0aG9kc1xuXHR9XG5cblx0cmV0dXJuIFBsdWdpblxufSkpXG4iXX0=
},{"element-closest":1}]},{},[2])
(2)
});