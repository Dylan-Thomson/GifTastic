function getGIFs(searchTerm) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=dvcHv6i1zrERIdmKZ2fROgBXIsZTvhAE&limit=10";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        displayGIFs(response, searchTerm);
    });
}

function displayGIFs(gifs, searchTerm) {
    // console.log(gifs);
    $("#gif-container").empty();
    gifs.data.forEach(function(gif) {
        displayGIF(gif);
    });

    $("#get-more").removeClass("d-none");
    // var button = $("<button>");
    // button.addClass("btn btn-primary m-3");
    // button.attr("data-offset", 10);
    // button.text("More...");
    // button.on("click", () => {
    //     // console.log(Number(button.attr("data-offset")) + 10);
    //     var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=dvcHv6i1zrERIdmKZ2fROgBXIsZTvhAE&limit=10&offset=" + button.attr("data-offset");
    //     $.ajax({
    //         url: queryURL,
    //         method: "GET"
    //     }).then(function(response) {
    //         console.log(response);
    //         displayGIFs(response, searchTerm);
    //     });

    //     var newOffset = Number(button.attr("data-offset")) + 10;
    //     button.attr("data-offset", newOffset);
    //     console.log(newOffset);
    // });
    // $("#gif-container").append(button);
}

function displayGIF(gif) {
    var img = $("<img>");
    img.attr("data-still", gif.images.fixed_height_small_still.url);
    img.attr("data-animate", gif.images.fixed_height_small.url);
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

function renderButtons(categories) {
    $("#button-container").empty();
    categories.forEach((category) => {
        var button = $("<button>");
        button.attr("data-value", category);
        button.text(category);
        button.addClass("btn btn-primary m-2");
        button.on("click", () => {
            getGIFs(category);
        });
        $("#button-container").append(button);
    });
}

function addCategory() {
    categories.push($("#input-category").val());
    renderButtons(categories);
}


var categories = ["cats", "dogs", "cows", "pigs"];
$(document).ready(function() {
    $("#submit-category").on("click", (event) => {
        event.preventDefault();
        addCategory();
        $("#input-category").val("");
    });

    $("#clear-gifs").on("click", (event) => {
        event.preventDefault();
        $("#gif-container").empty();
    });

    renderButtons(categories);

});