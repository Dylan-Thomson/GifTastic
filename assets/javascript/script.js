class GifTastic {
    constructor(categories, key) {
        this.categories = categories;
        this.key = key;
        this.offset = 0;

        // Try to get favorites from local storage, initialize to empty array if none found
        this.favorites = JSON.parse(localStorage.getItem("favorites"));
        if(!Array.isArray(this.favorites)) {
            this.favorites = [];
        }

        this.favoriteCache = JSON.parse(localStorage.getItem("favoriteCache"));
        if(!Array.isArray(this.favoriteCache)) {
            this.favoriteCache = [];
        }
    }

    // Retrieve 10 GIFS using given search value
    getGIFs(searchTerm) {
        this.searchTerm = searchTerm;
        this.offset = 0;
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + this.key + "&limit=10";
        $("#gif-container").empty();
        this.getData(queryURL);
    }

    // Retrieve the next 10 GIFS of current category
    getMoreGIFs() {
        this.offset += 10;
        var queryURL;
        if(this.searchTerm === "trending") {
            queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=" + this.key + "&limit=10&offset=" + this.offset;
        }
        else {
            queryURL = "https://api.giphy.com/v1/gifs/search?q=" + this.searchTerm + "&api_key=" + this.key + "&limit=10&offset=" + this.offset;
        }
        this.getData(queryURL);
    }

    // Display each GIF from selection
    displayGIFs(gifs) {
        if(gifs.data.length > 0) {
            gifs.data.forEach((gif) => {
                this.displayGIF(gif);
            });
            $("#control-button-container").removeClass("d-none");
        }
        else { // Tell user we didn't find any GIFs :(
            this.appendMessage("No GIFs found. Try a different category!");
        }
    }

    displayGIF(gif) {
        var img = $("<img>");
        img.attr("data-still", gif.images.fixed_height_still.url);
        img.attr("data-animate", gif.images.fixed_height.url);
        img.attr("data-state", "still");
        img.attr("src", img.attr("data-still"));
        img.on("click", () => {
            if(img.attr("data-state") === "still") {
                img.attr("src", img.attr("data-animate"));
                img.attr("data-state", "animate");
            }
            else {
                img.attr("src", img.attr("data-still"));
                img.attr("data-state", "still");
            }
        });
        var div = $("<div>").append(img);
        var infoDiv = $("<div>");
        var rating = $("<div>");
        if(gif.rating) {
            rating.text("Rating: " + gif.rating.toUpperCase());
        }
        infoDiv.addClass("text-center");
        infoDiv.append(rating);

        var favoriteIcon = $("<i>");

        if(this.isFavorite(gif)) {
            favoriteIcon.addClass("fas fa-heart pink");
            console.log(gif);
        }
        else {
            favoriteIcon.addClass("far fa-heart");
        }

        favoriteIcon.on("click", () => {
            if(this.isFavorite(gif)) {
                favoriteIcon.removeClass("fas pink");
                favoriteIcon.addClass("far");

                // Remove favorite
                this.favoriteCache.splice(this.favoriteCache.indexOf(gif), 1);
                localStorage.setItem("favoriteCache", JSON.stringify(this.favoriteCache));
            }
            else {
                favoriteIcon.removeClass("far");
                favoriteIcon.addClass("fas pink");

                // Add favorite
                this.favoriteCache.push(gif);
                localStorage.setItem("favoriteCache", JSON.stringify(this.favoriteCache));
            }
        });
        infoDiv.append(favoriteIcon);
        div.append(infoDiv);
        div.addClass("d-inline-block m-3 bg-dark text-white border border-dark");
        $("#gif-container").append(div);
    }

    // Create buttons for each category
    renderButtons() {
        $("#button-container").empty();
        this.categories.forEach((category) => {
            var button = $("<button>");
            button.attr("data-value", category);
            button.text(category);
            button.addClass("btn btn-primary m-2");
            button.on("click", () => {
                this.getGIFs(category);
            });
            $("#button-container").append(button);
        });
    }
    
    // Add a new category and render all buttons
    addCategory(category) {
        this.categories.push(category);
        this.renderButtons();
    }

    // Get 10 trending GIFS
    getTrending() {
        this.searchTerm = "trending";
        this.offset = 0;
        var queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=" + this.key + "&limit=10";
        $("#gif-container").empty();
        this.getData(queryURL);
    }
        
    getFavorites() {
        $("#gif-container").empty();
        if(this.favoriteCache.length > 0) {
            this.favoriteCache.forEach((gif) => {
                this.displayGIF(gif);
            });
        }
        else { // Tell user there are no favorites
            this.appendMessage("You haven't added any favorites yet. Click the heart icon on a GIF to favorite it!");
        }
    }
    
    // Get data from API given query and display
    getData(url) {
        $.ajax({
            url: url,
            method: "GET"
        }).then((response) => {
            console.log(response);
            this.displayGIFs(response);
        }).fail(() => {
            this.appendMessage("Failed to connect to GIPHY API");
        });    
    }

    isGIFEqual(gifA, gifB) {
        if(gifA && gifB) {
            return gifA.id === gifB.id
        }
        return false;
    }

    isFavorite(gif) {
        for(var i = 0; i < this.favoriteCache.length; i++) {
            if(this.isGIFEqual(gif, this.favoriteCache[i])) return true;
        }
        return false;
    }

    appendMessage(message) {
        $("#gif-container").empty();
        var div = $("<div>");
        div.addClass("m-4 text-center");
        div.text(message);
        $("#gif-container").append(div);
        $("#control-button-container").addClass("d-none");
    }
    
}

$(document).ready(function() {
    // Initialize gitTastic and render buttons
    var categories = ["cats", "dogs", "cows", "pigs"];
    var gifTastic = new GifTastic(categories, "dvcHv6i1zrERIdmKZ2fROgBXIsZTvhAE");
    gifTastic.renderButtons();

    // Add a new category from input field if not empty
    $("#submit-category").on("click", (event) => {
        event.preventDefault();
        if($("#input-category").val() !== "") {
            gifTastic.addCategory($("#input-category").val().trim());
            $("#input-category").val("");
        }
    });

    // Clear GIF container
    $("#clear-gifs").on("click", (event) => {
        event.preventDefault();
        $("#gif-container").empty();
        $("#control-button-container").addClass("d-none");
        gifTastic.offset = 0;
    });

    // Get 10 more of current category
    $("#get-more").on("click", (event) => {
        event.preventDefault();
        gifTastic.getMoreGIFs();
    });

    // Get favorite GIFS
    $("#get-favorites").on("click", (event) => {
        event.preventDefault();
        $("#control-button-container").addClass("d-none");
        gifTastic.getFavorites();
    });

    // Get trending GIFS
    $("#get-trending").on("click", (event) => {
        event.preventDefault();
        gifTastic.getTrending();
    });

});