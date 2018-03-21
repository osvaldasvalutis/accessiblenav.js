// TODO: supercharge with keyboard arrows

import 'element-closest'

(function (root, factory) {
  const pluginName = 'accessibleNav'

	if(typeof define === 'function' && define.amd) {
		define([], () => factory(root))
	}
  else if(typeof exports === 'object') {
		module.exports = factory(root)
	}
  else {
		root[pluginName] = factory(root)
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function(window) {

	'use strict'
  window

  // default options

  const optionsDefault = {
    selSub: 'ul',
    selItem: 'li',
    selButton: 'a',
    classItemActive: '--active',
    enableClicks: true,
  }

  // the plugin's object

  const Plugin = (containerEl, optionsNew) => {

    // instance variables

    const publicMethods = {}
    let options = {}
    let isInited = false
    let buttons

    // instance functions

    const removeAllActiveClasses = () => {
      const activeItems = containerEl.querySelectorAll(`${options.selItem}.${options.classItemActive}`)
      if(activeItems.length) {
        activeItems.forEach((activeItem) => {
          activeItem.classList.remove(options.classItemActive)
        })
      }
    }

    const onButtonFocus = (e) => { // keyboard navigation
      if(e.keyCode != 9) return
      removeAllActiveClasses()
      let parentItem = e.target.closest(options.selItem)
      while(parentItem) {
        parentItem.classList.add(options.classItemActive)
        parentItem = parentItem.parentNode.closest(options.selItem)
      }
    }

    const onButtonClick = (e) => {
      let parentItem = e.target.closest(options.selItem)
      if(parentItem.querySelector(options.selSub)) {
        e.preventDefault()
        const isActive = parentItem.classList.contains(options.classItemActive)
        removeAllActiveClasses()
        if(!isActive) {
          parentItem.classList.add(options.classItemActive)
        }
        // TODO: minify code with a custom parents(selector) function
        parentItem = parentItem.parentNode.closest(options.selItem)
        while(parentItem) {
          parentItem.classList.add(options.classItemActive)
          parentItem = parentItem.parentNode.closest(options.selItem)
        }
        // ---
      }
    }

    const onDocumentClick = (e) => { // remove all active classes on outside click
      let doRemove = true
      // TODO: minify code with a custom closest(selector/element) function
      let el = e.target.parentNode
      while(el) {
        if(el === containerEl) {
          doRemove = false
          break
        }
        el = el.parentNode
      }
      // ---
      if(doRemove) {
        removeAllActiveClasses()
      }
    }

    // instance public methods

		publicMethods.destroy = () => { // destroy plugin, deassign tasks
      isInited = false

      buttons.forEach((button) => {
        button.removeEventListener('keyup', onButtonFocus)

        if(options.enableClicks) {
          button.removeEventListener('click', onButtonClick)
        }
      })

      document.removeEventListener('click', onDocumentClick)
		}

		publicMethods.init = (optionsNew) => { // init plugin, assign tasks
      if(isInited) return

      isInited = true
      options = Object.assign({}, optionsDefault, optionsNew)
      buttons = containerEl.querySelectorAll(options.selButton)

      buttons.forEach((button) => {
        button.addEventListener('keyup', onButtonFocus)

        if(options.enableClicks) {
          button.addEventListener('click', onButtonClick)
        }
      })

      document.addEventListener('click', onDocumentClick)
		}

		publicMethods.init(optionsNew)

		return publicMethods
	}

	return Plugin
})
