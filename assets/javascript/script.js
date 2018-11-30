// API KEY: dvcHv6i1zrERIdmKZ2fROgBXIsZTvhAE

// Searching for "cheese"
var searchTerm = "cheese";
var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=dvcHv6i1zrERIdmKZ2fROgBXIsZTvhAE&limit=10";
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
    response.data.forEach(function(gif) {
        var img = $("<img>");
        img.attr("data-still", gif.images.fixed_height_small_still.url);
        img.attr("data-animate", gif.images.fixed_height_small.url);
        img.attr("data-state", "still");
        img.attr("src", img.attr("data-still"));
        // var stillUrl = gif.images.fixed_height_small_still.url;
        // var animatedUrl = gif.images.fixed_height_small.url;
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
        $("body").append(img);
    });
});
