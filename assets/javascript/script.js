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
    }

    // Retrieve 10 GIFS using given search value
    getGIFs(searchTerm) {
        this.searchTerm = searchTerm;
        this.offset = 0;
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + this.key + "&limit=10";
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

    displayGIFs(gifs) {
        $("#gif-container").empty();
        gifs.data.forEach((gif) => {
            this.displayGIF(gif);
        });
        $("#control-button-container").removeClass("d-none");
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

        if(this.favorites.indexOf(gif.id) >= 0) {
            favoriteIcon.addClass("fas fa-heart pink");
        }
        else {
            favoriteIcon.addClass("far fa-heart");
        }

        favoriteIcon.on("click", () => {
            if(this.favorites.indexOf(gif.id) >= 0) {
                favoriteIcon.removeClass("fas pink");
                favoriteIcon.addClass("far");
                //remove favorite
                this.favorites.splice(this.favorites.indexOf(gif.id), 1);
                console.log(this.favorites);
                localStorage.setItem("favorites", JSON.stringify(this.favorites));
            }
            else {
                favoriteIcon.removeClass("far");
                favoriteIcon.addClass("fas pink");
                //add favorite
                this.favorites.push(gif.id);
                console.log(this.favorites);
                localStorage.setItem("favorites", JSON.stringify(this.favorites));
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
                // $("#gif-container").empty();
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
        this.getData(queryURL);
    }
        
    // TODO: Cache favorites api results, not just search value
    getFavorites() {
        this.favorites.forEach((id) => {
            var queryURL = "https://api.giphy.com/v1/gifs/" + id + "?api_key=" + this.key;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then((response) => {
                console.log(response.data);
                this.displayGIF(response.data);
            });
        });
    }
    
    // Get data from API given query and display
    getData(url) {
        $.ajax({
            url: url,
            method: "GET"
        }).then((response) => {
            console.log(response);
            this.displayGIFs(response);
        });    
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