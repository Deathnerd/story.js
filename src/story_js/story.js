var utils = new Utils();

var Story = new Class({

    server: "http://theerroris.me/story/",

    data: {},

    story_id: "",

    page_name: "",

    story_ttl: 60 * 60 * 1000,  // An hour for ttl

    /**
     *
     */
    create: function () {
        //if there's not already save data, prompt for login
        /*var story_id = simpleStorage.get('story_id');
         var page_name = simpleStorage.get('page_name');
         if (simpleStorage.canUse() && (story_id === 'undefined' || page_name === 'undefined')) {
         this.login();
         }*/
    },

    /**
     * Attempt to log in the user and fetch the story data from the server.
     * If the user does not enter a story_id, generate a new one and start the game fresh.
     * If the user enters a story_id that doesn't exist, then create a session with that story id.
     * If it's a valid story_id, then load the data and reload the page to the page they were at
     */
    login: function () {
        this.story_id = prompt("Enter your Story Id to pick up where you left off or cancel to create a new game");
        // If they didn't enter anything, then create a new random story session
        if (this.story_id === null || this.story_id === "") {
            this.story_id = utils.randomString(5);
            this.page_name = this._getCurrentPageName();
        } else {
            //try to get the story data
            var resp = this._getStoryData(this.story_id);
            console.log("Response for login: ", resp);
            // if there's an error, bitch about it
            if (resp === false) {
                alert("There was an error parsing the server response. Check the logs");
            } else {
                if (resp.success === false) {
                    // Oh noes! We didn't find a record!
                    alert("A story with that id was not found. Starting a new story with that id");
                    this.page_name = this._getCurrentPageName();
                } else {
                    //otherwise, update the data
                    alert("Reloading your progress");
                    this.page_name = resp.page_name;
                    this.checkpoint();
                    this._goToPage(resp.page_name);
                }
            }
        }
        // set everything
        this.checkpoint();
    },

    /**
     * Effectively creates a checkpoint
     */
    checkpoint: function () {
        // get the current page number because that's handy for saving progress
        // update the data
        this.page_name = this._getCurrentPageName();
        //simpleStorage.set('story_id', this.story_id);
        //simpleStorage.setTTL('story_id', this.story_ttl);
        //simpleStorage.set('page_name', this.page_name);
        //simpleStorage.setTTL('page_name', this.story_ttl);
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
        var ret_val = null;

        $.ajax({
            async: false,
            url: this.server + "load",
            data: {
                story_id: story_id
            }
        }).done(function (response) {
            console.log(response, typeof response);
            if (typeof response === "string") {
                try {
                    ret_val = JSON.parse(response);
                } catch (e) {
                    console.log("Couldn't parse the data, here's the error: ", e);
                    ret_val = false;
                }
            } else {
                try {
                    ret_val = response;
                } catch (e) {
                    console.log("Well this is downright embarassing. I can't return anything. I just broke JavaScript!" +
                    " In an ironic twist, I'm going to now return false, or at least attempt to");
                    ret_val = false;
                }
            }
        }).fail(function (error) {
            console.log(error.statusText);
        });

        return ret_val;
    },

    /**
     * Calls the checkpoint function to save the current data and
     */
    save: function () {
        this.checkpoint();
        var ret_val = null;
        this.story_id = utils.randomString(5);

        $.ajax({
            async: false,
            url: this.server + "save",
            data: {
                story_id: this.story_id,
                page_name: this._getCurrentPageName()
            }
        }).done(function (response) {
            console.log(response, typeof response);
            if (typeof response === "string") {
                try {
                    ret_val = JSON.parse(response);
                } catch (e) {
                    console.log("Couldn't parse the data, here's the error: ", e);
                    ret_val = false;
                }
            } else {
                try {
                    ret_val = response;
                } catch (e) {
                    console.log("Well this is downright embarassing. I can't return anything. I just broke JavaScript!" +
                    " In an ironic twist, I'm going to now return false, or at least attempt to");
                    ret_val = false;
                }
            }
        }).fail(function (error) {
            console.log(error.statusText);
        });

        return ret_val;
    },

    /**
     * Takes the user to a page. Automagically appends .html to the page
     * @param page_name
     * @private
     */
    _goToPage: function (page_name) {
        this.checkpoint();
        if (page_name.indexOf(".html") === -1)
            window.location.replace(page_name + ".html");
        else
            window.location.replace(page_name);
    }
});


var story = new Story();

$(document).ready(function () {
    /**
     * We've clicked on an interactive part of the image, do the stuff
     */
    //$("area").on({
    //    click: function (thing) {
    //        //var page_name = $(this).attr("next-page") || $(this).dataset['next-page'];
    //        //story._goToPage(page_name);
    //        thing.preventDefault();
    //
    //    }
    //});

    /**
     * When they click the save button, save the darned thing
     */
    $("#save_button").on({
        click: function () {
            story.save();
            alert("Your story is saved! Your story id is: " + story.story_id + ". Be sure to write it down!");
        }
    });

    $("#load_button").on({
        click: function() {
            story.login();
        }
    });

    window.onbeforeunload = story.checkpoint();
});
