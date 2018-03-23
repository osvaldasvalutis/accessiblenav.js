// TODO: supercharge with keyboard arrow presses

(function(window, factory) {
  'use strict'

  if(typeof define === 'function' && define.amd) {
    define([
        'element-closest',
      ],
      function() {
        return factory(window)
      }
    )
  }
  else if(typeof module == 'object' && module.exports) {
    module.exports = factory(
      window,
      require('element-closest')
    )
  }
  else {
    window.accessibleNav = factory(window)
  }
}(window, function factory(window) {

	'use strict'
  window

  // default options

  const optionsDefault = {
    selSub: 'ul',
    selItem: 'li',
    selButton: 'a',
    classItemActive: '--active',
    classEnabled: '--jsfied',
    click: true,
    mouseover: true,
    keypress: true,
    outsideClick: true,
    escPress: true,
  }

  // the plugin's object

  const Plugin = function(containerEl, optionsNew) {

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

    const addClassesUpTheTree = (button) => {
      let parentItem = button.closest(options.selItem)
      while(parentItem) {
        parentItem.classList.add(options.classItemActive)
        parentItem = parentItem.parentNode.closest(options.selItem)
      }
    }

    const onButtonKeyup = (e) => {
      if(e.keyCode != 9) return
      removeAllActiveClasses()
      addClassesUpTheTree(e.target)
    }

    const onItemMouseenter = (e) => {
      addClassesUpTheTree(e.target)
    }

    const onItemMouseleave = () => {
      removeAllActiveClasses()
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

    const onDocumentKeyup = (e) => { // remove all active classes on ESC key press
      if(e.keyCode != 27) return
      removeAllActiveClasses()
    }

    // instance public methods

		publicMethods.destroy = () => { // destroy plugin, deassign tasks
      isInited = false
      removeAllActiveClasses()

      if(options.classEnabled) {
        containerEl.classList.remove(options.classEnabled)
      }

      // TODO: use kollegorna/js-utils/event/addEventListener to minify this
      // code with event namespaces
      buttons.forEach((button) => {
        if(options.click) {
          button.removeEventListener('click', onButtonClick)
        }

        if(options.mouseover) {
          const item = button.closest(options.selItem)
          item.removeEventListener('mouseenter', onItemMouseenter)
          item.removeEventListener('mouseleave', onItemMouseleave)
        }

        if(options.keypress) {
          button.removeEventListener('keyup', onButtonKeyup)
        }
      })

      if(options.outsideClick) {
        document.removeEventListener('click', onDocumentClick)
      }

      if(options.escPress) {
        document.removeEventListener('keyup', onDocumentKeyup)
      }
      // ---
		}

		publicMethods.init = (optionsNew) => { // init plugin, assign tasks
      if(isInited) return

      isInited = true
      options = Object.assign({}, optionsDefault, optionsNew)
      buttons = containerEl.querySelectorAll(options.selButton)

      buttons.forEach((button) => {
        if(options.click) {
          button.addEventListener('click', onButtonClick)
        }

        if(options.mouseover) {
          const item = button.closest(options.selItem)
          item.addEventListener('mouseenter', onItemMouseenter)
          item.addEventListener('mouseleave', onItemMouseleave)
        }

        if(options.keypress) {
          button.addEventListener('keyup', onButtonKeyup)
        }
      })

      if(options.outsideClick) {
        document.addEventListener('click', onDocumentClick)
      }

      if(options.escPress) {
        document.addEventListener('keyup', onDocumentKeyup)
      }

      if(options.classEnabled) {
        containerEl.classList.add(options.classEnabled)
      }
		}

		publicMethods.init(optionsNew)

		return publicMethods
	}

	return Plugin
}))
