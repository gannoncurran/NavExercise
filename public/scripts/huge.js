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

Huge.Comm = (function() {

	var retrieveMenuData = function() {
		var data 

		request = new XMLHttpRequest();
		request.open('GET', '/api/nav.json', true)

		request.onload = function() {
		  if (this.status >= 200 && this.status < 400){
		    // Success!
		    data = JSON.parse(this.response)
		    console.log("response from server, parsed: ", data)
		    return data
		  } else {
		    // We reached our target server, but it returned an error
			console.log("We reached our target server, but it returned an error")
			data = []
		  }
		}

		request.onerror = function() {
		  // There was a connection error of some sort
			console.log("There was a connection error of some sort")
			data = []
		}

		request.send()
	}

	return {
		getMenuData: function() {
			retrieveMenuData()
		}
	}

})()


window.onload = function() {
	Huge.Comm.getMenuData()
}