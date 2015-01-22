var cookie = new Cookie();

var Story = new Class({

    create: function(){
        //load the cookie
        this.cookie = document.cookie;

	    //if no cookie, ask for login
	    if(this.cookie.length === 0 || this.cookie.has("story_id")){
		    this.login();
	    }
    },

    login: function() {
	    var story_id = prompt("Enter your Story Id to pick up where you left off or cancel to create a new game");
	    if(story_id === null || story_id === ""){
			this.cookie = "story_id:" + Math.round(Math.random()*1000) + "|";
		    this.cookie += "current_page:" + this._getCurrentPageName();
	    }
    },

	save: function() {
		var page = this._getCurrentPageName();
	},

	_getCurrentPageName: function(){
		var path = window.location.pathname;
		var page = path.split("/");

		if(page.length == 1){
			return "index";
		}

		return page.pop().split(".")[0];
	},

	_buildCookie: function(){

	}
});