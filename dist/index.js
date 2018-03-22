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

// TODO: supercharge with keyboard arrows

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
    enableClicks: true

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

    var onButtonFocus = function onButtonFocus(e) {
      // keyboard navigation
      if (e.keyCode != 9) return;
      removeAllActiveClasses();
      var parentItem = e.target.closest(options.selItem);
      while (parentItem) {
        parentItem.classList.add(options.classItemActive);
        parentItem = parentItem.parentNode.closest(options.selItem);
      }
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

    // instance public methods

    publicMethods.destroy = function () {
      // destroy plugin, deassign tasks
      isInited = false;

      buttons.forEach(function (button) {
        button.removeEventListener('keyup', onButtonFocus);

        if (options.enableClicks) {
          button.removeEventListener('click', onButtonClick);
        }
      });

      document.removeEventListener('click', onDocumentClick);
    };

    publicMethods.init = function (optionsNew) {
      // init plugin, assign tasks
      if (isInited) return;

      isInited = true;
      options = Object.assign({}, optionsDefault, optionsNew);
      buttons = containerEl.querySelectorAll(options.selButton);

      buttons.forEach(function (button) {
        button.addEventListener('keyup', onButtonFocus);

        if (options.enableClicks) {
          button.addEventListener('click', onButtonClick);
        }
      });

      document.addEventListener('click', onDocumentClick);
    };

    publicMethods.init(optionsNew);

    return publicMethods;
  };

  return Plugin;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfNDEzMjM2MzQuanMiXSwibmFtZXMiOlsid2luZG93IiwiZmFjdG9yeSIsImRlZmluZSIsImFtZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1aXJlIiwiYWNjZXNzaWJsZU5hdiIsIm9wdGlvbnNEZWZhdWx0Iiwic2VsU3ViIiwic2VsSXRlbSIsInNlbEJ1dHRvbiIsImNsYXNzSXRlbUFjdGl2ZSIsImVuYWJsZUNsaWNrcyIsIlBsdWdpbiIsImNvbnRhaW5lckVsIiwib3B0aW9uc05ldyIsInB1YmxpY01ldGhvZHMiLCJvcHRpb25zIiwiaXNJbml0ZWQiLCJidXR0b25zIiwicmVtb3ZlQWxsQWN0aXZlQ2xhc3NlcyIsImFjdGl2ZUl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsImxlbmd0aCIsImZvckVhY2giLCJhY3RpdmVJdGVtIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwib25CdXR0b25Gb2N1cyIsImUiLCJrZXlDb2RlIiwicGFyZW50SXRlbSIsInRhcmdldCIsImNsb3Nlc3QiLCJhZGQiLCJwYXJlbnROb2RlIiwib25CdXR0b25DbGljayIsInF1ZXJ5U2VsZWN0b3IiLCJwcmV2ZW50RGVmYXVsdCIsImlzQWN0aXZlIiwiY29udGFpbnMiLCJvbkRvY3VtZW50Q2xpY2siLCJkb1JlbW92ZSIsImVsIiwiZGVzdHJveSIsImJ1dHRvbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkb2N1bWVudCIsImluaXQiLCJPYmplY3QiLCJhc3NpZ24iLCJhZGRFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7O0FBRUMsV0FBU0EsTUFBVCxFQUFpQkMsT0FBakIsRUFBMEI7QUFDekI7O0FBRUEsTUFBRyxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUExQyxFQUErQztBQUM3Q0QsV0FBTyxDQUNILGlCQURHLENBQVAsRUFHRSxZQUFXO0FBQ1QsYUFBT0QsUUFBUUQsTUFBUixDQUFQO0FBQ0QsS0FMSDtBQU9ELEdBUkQsTUFTSyxJQUFHLFFBQU9JLE1BQVAseUNBQU9BLE1BQVAsTUFBaUIsUUFBakIsSUFBNkJBLE9BQU9DLE9BQXZDLEVBQWdEO0FBQ25ERCxXQUFPQyxPQUFQLEdBQWlCSixRQUNmRCxNQURlLEVBRWZNLFFBQVEsaUJBQVIsQ0FGZSxDQUFqQjtBQUlELEdBTEksTUFNQTtBQUNITixXQUFPTyxhQUFQLEdBQXVCTixRQUFRRCxNQUFSLENBQXZCO0FBQ0Q7QUFDRixDQXJCQSxFQXFCQ0EsTUFyQkQsRUFxQlMsU0FBU0MsT0FBVCxDQUFpQkQsTUFBakIsRUFBeUI7O0FBRWxDOztBQUNDQTs7QUFFQTs7QUFFQSxNQUFNUSxpQkFBaUI7QUFDckJDLFlBQVEsSUFEYTtBQUVyQkMsYUFBUyxJQUZZO0FBR3JCQyxlQUFXLEdBSFU7QUFJckJDLHFCQUFpQixVQUpJO0FBS3JCQyxrQkFBYzs7QUFHaEI7O0FBUnVCLEdBQXZCLENBVUEsSUFBTUMsU0FBUyxTQUFUQSxNQUFTLENBQVNDLFdBQVQsRUFBc0JDLFVBQXRCLEVBQWtDOztBQUUvQzs7QUFFQSxRQUFNQyxnQkFBZ0IsRUFBdEI7QUFDQSxRQUFJQyxVQUFVLEVBQWQ7QUFDQSxRQUFJQyxXQUFXLEtBQWY7QUFDQSxRQUFJQyxnQkFBSjs7QUFFQTs7QUFFQSxRQUFNQyx5QkFBeUIsU0FBekJBLHNCQUF5QixHQUFNO0FBQ25DLFVBQU1DLGNBQWNQLFlBQVlRLGdCQUFaLENBQWdDTCxRQUFRUixPQUF4QyxTQUFtRFEsUUFBUU4sZUFBM0QsQ0FBcEI7QUFDQSxVQUFHVSxZQUFZRSxNQUFmLEVBQXVCO0FBQ3JCRixvQkFBWUcsT0FBWixDQUFvQixVQUFDQyxVQUFELEVBQWdCO0FBQ2xDQSxxQkFBV0MsU0FBWCxDQUFxQkMsTUFBckIsQ0FBNEJWLFFBQVFOLGVBQXBDO0FBQ0QsU0FGRDtBQUdEO0FBQ0YsS0FQRDs7QUFTQSxRQUFNaUIsZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFDQyxDQUFELEVBQU87QUFBRTtBQUM3QixVQUFHQSxFQUFFQyxPQUFGLElBQWEsQ0FBaEIsRUFBbUI7QUFDbkJWO0FBQ0EsVUFBSVcsYUFBYUYsRUFBRUcsTUFBRixDQUFTQyxPQUFULENBQWlCaEIsUUFBUVIsT0FBekIsQ0FBakI7QUFDQSxhQUFNc0IsVUFBTixFQUFrQjtBQUNoQkEsbUJBQVdMLFNBQVgsQ0FBcUJRLEdBQXJCLENBQXlCakIsUUFBUU4sZUFBakM7QUFDQW9CLHFCQUFhQSxXQUFXSSxVQUFYLENBQXNCRixPQUF0QixDQUE4QmhCLFFBQVFSLE9BQXRDLENBQWI7QUFDRDtBQUNGLEtBUkQ7O0FBVUEsUUFBTTJCLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ1AsQ0FBRCxFQUFPO0FBQzNCLFVBQUlFLGFBQWFGLEVBQUVHLE1BQUYsQ0FBU0MsT0FBVCxDQUFpQmhCLFFBQVFSLE9BQXpCLENBQWpCO0FBQ0EsVUFBR3NCLFdBQVdNLGFBQVgsQ0FBeUJwQixRQUFRVCxNQUFqQyxDQUFILEVBQTZDO0FBQzNDcUIsVUFBRVMsY0FBRjtBQUNBLFlBQU1DLFdBQVdSLFdBQVdMLFNBQVgsQ0FBcUJjLFFBQXJCLENBQThCdkIsUUFBUU4sZUFBdEMsQ0FBakI7QUFDQVM7QUFDQSxZQUFHLENBQUNtQixRQUFKLEVBQWM7QUFDWlIscUJBQVdMLFNBQVgsQ0FBcUJRLEdBQXJCLENBQXlCakIsUUFBUU4sZUFBakM7QUFDRDtBQUNEO0FBQ0FvQixxQkFBYUEsV0FBV0ksVUFBWCxDQUFzQkYsT0FBdEIsQ0FBOEJoQixRQUFRUixPQUF0QyxDQUFiO0FBQ0EsZUFBTXNCLFVBQU4sRUFBa0I7QUFDaEJBLHFCQUFXTCxTQUFYLENBQXFCUSxHQUFyQixDQUF5QmpCLFFBQVFOLGVBQWpDO0FBQ0FvQix1QkFBYUEsV0FBV0ksVUFBWCxDQUFzQkYsT0FBdEIsQ0FBOEJoQixRQUFRUixPQUF0QyxDQUFiO0FBQ0Q7QUFDRDtBQUNEO0FBQ0YsS0FqQkQ7O0FBbUJBLFFBQU1nQyxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNaLENBQUQsRUFBTztBQUFFO0FBQy9CLFVBQUlhLFdBQVcsSUFBZjtBQUNBO0FBQ0EsVUFBSUMsS0FBS2QsRUFBRUcsTUFBRixDQUFTRyxVQUFsQjtBQUNBLGFBQU1RLEVBQU4sRUFBVTtBQUNSLFlBQUdBLE9BQU83QixXQUFWLEVBQXVCO0FBQ3JCNEIscUJBQVcsS0FBWDtBQUNBO0FBQ0Q7QUFDREMsYUFBS0EsR0FBR1IsVUFBUjtBQUNEO0FBQ0Q7QUFDQSxVQUFHTyxRQUFILEVBQWE7QUFDWHRCO0FBQ0Q7QUFDRixLQWZEOztBQWlCQTs7QUFFRkosa0JBQWM0QixPQUFkLEdBQXdCLFlBQU07QUFBRTtBQUM1QjFCLGlCQUFXLEtBQVg7O0FBRUFDLGNBQVFLLE9BQVIsQ0FBZ0IsVUFBQ3FCLE1BQUQsRUFBWTtBQUMxQkEsZUFBT0MsbUJBQVAsQ0FBMkIsT0FBM0IsRUFBb0NsQixhQUFwQzs7QUFFQSxZQUFHWCxRQUFRTCxZQUFYLEVBQXlCO0FBQ3ZCaUMsaUJBQU9DLG1CQUFQLENBQTJCLE9BQTNCLEVBQW9DVixhQUFwQztBQUNEO0FBQ0YsT0FORDs7QUFRQVcsZUFBU0QsbUJBQVQsQ0FBNkIsT0FBN0IsRUFBc0NMLGVBQXRDO0FBQ0gsS0FaRDs7QUFjQXpCLGtCQUFjZ0MsSUFBZCxHQUFxQixVQUFDakMsVUFBRCxFQUFnQjtBQUFFO0FBQ25DLFVBQUdHLFFBQUgsRUFBYTs7QUFFYkEsaUJBQVcsSUFBWDtBQUNBRCxnQkFBVWdDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCM0MsY0FBbEIsRUFBa0NRLFVBQWxDLENBQVY7QUFDQUksZ0JBQVVMLFlBQVlRLGdCQUFaLENBQTZCTCxRQUFRUCxTQUFyQyxDQUFWOztBQUVBUyxjQUFRSyxPQUFSLENBQWdCLFVBQUNxQixNQUFELEVBQVk7QUFDMUJBLGVBQU9NLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDdkIsYUFBakM7O0FBRUEsWUFBR1gsUUFBUUwsWUFBWCxFQUF5QjtBQUN2QmlDLGlCQUFPTSxnQkFBUCxDQUF3QixPQUF4QixFQUFpQ2YsYUFBakM7QUFDRDtBQUNGLE9BTkQ7O0FBUUFXLGVBQVNJLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DVixlQUFuQztBQUNILEtBaEJEOztBQWtCQXpCLGtCQUFjZ0MsSUFBZCxDQUFtQmpDLFVBQW5COztBQUVBLFdBQU9DLGFBQVA7QUFDQSxHQXZHQTs7QUF5R0QsU0FBT0gsTUFBUDtBQUNBLENBaEpBLENBQUQiLCJmaWxlIjoiZmFrZV80MTMyMzYzNC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRPRE86IHN1cGVyY2hhcmdlIHdpdGgga2V5Ym9hcmQgYXJyb3dzXG5cbihmdW5jdGlvbih3aW5kb3csIGZhY3RvcnkpIHtcbiAgJ3VzZSBzdHJpY3QnXG5cbiAgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtcbiAgICAgICAgJ2VsZW1lbnQtY2xvc2VzdCcsXG4gICAgICBdLFxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3J5KHdpbmRvdylcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIGVsc2UgaWYodHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJ2VsZW1lbnQtY2xvc2VzdCcpXG4gICAgKVxuICB9XG4gIGVsc2Uge1xuICAgIHdpbmRvdy5hY2Nlc3NpYmxlTmF2ID0gZmFjdG9yeSh3aW5kb3cpXG4gIH1cbn0od2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KHdpbmRvdykge1xuXG5cdCd1c2Ugc3RyaWN0J1xuICB3aW5kb3dcblxuICAvLyBkZWZhdWx0IG9wdGlvbnNcblxuICBjb25zdCBvcHRpb25zRGVmYXVsdCA9IHtcbiAgICBzZWxTdWI6ICd1bCcsXG4gICAgc2VsSXRlbTogJ2xpJyxcbiAgICBzZWxCdXR0b246ICdhJyxcbiAgICBjbGFzc0l0ZW1BY3RpdmU6ICctLWFjdGl2ZScsXG4gICAgZW5hYmxlQ2xpY2tzOiB0cnVlLFxuICB9XG5cbiAgLy8gdGhlIHBsdWdpbidzIG9iamVjdFxuXG4gIGNvbnN0IFBsdWdpbiA9IGZ1bmN0aW9uKGNvbnRhaW5lckVsLCBvcHRpb25zTmV3KSB7XG5cbiAgICAvLyBpbnN0YW5jZSB2YXJpYWJsZXNcblxuICAgIGNvbnN0IHB1YmxpY01ldGhvZHMgPSB7fVxuICAgIGxldCBvcHRpb25zID0ge31cbiAgICBsZXQgaXNJbml0ZWQgPSBmYWxzZVxuICAgIGxldCBidXR0b25zXG5cbiAgICAvLyBpbnN0YW5jZSBmdW5jdGlvbnNcblxuICAgIGNvbnN0IHJlbW92ZUFsbEFjdGl2ZUNsYXNzZXMgPSAoKSA9PiB7XG4gICAgICBjb25zdCBhY3RpdmVJdGVtcyA9IGNvbnRhaW5lckVsLnF1ZXJ5U2VsZWN0b3JBbGwoYCR7b3B0aW9ucy5zZWxJdGVtfS4ke29wdGlvbnMuY2xhc3NJdGVtQWN0aXZlfWApXG4gICAgICBpZihhY3RpdmVJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgYWN0aXZlSXRlbXMuZm9yRWFjaCgoYWN0aXZlSXRlbSkgPT4ge1xuICAgICAgICAgIGFjdGl2ZUl0ZW0uY2xhc3NMaXN0LnJlbW92ZShvcHRpb25zLmNsYXNzSXRlbUFjdGl2ZSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvbkJ1dHRvbkZvY3VzID0gKGUpID0+IHsgLy8ga2V5Ym9hcmQgbmF2aWdhdGlvblxuICAgICAgaWYoZS5rZXlDb2RlICE9IDkpIHJldHVyblxuICAgICAgcmVtb3ZlQWxsQWN0aXZlQ2xhc3NlcygpXG4gICAgICBsZXQgcGFyZW50SXRlbSA9IGUudGFyZ2V0LmNsb3Nlc3Qob3B0aW9ucy5zZWxJdGVtKVxuICAgICAgd2hpbGUocGFyZW50SXRlbSkge1xuICAgICAgICBwYXJlbnRJdGVtLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5jbGFzc0l0ZW1BY3RpdmUpXG4gICAgICAgIHBhcmVudEl0ZW0gPSBwYXJlbnRJdGVtLnBhcmVudE5vZGUuY2xvc2VzdChvcHRpb25zLnNlbEl0ZW0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgb25CdXR0b25DbGljayA9IChlKSA9PiB7XG4gICAgICBsZXQgcGFyZW50SXRlbSA9IGUudGFyZ2V0LmNsb3Nlc3Qob3B0aW9ucy5zZWxJdGVtKVxuICAgICAgaWYocGFyZW50SXRlbS5xdWVyeVNlbGVjdG9yKG9wdGlvbnMuc2VsU3ViKSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBwYXJlbnRJdGVtLmNsYXNzTGlzdC5jb250YWlucyhvcHRpb25zLmNsYXNzSXRlbUFjdGl2ZSlcbiAgICAgICAgcmVtb3ZlQWxsQWN0aXZlQ2xhc3NlcygpXG4gICAgICAgIGlmKCFpc0FjdGl2ZSkge1xuICAgICAgICAgIHBhcmVudEl0ZW0uY2xhc3NMaXN0LmFkZChvcHRpb25zLmNsYXNzSXRlbUFjdGl2ZSlcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiBtaW5pZnkgY29kZSB3aXRoIGEgY3VzdG9tIHBhcmVudHMoc2VsZWN0b3IpIGZ1bmN0aW9uXG4gICAgICAgIHBhcmVudEl0ZW0gPSBwYXJlbnRJdGVtLnBhcmVudE5vZGUuY2xvc2VzdChvcHRpb25zLnNlbEl0ZW0pXG4gICAgICAgIHdoaWxlKHBhcmVudEl0ZW0pIHtcbiAgICAgICAgICBwYXJlbnRJdGVtLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5jbGFzc0l0ZW1BY3RpdmUpXG4gICAgICAgICAgcGFyZW50SXRlbSA9IHBhcmVudEl0ZW0ucGFyZW50Tm9kZS5jbG9zZXN0KG9wdGlvbnMuc2VsSXRlbSlcbiAgICAgICAgfVxuICAgICAgICAvLyAtLS1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvbkRvY3VtZW50Q2xpY2sgPSAoZSkgPT4geyAvLyByZW1vdmUgYWxsIGFjdGl2ZSBjbGFzc2VzIG9uIG91dHNpZGUgY2xpY2tcbiAgICAgIGxldCBkb1JlbW92ZSA9IHRydWVcbiAgICAgIC8vIFRPRE86IG1pbmlmeSBjb2RlIHdpdGggYSBjdXN0b20gY2xvc2VzdChzZWxlY3Rvci9lbGVtZW50KSBmdW5jdGlvblxuICAgICAgbGV0IGVsID0gZS50YXJnZXQucGFyZW50Tm9kZVxuICAgICAgd2hpbGUoZWwpIHtcbiAgICAgICAgaWYoZWwgPT09IGNvbnRhaW5lckVsKSB7XG4gICAgICAgICAgZG9SZW1vdmUgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgZWwgPSBlbC5wYXJlbnROb2RlXG4gICAgICB9XG4gICAgICAvLyAtLS1cbiAgICAgIGlmKGRvUmVtb3ZlKSB7XG4gICAgICAgIHJlbW92ZUFsbEFjdGl2ZUNsYXNzZXMoKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGluc3RhbmNlIHB1YmxpYyBtZXRob2RzXG5cblx0XHRwdWJsaWNNZXRob2RzLmRlc3Ryb3kgPSAoKSA9PiB7IC8vIGRlc3Ryb3kgcGx1Z2luLCBkZWFzc2lnbiB0YXNrc1xuICAgICAgaXNJbml0ZWQgPSBmYWxzZVxuXG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbkJ1dHRvbkZvY3VzKVxuXG4gICAgICAgIGlmKG9wdGlvbnMuZW5hYmxlQ2xpY2tzKSB7XG4gICAgICAgICAgYnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25CdXR0b25DbGljaylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkRvY3VtZW50Q2xpY2spXG5cdFx0fVxuXG5cdFx0cHVibGljTWV0aG9kcy5pbml0ID0gKG9wdGlvbnNOZXcpID0+IHsgLy8gaW5pdCBwbHVnaW4sIGFzc2lnbiB0YXNrc1xuICAgICAgaWYoaXNJbml0ZWQpIHJldHVyblxuXG4gICAgICBpc0luaXRlZCA9IHRydWVcbiAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zRGVmYXVsdCwgb3B0aW9uc05ldylcbiAgICAgIGJ1dHRvbnMgPSBjb250YWluZXJFbC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsQnV0dG9uKVxuXG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbkJ1dHRvbkZvY3VzKVxuXG4gICAgICAgIGlmKG9wdGlvbnMuZW5hYmxlQ2xpY2tzKSB7XG4gICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25CdXR0b25DbGljaylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkRvY3VtZW50Q2xpY2spXG5cdFx0fVxuXG5cdFx0cHVibGljTWV0aG9kcy5pbml0KG9wdGlvbnNOZXcpXG5cblx0XHRyZXR1cm4gcHVibGljTWV0aG9kc1xuXHR9XG5cblx0cmV0dXJuIFBsdWdpblxufSkpXG4iXX0=
},{"element-closest":1}]},{},[2])
(2)
});