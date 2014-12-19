// <!-- TODO: PULL INLINE SCRIPT OUT INTO APP JS -->
// <script>
// function menuOpen() {
//     document.getElementById("body").classList.add("menu-open");
// }
// function menuClose() {
//     document.getElementById("body").classList.remove("menu-open");
// }
// function menuSubToggle(el) {
// 	el.classList.toggle("open")
// 	document.getElementById("body").classList.toggle("modal-active")
// }
// </script>


var Huge = {}

Huge.MenuData = (function() {
	var menuItems = {}

	var parseItems = function(resData){
		var items = resData.items
		for (var id = 0; id < items.length; id ++) {
			var idPrefix = 'menu-item_l1_'
			var menuItem = {}
			var item = items[id]
			// menuItem.id = idPrefix + i
			menuItem.open = false
			menuItem.label = item.label
			menuItem.url = item.url
			menuItem.subs = {}

			if (item.items.length > 0) {
				menuItem.hasSubs = true
				var subs = item.items
				var subIdPrefix = 'menu-item_l1-'+id+'_l2_'
				for (var subId = 0; subId < subs.length; subId ++) {
					var sub = {}
					// sub.id = subIdPrefix + subId
					sub.label = subs[subId].label
					sub.url = subs[subId].url
					menuItem.subs[subIdPrefix + subId] = sub
				}
			} else {
				menuItem.hasSubs = false
			}
			menuItems[idPrefix + id] = menuItem
		}
		// console.log("menuItems is now: ", menuItems)
		Huge.View.renderMenu(menuItems)
	}

	return {
		init: function(items) {
			parseItems(items)
		},
		getAll: function() {
			return menuItems
		}
	}

})()

Huge.Comm = (function() {

	var retrieveMenuData = function(resFn) {
		var data 

		request = new XMLHttpRequest();
		request.open('GET', '/api/nav.json', true)

		request.onload = function() {
		  if (this.status >= 200 && this.status < 400){
		    // Success!
		    data = JSON.parse(this.response)
		    resFn(data)
		  } else {
		    // We reached our target server, but it returned an error
				console.log("We reached our target server, but it returned an error")
				data = {items: []}
		    resFn(data)
		  }
		}

		request.onerror = function() {
		  // There was a connection error of some sort
			console.log("There was a connection error of some sort")
			data = {items: []}
	    resFn(data)
		}

		request.send()
	}

	return {
		getMenuData: function(resFn) {
			retrieveMenuData(resFn)
		}
	}

})()

Huge.Template = (function() {

	var extractTemplate = function(templateId) {
		var template = document.getElementById(templateId).children
		return template
	}

	return {
		get: function(templateId) {
			return extractTemplate(templateId)
		}
	}
})()

Huge.View = (function() {

	var mobileView,
			// menuItemTemplate,
			// menuItemSubTemplate,
			hugeBody

	// var extractTemplates = function() {
	// 	menuItemTemplate = Huge.Template.get("nav-l1-template")
	// 	menuItemSubTemplate = Huge.Template.get("nav-l2-template")
	// 	// console.log(menuItemTemplate)
	// 	// console.log(menuItemSubTemplate)
	// }

	var renderMenu = function(menuData) {
		console.log("render data", menuData)
		// console.log(Object.keys(menuData))

		var keys = Object.keys(menuData)
		// console.log("in render", menuItemTemplate)

		for (var i = 0; i < keys.length; i ++) {
			var template = Huge.Template.get("nav-l1-template")
			var menuItem = template[0].cloneNode(true)
			menuItem.children[1].textContent = menuData[keys[i]].label
			menuItem.children[1].href = menuData[keys[i]].url
			document.getElementById("nav-l1-mountpoint").appendChild(menuItem)
			console.log("menuItem: ", menuItem)
		}

	}

	var setMobileView = function() {
		window.innerWidth < 768 ? mobileView = true : mobileView = false
	}

	var closeMobileNav = function() {
		hugeBody.classList.remove("menu-open")
	}

	var bindListeners = function() {
		hugeBody = document.getElementById("body")
		hugeBody.addEventListener("click", handleClick, true);
		window.addEventListener("resize", handleResize, true)
	}

	var handleClick = function(e) {
		console.log(e.target.id)
	}

	var handleResize = function(e) {
		var currentMobileView = mobileView 
		e.target.innerWidth < 768 ? mobileView = true : mobileView = false
		if (currentMobileView == true && mobileView == false) {
			closeMobileNav()
		}
	}

	return {
		init: function() {
			setMobileView()
			// extractTemplates()
			bindListeners()
		},
		renderMenu: function(menuData) {
			renderMenu(menuData)
		}
	}

})()


window.onload = function() {

	Huge.View.init()
	Huge.Comm.getMenuData(Huge.MenuData.init)

}