class GifTastic {
    constructor(categories, key) {
        this.categories = categories;
        this.key = key;
        this.offset = 0;
        // this.favorites = [];

        this.favorites = JSON.parse(localStorage.getItem("favorites"));
        if(!Array.isArray(this.favorites)) {
            this.favorites = [];
        }
    }

    getGIFs(searchTerm) {
        this.searchTerm = searchTerm;
        this.offset = 0;
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + this.key + "&limit=10";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then((response) => {
            console.log(response);
            $("#gif-container").empty();
            this.displayGIFs(response);
        });
    }

    getMoreGIFs() {
        this.offset += 10;
        var queryURL;
        if(this.searchTerm === "trending") {
            queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=" + this.key + "&limit=10&offset=" + this.offset;
        }
        else {
            queryURL = "https://api.giphy.com/v1/gifs/search?q=" + this.searchTerm + "&api_key=" + this.key + "&limit=10&offset=" + this.offset;
        }
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then((response) => {
            console.log(response);
            this.displayGIFs(response);
        });
    }

    displayGIFs(gifs) {
        gifs.data.forEach((gif) => {
            this.displayGIF(gif);
        });
        $("#control-button-container").removeClass("d-none");
    }

    displayGIF(gif) {
        var img = $("<img>");
        // img.attr("data-still", gif.images.fixed_height_small_still.url);
        // img.attr("data-animate", gif.images.fixed_height_small.url);

        // img.attr("data-still", gif.images.fixed_width_still.url);
        // img.attr("data-animate", gif.images.fixed_width.url);
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
            // console.log(this.favorites, "true");
            favoriteIcon.addClass("fas fa-heart pink");
        }
        else {
            // console.log(this.favorites, "false");
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



        // var downloadLink = $("<a>");
        // downloadLink.attr("href", gif.images.original.url);
        // downloadLink.attr("download", "");
        // downloadLink.attr("target", "_blank");
        // var downloadIcon = $("<i>");
        // downloadIcon.addClass("fas fa-arrow-down")
        // downloadLink.append(downloadIcon);
        // infoDiv.append(downloadLink);

        div.append(infoDiv);
        div.addClass("d-inline-block m-3 bg-dark text-white border border-dark");
        $("#gif-container").append(div);
    }

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
    
    addCategory(category) {
        this.categories.push(category);
        this.renderButtons();
    }

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

    getRandom() {
        var queryURL = "https://api.giphy.com/v1/gifs/random?api_key=" + this.key;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then((response) => {
            console.log(response);
            this.displayGIF(response.data);
        });
    }

    getTrending() {
        this.searchTerm = "trending";
        this.offset = 0;
        var queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=" + this.key + "&limit=10";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then((response) => {
            console.log(response);
            this.displayGIFs(response);
        });
    }
}


$(document).ready(function() {
    var categories = ["cats", "dogs", "cows", "pigs"];
    var gifTastic = new GifTastic(categories, "dvcHv6i1zrERIdmKZ2fROgBXIsZTvhAE");

    $("#submit-category").on("click", (event) => {
        event.preventDefault();
        if($("#input-category").val() !== "") {
            gifTastic.addCategory($("#input-category").val().trim());
            $("#input-category").val("");
        }
    });

    $("#clear-gifs").on("click", (event) => {
        event.preventDefault();
        $("#gif-container").empty();
        $("#control-button-container").addClass("d-none");
        gifTastic.offset = 0;
    });

    $("#get-more").on("click", (event) => {
        event.preventDefault();
        gifTastic.getMoreGIFs();
    });

    $("#get-favorites").on("click", (event) => {
        event.preventDefault();
        $("#gif-container").empty();
        $("#control-button-container").addClass("d-none");
        gifTastic.getFavorites();
    });
    
    $("#get-random").on("click", (event) => {
        event.preventDefault();
        $("#gif-container").empty();
        gifTastic.getRandom();
    });

    $("#get-trending").on("click", (event) => {
        event.preventDefault();
        $("#gif-container").empty();
        gifTastic.getTrending();
    });

    gifTastic.renderButtons();

});