var cookie = new Cookie();
var utils = new Utils();

var Story = new Class({

	server: "http://blame.intelliwire.net/~wesgille/",

	data: {},

	/**
	 *
	 */
	create: function () {
		//load the cookie
		//if no cookie, ask for login
		if(cookie.data.length === 0){
		   this.login();
		}
	},

	/**
	 *
	 */
	login: function () {
		var story_id = prompt("Enter your Story Id to pick up where you left off or cancel to create a new game");
		// If they didn't enter anything, then create a new random story session
		if (story_id === null || story_id === "") {
			cookie.add("story_id", utils.randomInt(5));
		} else {
            //try to get the story data
			var resp = this._getStoryData(story_id);
            // if there's an error, bitch about it
            if(resp === false) {
                alert("There was an error parsing the server response. Check the logs");
            } else {
                //otherwise, update the data
                this.data = resp;
                cookie.data = resp;
            }
		}
	},

	/**
	 *
	 */
	checkpoint: function () {
        // get the current page number because that's handy for saving progress
		var page = this._getCurrentPageName();
        // update the datas
        this.data['page_name'] = page;
        cookie.add('page_name', page);
	},

	/**
	 * Gets the page name of the current page, sans suffix.
	 * @returns {*}
	 * @private
	 */
	_getCurrentPageName: function () {
		var path = window.location.pathname;
		var page = path.split("/");

		if (page.length == 1) {
			return "index";
		}

		return page.pop().split(".")[0];
	},

    /**
     * Sends a request to the server with the parameter of story_id
     * @param story_id
     * @private
     */
	_getStoryData: function (story_id) {
		$.ajax({
			url: this.server + "story_js/login.php",
			data: {
				story_id: story_id
			}
		}).done(function (response) {
			console.log(response);
            try {
                return JSON.parse(response);
            } catch (e) {
                console.log("Couldn't parse the data, here's the error: ", e);
                return false;
            }
		}).fail(function (error) {
			console.log(error.statusText);
		});
	},

    /**
     * Calls the checkpoint function to save the current data and
     */
    save: function(){
        this.checkpoint();
        $.ajax({
            url: this.server + "story_js/save.php",
            data: {
                story_data: JSON.stringify(cookie.data)
            }
        }).done(function (response) {
            console.log(response);
            try {
                return JSON.parse(response);
            } catch (e) {
                console.log("Couldn't parse the data, here's the error: ", e);
                return false;
            }
        }).fail(function (error) {
            console.log(error.statusText);
        });
    },

    _goToPage: function(page_name) {
        this.checkpoint();

        window.location(page_name + ".html");
    }
});


var story = new Story();

$(document).ready(function(){
    /**
     * We've clicked on an interactive part of the image, do the stuff
     */
    $("area").on({
        click: function(){
            var page_name = $(this).attr("next-page") || $(this).dataset['next-page'];
            story._goToPage(page_name);
        }
    });

    /**
     * When they click the save button, save the darned thing
     */
    $("#save_button").on({
        click: function() {
            story.save();
            alert("Your story is saved! Your story id is: " + story.data['story_id']);
        }
    });
});
