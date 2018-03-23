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

    var onItemMouseenter = function onItemMouseenter(e) {
      addClassesUpTheTree(e.target);
    };

    var onItemMouseleave = function onItemMouseleave() {
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

      if (options.classEnabled) {
        containerEl.classList.remove(options.classEnabled);
      }

      // TODO: use kollegorna/js-utils/event/addEventListener to minify this
      // code with event namespaces
      buttons.forEach(function (button) {
        if (options.click) {
          button.removeEventListener('click', onButtonClick);
        }

        if (options.mouseover) {
          var item = button.closest(options.selItem);
          item.removeEventListener('mouseenter', onItemMouseenter);
          item.removeEventListener('mouseleave', onItemMouseleave);
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
          var item = button.closest(options.selItem);
          item.addEventListener('mouseenter', onItemMouseenter);
          item.addEventListener('mouseleave', onItemMouseleave);
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

      if (options.classEnabled) {
        containerEl.classList.add(options.classEnabled);
      }
    };

    publicMethods.init(optionsNew);

    return publicMethods;
  };

  return Plugin;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfZDA0ODhkNjguanMiXSwibmFtZXMiOlsid2luZG93IiwiZmFjdG9yeSIsImRlZmluZSIsImFtZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1aXJlIiwiYWNjZXNzaWJsZU5hdiIsIm9wdGlvbnNEZWZhdWx0Iiwic2VsU3ViIiwic2VsSXRlbSIsInNlbEJ1dHRvbiIsImNsYXNzSXRlbUFjdGl2ZSIsImNsYXNzRW5hYmxlZCIsImNsaWNrIiwibW91c2VvdmVyIiwia2V5cHJlc3MiLCJvdXRzaWRlQ2xpY2siLCJlc2NQcmVzcyIsIlBsdWdpbiIsImNvbnRhaW5lckVsIiwib3B0aW9uc05ldyIsInB1YmxpY01ldGhvZHMiLCJvcHRpb25zIiwiaXNJbml0ZWQiLCJidXR0b25zIiwicmVtb3ZlQWxsQWN0aXZlQ2xhc3NlcyIsImFjdGl2ZUl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsImxlbmd0aCIsImZvckVhY2giLCJhY3RpdmVJdGVtIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkQ2xhc3Nlc1VwVGhlVHJlZSIsImJ1dHRvbiIsInBhcmVudEl0ZW0iLCJjbG9zZXN0IiwiYWRkIiwicGFyZW50Tm9kZSIsIm9uQnV0dG9uS2V5dXAiLCJlIiwia2V5Q29kZSIsInRhcmdldCIsIm9uSXRlbU1vdXNlZW50ZXIiLCJvbkl0ZW1Nb3VzZWxlYXZlIiwib25CdXR0b25DbGljayIsInF1ZXJ5U2VsZWN0b3IiLCJwcmV2ZW50RGVmYXVsdCIsImlzQWN0aXZlIiwiY29udGFpbnMiLCJvbkRvY3VtZW50Q2xpY2siLCJkb1JlbW92ZSIsImVsIiwib25Eb2N1bWVudEtleXVwIiwiZGVzdHJveSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJpdGVtIiwiZG9jdW1lbnQiLCJpbml0IiwiT2JqZWN0IiwiYXNzaWduIiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQUVDLFdBQVNBLE1BQVQsRUFBaUJDLE9BQWpCLEVBQTBCO0FBQ3pCOztBQUVB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QUFRUixTQUFYLEVBQXNCO0FBQ3BCLGNBQU0wQyxPQUFPdEIsT0FBT0UsT0FBUCxDQUFlZCxRQUFRYixPQUF2QixDQUFiO0FBQ0ErQyxlQUFLSyxnQkFBTCxDQUFzQixZQUF0QixFQUFvQ2xCLGdCQUFwQztBQUNBYSxlQUFLSyxnQkFBTCxDQUFzQixZQUF0QixFQUFvQ2pCLGdCQUFwQztBQUNEOztBQUVELFlBQUd0QixRQUFRUCxRQUFYLEVBQXFCO0FBQ25CbUIsaUJBQU8yQixnQkFBUCxDQUF3QixPQUF4QixFQUFpQ3RCLGFBQWpDO0FBQ0Q7QUFDRixPQWREOztBQWdCQSxVQUFHakIsUUFBUU4sWUFBWCxFQUF5QjtBQUN2QnlDLGlCQUFTSSxnQkFBVCxDQUEwQixPQUExQixFQUFtQ1gsZUFBbkM7QUFDRDs7QUFFRCxVQUFHNUIsUUFBUUwsUUFBWCxFQUFxQjtBQUNuQndDLGlCQUFTSSxnQkFBVCxDQUEwQixPQUExQixFQUFtQ1IsZUFBbkM7QUFDRDs7QUFFRCxVQUFHL0IsUUFBUVYsWUFBWCxFQUF5QjtBQUN2Qk8sb0JBQVlZLFNBQVosQ0FBc0JNLEdBQXRCLENBQTBCZixRQUFRVixZQUFsQztBQUNEO0FBQ0osS0FsQ0Q7O0FBb0NBUyxrQkFBY3FDLElBQWQsQ0FBbUJ0QyxVQUFuQjs7QUFFQSxXQUFPQyxhQUFQO0FBQ0EsR0FoS0E7O0FBa0tELFNBQU9ILE1BQVA7QUFDQSxDQTlNQSxDQUFEIiwiZmlsZSI6ImZha2VfZDA0ODhkNjguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUT0RPOiBzdXBlcmNoYXJnZSB3aXRoIGtleWJvYXJkIGFycm93IHByZXNzZXNcblxuKGZ1bmN0aW9uKHdpbmRvdywgZmFjdG9yeSkge1xuICAndXNlIHN0cmljdCdcblxuICBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW1xuICAgICAgICAnZWxlbWVudC1jbG9zZXN0JyxcbiAgICAgIF0sXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZhY3Rvcnkod2luZG93KVxuICAgICAgfVxuICAgIClcbiAgfVxuICBlbHNlIGlmKHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICByZXF1aXJlKCdlbGVtZW50LWNsb3Nlc3QnKVxuICAgIClcbiAgfVxuICBlbHNlIHtcbiAgICB3aW5kb3cuYWNjZXNzaWJsZU5hdiA9IGZhY3Rvcnkod2luZG93KVxuICB9XG59KHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSh3aW5kb3cpIHtcblxuXHQndXNlIHN0cmljdCdcbiAgd2luZG93XG5cbiAgLy8gZGVmYXVsdCBvcHRpb25zXG5cbiAgY29uc3Qgb3B0aW9uc0RlZmF1bHQgPSB7XG4gICAgc2VsU3ViOiAndWwnLFxuICAgIHNlbEl0ZW06ICdsaScsXG4gICAgc2VsQnV0dG9uOiAnYScsXG4gICAgY2xhc3NJdGVtQWN0aXZlOiAnLS1hY3RpdmUnLFxuICAgIGNsYXNzRW5hYmxlZDogJy0tanNmaWVkJyxcbiAgICBjbGljazogdHJ1ZSxcbiAgICBtb3VzZW92ZXI6IHRydWUsXG4gICAga2V5cHJlc3M6IHRydWUsXG4gICAgb3V0c2lkZUNsaWNrOiB0cnVlLFxuICAgIGVzY1ByZXNzOiB0cnVlLFxuICB9XG5cbiAgLy8gdGhlIHBsdWdpbidzIG9iamVjdFxuXG4gIGNvbnN0IFBsdWdpbiA9IGZ1bmN0aW9uKGNvbnRhaW5lckVsLCBvcHRpb25zTmV3KSB7XG5cbiAgICAvLyBpbnN0YW5jZSB2YXJpYWJsZXNcblxuICAgIGNvbnN0IHB1YmxpY01ldGhvZHMgPSB7fVxuICAgIGxldCBvcHRpb25zID0ge31cbiAgICBsZXQgaXNJbml0ZWQgPSBmYWxzZVxuICAgIGxldCBidXR0b25zXG5cbiAgICAvLyBpbnN0YW5jZSBmdW5jdGlvbnNcblxuICAgIGNvbnN0IHJlbW92ZUFsbEFjdGl2ZUNsYXNzZXMgPSAoKSA9PiB7XG4gICAgICBjb25zdCBhY3RpdmVJdGVtcyA9IGNvbnRhaW5lckVsLnF1ZXJ5U2VsZWN0b3JBbGwoYCR7b3B0aW9ucy5zZWxJdGVtfS4ke29wdGlvbnMuY2xhc3NJdGVtQWN0aXZlfWApXG4gICAgICBpZihhY3RpdmVJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgYWN0aXZlSXRlbXMuZm9yRWFjaCgoYWN0aXZlSXRlbSkgPT4ge1xuICAgICAgICAgIGFjdGl2ZUl0ZW0uY2xhc3NMaXN0LnJlbW92ZShvcHRpb25zLmNsYXNzSXRlbUFjdGl2ZSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBhZGRDbGFzc2VzVXBUaGVUcmVlID0gKGJ1dHRvbikgPT4ge1xuICAgICAgbGV0IHBhcmVudEl0ZW0gPSBidXR0b24uY2xvc2VzdChvcHRpb25zLnNlbEl0ZW0pXG4gICAgICB3aGlsZShwYXJlbnRJdGVtKSB7XG4gICAgICAgIHBhcmVudEl0ZW0uY2xhc3NMaXN0LmFkZChvcHRpb25zLmNsYXNzSXRlbUFjdGl2ZSlcbiAgICAgICAgcGFyZW50SXRlbSA9IHBhcmVudEl0ZW0ucGFyZW50Tm9kZS5jbG9zZXN0KG9wdGlvbnMuc2VsSXRlbSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvbkJ1dHRvbktleXVwID0gKGUpID0+IHtcbiAgICAgIGlmKGUua2V5Q29kZSAhPSA5KSByZXR1cm5cbiAgICAgIHJlbW92ZUFsbEFjdGl2ZUNsYXNzZXMoKVxuICAgICAgYWRkQ2xhc3Nlc1VwVGhlVHJlZShlLnRhcmdldClcbiAgICB9XG5cbiAgICBjb25zdCBvbkl0ZW1Nb3VzZWVudGVyID0gKGUpID0+IHtcbiAgICAgIGFkZENsYXNzZXNVcFRoZVRyZWUoZS50YXJnZXQpXG4gICAgfVxuXG4gICAgY29uc3Qgb25JdGVtTW91c2VsZWF2ZSA9ICgpID0+IHtcbiAgICAgIHJlbW92ZUFsbEFjdGl2ZUNsYXNzZXMoKVxuICAgIH1cblxuICAgIGNvbnN0IG9uQnV0dG9uQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgbGV0IHBhcmVudEl0ZW0gPSBlLnRhcmdldC5jbG9zZXN0KG9wdGlvbnMuc2VsSXRlbSlcbiAgICAgIGlmKHBhcmVudEl0ZW0ucXVlcnlTZWxlY3RvcihvcHRpb25zLnNlbFN1YikpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gcGFyZW50SXRlbS5jbGFzc0xpc3QuY29udGFpbnMob3B0aW9ucy5jbGFzc0l0ZW1BY3RpdmUpXG4gICAgICAgIHJlbW92ZUFsbEFjdGl2ZUNsYXNzZXMoKVxuICAgICAgICBpZighaXNBY3RpdmUpIHtcbiAgICAgICAgICBwYXJlbnRJdGVtLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5jbGFzc0l0ZW1BY3RpdmUpXG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogbWluaWZ5IGNvZGUgd2l0aCBhIGN1c3RvbSBwYXJlbnRzKHNlbGVjdG9yKSBmdW5jdGlvblxuICAgICAgICBwYXJlbnRJdGVtID0gcGFyZW50SXRlbS5wYXJlbnROb2RlLmNsb3Nlc3Qob3B0aW9ucy5zZWxJdGVtKVxuICAgICAgICB3aGlsZShwYXJlbnRJdGVtKSB7XG4gICAgICAgICAgcGFyZW50SXRlbS5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuY2xhc3NJdGVtQWN0aXZlKVxuICAgICAgICAgIHBhcmVudEl0ZW0gPSBwYXJlbnRJdGVtLnBhcmVudE5vZGUuY2xvc2VzdChvcHRpb25zLnNlbEl0ZW0pXG4gICAgICAgIH1cbiAgICAgICAgLy8gLS0tXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgb25Eb2N1bWVudENsaWNrID0gKGUpID0+IHsgLy8gcmVtb3ZlIGFsbCBhY3RpdmUgY2xhc3NlcyBvbiBvdXRzaWRlIGNsaWNrXG4gICAgICBsZXQgZG9SZW1vdmUgPSB0cnVlXG4gICAgICAvLyBUT0RPOiBtaW5pZnkgY29kZSB3aXRoIGEgY3VzdG9tIGNsb3Nlc3Qoc2VsZWN0b3IvZWxlbWVudCkgZnVuY3Rpb25cbiAgICAgIGxldCBlbCA9IGUudGFyZ2V0LnBhcmVudE5vZGVcbiAgICAgIHdoaWxlKGVsKSB7XG4gICAgICAgIGlmKGVsID09PSBjb250YWluZXJFbCkge1xuICAgICAgICAgIGRvUmVtb3ZlID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGVsID0gZWwucGFyZW50Tm9kZVxuICAgICAgfVxuICAgICAgLy8gLS0tXG4gICAgICBpZihkb1JlbW92ZSkge1xuICAgICAgICByZW1vdmVBbGxBY3RpdmVDbGFzc2VzKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvbkRvY3VtZW50S2V5dXAgPSAoZSkgPT4geyAvLyByZW1vdmUgYWxsIGFjdGl2ZSBjbGFzc2VzIG9uIEVTQyBrZXkgcHJlc3NcbiAgICAgIGlmKGUua2V5Q29kZSAhPSAyNykgcmV0dXJuXG4gICAgICByZW1vdmVBbGxBY3RpdmVDbGFzc2VzKClcbiAgICB9XG5cbiAgICAvLyBpbnN0YW5jZSBwdWJsaWMgbWV0aG9kc1xuXG5cdFx0cHVibGljTWV0aG9kcy5kZXN0cm95ID0gKCkgPT4geyAvLyBkZXN0cm95IHBsdWdpbiwgZGVhc3NpZ24gdGFza3NcbiAgICAgIGlzSW5pdGVkID0gZmFsc2VcbiAgICAgIHJlbW92ZUFsbEFjdGl2ZUNsYXNzZXMoKVxuXG4gICAgICBpZihvcHRpb25zLmNsYXNzRW5hYmxlZCkge1xuICAgICAgICBjb250YWluZXJFbC5jbGFzc0xpc3QucmVtb3ZlKG9wdGlvbnMuY2xhc3NFbmFibGVkKVxuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiB1c2Uga29sbGVnb3JuYS9qcy11dGlscy9ldmVudC9hZGRFdmVudExpc3RlbmVyIHRvIG1pbmlmeSB0aGlzXG4gICAgICAvLyBjb2RlIHdpdGggZXZlbnQgbmFtZXNwYWNlc1xuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgaWYob3B0aW9ucy5jbGljaykge1xuICAgICAgICAgIGJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQnV0dG9uQ2xpY2spXG4gICAgICAgIH1cblxuICAgICAgICBpZihvcHRpb25zLm1vdXNlb3Zlcikge1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBidXR0b24uY2xvc2VzdChvcHRpb25zLnNlbEl0ZW0pXG4gICAgICAgICAgaXRlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25JdGVtTW91c2VlbnRlcilcbiAgICAgICAgICBpdGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBvbkl0ZW1Nb3VzZWxlYXZlKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYob3B0aW9ucy5rZXlwcmVzcykge1xuICAgICAgICAgIGJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uQnV0dG9uS2V5dXApXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmKG9wdGlvbnMub3V0c2lkZUNsaWNrKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Eb2N1bWVudENsaWNrKVxuICAgICAgfVxuXG4gICAgICBpZihvcHRpb25zLmVzY1ByZXNzKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25Eb2N1bWVudEtleXVwKVxuICAgICAgfVxuICAgICAgLy8gLS0tXG5cdFx0fVxuXG5cdFx0cHVibGljTWV0aG9kcy5pbml0ID0gKG9wdGlvbnNOZXcpID0+IHsgLy8gaW5pdCBwbHVnaW4sIGFzc2lnbiB0YXNrc1xuICAgICAgaWYoaXNJbml0ZWQpIHJldHVyblxuXG4gICAgICBpc0luaXRlZCA9IHRydWVcbiAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zRGVmYXVsdCwgb3B0aW9uc05ldylcbiAgICAgIGJ1dHRvbnMgPSBjb250YWluZXJFbC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsQnV0dG9uKVxuXG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBpZihvcHRpb25zLmNsaWNrKSB7XG4gICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25CdXR0b25DbGljaylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG9wdGlvbnMubW91c2VvdmVyKSB7XG4gICAgICAgICAgY29uc3QgaXRlbSA9IGJ1dHRvbi5jbG9zZXN0KG9wdGlvbnMuc2VsSXRlbSlcbiAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbkl0ZW1Nb3VzZWVudGVyKVxuICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIG9uSXRlbU1vdXNlbGVhdmUpXG4gICAgICAgIH1cblxuICAgICAgICBpZihvcHRpb25zLmtleXByZXNzKSB7XG4gICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25CdXR0b25LZXl1cClcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgaWYob3B0aW9ucy5vdXRzaWRlQ2xpY2spIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkRvY3VtZW50Q2xpY2spXG4gICAgICB9XG5cbiAgICAgIGlmKG9wdGlvbnMuZXNjUHJlc3MpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbkRvY3VtZW50S2V5dXApXG4gICAgICB9XG5cbiAgICAgIGlmKG9wdGlvbnMuY2xhc3NFbmFibGVkKSB7XG4gICAgICAgIGNvbnRhaW5lckVsLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5jbGFzc0VuYWJsZWQpXG4gICAgICB9XG5cdFx0fVxuXG5cdFx0cHVibGljTWV0aG9kcy5pbml0KG9wdGlvbnNOZXcpXG5cblx0XHRyZXR1cm4gcHVibGljTWV0aG9kc1xuXHR9XG5cblx0cmV0dXJuIFBsdWdpblxufSkpXG4iXX0=
},{"element-closest":1}]},{},[2])
(2)
});