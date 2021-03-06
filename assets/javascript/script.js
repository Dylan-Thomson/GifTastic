class GifTastic {
  constructor(categories, key) {
    this.categories = categories;
    this.key = key;
    this.offset = 0;

    // Check local storage for favorites
    this.favoriteCache = JSON.parse(localStorage.getItem('favoriteCache'));
    if (!Array.isArray(this.favoriteCache)) {
      this.favoriteCache = [];
    }
  }

  // Retrieve 10 GIFS using given search value
  getGIFs = (searchTerm) => {
    this.searchTerm = searchTerm;
    this.offset = 0;
    const queryURL = `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${this.key}&limit=10`;
    $('#gif-container').empty();
    this.getData(queryURL);
  }

  // Retrieve the next 10 GIFS of current category
  getMoreGIFs = () => {
    this.offset += 10;
    let queryURL;
    if (this.searchTerm === 'trending') {
      queryURL = `https://api.giphy.com/v1/gifs/trending?api_key=${this.key}&limit=10&offset=${this.offset}`;
    } else {
      queryURL = `https://api.giphy.com/v1/gifs/search?q=${this.searchTerm}&api_key=${this.key}&limit=10&offset=${this.offset}`;
    }
    this.getData(queryURL);
  }

  // Display each GIF from selection
  displayGIFs = (gifs) => {
    if (gifs.data.length > 0) {
      gifs.data.forEach((gif) => {
        this.displayGIF(gif);
      });
      $('#control-button-container').removeClass('d-none');
    } else { // Tell user we didn't find any GIFs :(
      this.appendMessage('No GIFs found. Try a different category!');
    }
  }

  // Display GIF with relevant data and listeners to page
  displayGIF = (gif) => {
    // Build our image and have it animate on click
    const image = this.buildImage(gif);
    const imageDiv = $('<div>').append(image);

    // Build our info div with rating, and buttons
    const infoPanel = this.buildInfoPanel(gif);
    imageDiv.append(infoPanel);

    imageDiv.addClass('d-inline-block m-3 text-white gif-div');
    $('#gif-container').append(imageDiv);
  }


  // Create an image element with still and animated attributes
  buildImage = (gif) => {
    const img = $('<img>');
    img.attr('data-still', gif.images.fixed_height_still.url);
    img.attr('data-animate', gif.images.fixed_height.url);
    img.attr('data-state', 'still');
    img.attr('src', img.attr('data-still'));
    this.animateImageOnClick(img);
    return img;
  }

// Add click listener to change image from still to animated
animateImageOnClick = (img) => {
  img.on('click', () => {
    if (img.attr('data-state') === 'still') {
      img.attr('src', img.attr('data-animate'));
      img.attr('data-state', 'animate');
    } else {
      img.attr('src', img.attr('data-still'));
      img.attr('data-state', 'still');
    }
  });
}

  // Create an information div for an image
  buildInfoPanel = (gif) => {
    const infoPanel = $('<div>');

    // Add gif rating
    const rating = this.buildRatingDiv(gif);
    infoPanel.addClass('text-center');
    infoPanel.append(rating);

    // Add favorite button
    const favoriteButton = this.buildFavoriteButton(gif);
    infoPanel.append(favoriteButton);

    // Add share links (Facebook, Twitter)
    const shareLinks = this.buildShareLinks(gif);
    shareLinks.forEach((link) => {
      infoPanel.append(link);
    });

    return infoPanel;
  }

// Creat div containing gif rating
buildRatingDiv = (gif) => {
  const rating = $('<div>');
  if (gif.rating) {
    rating.text(`Rating: ${gif.rating.toUpperCase()}`);
  }
  return rating;
}

// Create button to save/remove gif from favorites
buildFavoriteButton = (gif) => {
  // Create icon for favorite button based on whether gif is saved as favorite
  const favoriteIcon = $('<i>');
  favoriteIcon.attr('title', 'Favorite');
  if (this.isFavorite(gif)) {
    favoriteIcon.addClass('fas fa-heart pink fa-lg');
  } else {
    favoriteIcon.addClass('far fa-heart fa-lg');
  }
  this.setFavoriteOnClick(favoriteIcon, gif);
  return favoriteIcon;
}

// Save as favorite, or remove from favorites
setFavoriteOnClick = (favoriteIcon, gif) => {
  favoriteIcon.on('click', () => {
    if (this.isFavorite(gif)) {
      favoriteIcon.removeClass('fas pink');
      favoriteIcon.addClass('far');

      // Remove favorite
      this.favoriteCache.splice(this.favoriteCache.indexOf(gif), 1);
      localStorage.setItem('favoriteCache', JSON.stringify(this.favoriteCache));
    } else {
      favoriteIcon.removeClass('far');
      favoriteIcon.addClass('fas pink');

      // Add favorite
      this.favoriteCache.push(gif);
      localStorage.setItem('favoriteCache', JSON.stringify(this.favoriteCache));
    }
  });
}

// Create clickable icons to share gif on Facebook/Twitter
buildShareLinks = (gif) => {
  const links = [];
  // Add facebook link
  const facebookLink = $('<a>');
  facebookLink.attr('href', `https://www.facebook.com/sharer/sharer.php?u=${gif.url}`);
  facebookLink.attr('target', '_blank');
  facebookLink.attr('title', 'Share on Facebook');
  const facebookIcon = $('<i>');
  facebookIcon.addClass('fab fa-facebook fa-lg');
  facebookLink.append(facebookIcon);
  links.push(facebookLink);

  // Add twitter link
  const twitterLink = $('<a>');
  twitterLink.attr('href', `https://twitter.com/home?status=${gif.url}`);
  twitterLink.attr('target', '_blank');
  twitterLink.attr('title', 'Share on Twitter');
  const twitterIcon = $('<i>');
  twitterIcon.addClass('fab fa-twitter-square fa-lg');
  twitterLink.append(twitterIcon);
  links.push(twitterLink);
  return links;
}

// Create buttons for each category
renderButtons = () => {
  $('#button-container').empty();
  this.categories.forEach((category) => {
    const button = $('<button>');
    button.attr('data-value', category);
    button.text(category);
    button.addClass('btn btn-info m-1');
    button.on('click', () => {
      this.getGIFs(category);
    });
    $('#button-container').append(button);
  });
}

// Add a new category, render all buttons, and get GIFs for category
addCategory = (category) => {
  if (this.categories.includes(category)) {
    this.appendMessage('Category already exists');
  } else {
    this.categories.push(category);
    this.renderButtons();
    this.getGIFs(category);
  }
}

// Get 10 trending GIFS
getTrending = () => {
  this.searchTerm = 'trending';
  this.offset = 0;
  const queryURL = `https://api.giphy.com/v1/gifs/trending?api_key=${this.key}&limit=10`;
  $('#gif-container').empty();
  this.getData(queryURL);
}

// Get favorites from cache and display them
getFavorites = () => {
  $('#gif-container').empty();
  if (this.favoriteCache.length > 0) {
    this.favoriteCache.forEach((gif) => {
      this.displayGIF(gif);
    });
  } else { // Tell user there are no favorites
    this.appendMessage("You haven't added any favorites yet. Click the heart icon on a GIF to favorite it!");
  }
}

// Get data from API given query and display
getData = (url) => {
  $.ajax({
    url,
    method: 'GET',
  }).then((response) => {
    this.displayGIFs(response);
  }).fail(() => {
    this.appendMessage('Failed to connect to GIPHY API');
  });
}

// Check if two GIFs have equal ID
isGIFEqual = (gifA, gifB) => {
  if (gifA && gifB) {
    return gifA.id === gifB.id;
  }
  return false;
}

// Check if GIF is in favorite cache
isFavorite = (gif) => {
  for (let i = 0; i < this.favoriteCache.length; i++) {
    if (this.isGIFEqual(gif, this.favoriteCache[i])) return true;
  }
  return false;
}

  // Append message to gif-container (usually when we don't have any GIFS to display)
  appendMessage = (message) => {
    $('#gif-container').empty();
    const div = $('<div>');
    div.addClass('m-4 text-center');
    div.text(message);
    $('#gif-container').append(div);
    $('#control-button-container').addClass('d-none');
  }
}

$(document).ready(() => {
  // Initialize gitTastic and render buttons
  const categories = ['cat', 'dog', 'hamster', 'frog', 'cow', 'parrot', 'otter', 'hamster', 'goat', 'bear', 'dolphin'];
  const gifTastic = new GifTastic(categories, 'dvcHv6i1zrERIdmKZ2fROgBXIsZTvhAE');
  gifTastic.renderButtons();

  // Add a new category from input field if not empty
  $('#submit-category').on('click', (event) => {
    event.preventDefault();
    if ($('#input-category').val() !== '') {
      gifTastic.addCategory($('#input-category').val().trim());
      $('#input-category').val('');
    }
  });

  // Clear GIF container
  $('#clear-gifs').on('click', () => {
    $('#gif-container').empty();
    $('#control-button-container').addClass('d-none');
    gifTastic.offset = 0;
  });

  // Get 10 more of current category
  $('#get-more').on('click', () => {
    gifTastic.getMoreGIFs();
  });

  // Get favorite GIFS
  $('#get-favorites').on('click', () => {
    $('#control-button-container').addClass('d-none');
    gifTastic.getFavorites();
  });

  // Get trending GIFS
  $('#get-trending').on('click', () => {
    gifTastic.getTrending();
  });
});
