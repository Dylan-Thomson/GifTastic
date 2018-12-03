class GifTastic {
    constructor(categories, key) {
        this.categories = categories;
        this.key = key;
        this.offset = 0;
    }

    getGIFs(searchTerm) {
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + this.key + "&limit=10";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then((response) => {
            console.log(response);
            this.displayGIFs(response, searchTerm);
        });
    }

    displayGIFs(gifs, searchTerm) {
        $("#gif-container").empty();
        gifs.data.forEach((gif) => {
            this.displayGIF(gif);
        });
    
        $("#get-more").removeClass("d-none");
    }

    displayGIF(gif) {
        var img = $("<img>");
        img.attr("data-still", gif.images.fixed_height_small_still.url);
        // img.attr("data-still", gif.images.fixed_width_still.url);
        img.attr("data-animate", gif.images.fixed_height_small.url);
        // img.attr("data-animate", gif.images.fixed_width.url);
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
        var p = $("<p>");
        p.text("Rating: " + gif.rating);
        p.addClass("text-center");
        div.append(p);
        div.addClass("d-inline-block m-3");
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
}


$(document).ready(function() {
    var categories = ["cats", "dogs", "cows", "pigs"];
    var gifTastic = new GifTastic(categories, "dvcHv6i1zrERIdmKZ2fROgBXIsZTvhAE");

    $("#submit-category").on("click", (event) => {
        event.preventDefault();
        gifTastic.addCategory($("#input-category").val());
        $("#input-category").val("");
    });

    $("#clear-gifs").on("click", (event) => {
        event.preventDefault();
        $("#gif-container").empty();
        $("#get-more").addClass("d-none");
    });

    gifTastic.renderButtons();

});