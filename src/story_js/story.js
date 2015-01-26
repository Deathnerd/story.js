var cookie = new Cookie();
var utils = new Utils();

var Story = new Class({

    server: "http://blame.intelliwire.net/~wesgille/",

    data: {},

    /**
     *
     */
    create: function(){
        //load the cookie
	    //if no cookie, ask for login
	    if(cookie.data.length === 0){
		    this.login();
	    }
    },

    /**
     *
     */
    login: function() {
	    var story_id = prompt("Enter your Story Id to pick up where you left off or cancel to create a new game");
        // If they didn't enter anything, then create a new random story session
	    if(story_id === null || story_id === ""){
            cookie.add("story_id", utils.randomInt(5));
	    } else {
            this._getStoryId(story_id);
        }
    },

    /**
     *
     */
	save: function() {
		var page = this._getCurrentPageName();
	},

    /**
     * Gets the page name of the current page, sans suffix.
     * @returns {*}
     * @private
     */
	_getCurrentPageName: function(){
		var path = window.location.pathname;
		var page = path.split("/");

		if(page.length == 1){
			return "index";
		}

		return page.pop().split(".")[0];
	},

    _getStoryId: function(story_id){
        $.ajax({
            url: this.server + "story_js/login.php",
            dataType: 'jsonp',
            data: {
                story_id: story_id
            },
            crossDomain: true
        }).done(function(response){
            console.log(response);
        }).fail(function(error){
            console.log(error.statusText);
        });
    }
});