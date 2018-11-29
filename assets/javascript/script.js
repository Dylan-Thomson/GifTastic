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
        var stillUrl = gif.images.fixed_height_small_still.url;
        var animatedUrl = gif.images.fixed_height_small.url;
        img.attr("src", stillUrl);
        img.on("click", () => {
            img.attr("src") === stillUrl ? img.attr("src", animatedUrl) : img.attr("src", stillUrl);
        });
        $("body").append(img);
    });
});
