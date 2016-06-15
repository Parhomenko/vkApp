/*vk js*/
VK.init({
  apiId: 5487542
}, '5.52');

$(function() {
  $('.mainContent').prepend('<div class="authText"></div>');

  VK.Auth.getLoginStatus(function(resp) {
    if (resp.status === 'connected') {
      showTitles();
      showUser()
    } else {
      login(function() {
        location.reload();
      });
    }
  });
});


function showUser() {
  VK.api('users.get', {}, function(resp) {
    var userFirstName = resp.response[0].first_name;
    var userLastName = resp.response[0].last_name;
    $('.authText').html("Welcome, " + userFirstName + " " + userLastName + "." + "</div>");
  });
};


function showTitles() {
  VK.api('photos.getAlbums', {
    need_covers: 1
  }, function(data) {
    for (var i = 0; i < data.response.length; i++) {
      var names = data.response[i].title;
      var images = data.response[i].thumb_src;
      $('#content').append("<span><img src=" + images + ">" + names + "</span>");
    };
  });
}




function login(callback) {
  VK.Auth.login(function(response) {
    if (response.session) {
      location.reload();
      callback();
    } else {
      $('.authText').html("You have to be <a href='javascript:void(0);' onclick='login()'> logged in, </a> to see the page content");
    }
  }, VK.access.FRIENDS | VK.access.WIKI | VK.access.PHOTOS);
};





function ListCtrl($scope, $timeout) {
  $scope.names = [];

  VK.api('photos.getAlbums', {
    need_covers: 1
  }, function(data) {
    for (var i = 0; i < data.response.length; i++) {
      var albumTitle = data.response[i].title;
      var albumSrc = data.response[i].thumb_src;
      var albumId = data.response[i].aid;
      var albumEntries = data.response[i].size;
      var albumUpdated = data.response[i].updated;
      albumUpdated = new Date(albumUpdated * 1000);

      var curr_date = albumUpdated.getDate();
      var curr_month = albumUpdated.getMonth() + 1;
      var curr_year = albumUpdated.getFullYear();
      albumUpdated = curr_date + "-" + curr_month + "-" + curr_year
      albumUpdated = albumUpdated;

      $scope.names.push({
        albumTitle: albumTitle,
        albumSrc: albumSrc,
        albumId: albumId,
        albumEntries: albumEntries,
        albumUpdated: albumUpdated
      });
    }
    $timeout();
  });
};

function showAlbum(id, albumTitle) {
  VK.api('photos.get', {
    album_id: id,
    extended: 1
  }, function(data) {
    for (var i = 0; i < data.response.length; i++) {
      var description = data.response[i].text;
      var smallImg = data.response[i].src;
      var bigImg = data.response[i].src_big;
      var pid = data.response[i].pid;
      var comments = data.response[i].comments;
      var likes = data.response[i].likes;
      var reposts = data.response[i].reposts;
      var tags = data.response[i].tags;
      $('.usersPhotos').append("<div class='col-lg-3 col-md-4 col-sm-6 col-xs-12'>" + "<a href = 'javascript:void(0);' class='bg' style = 'background-image:url(" + bigImg + ")' ><a href=" + bigImg + " class='albumsImg" + i + " " + id + " '><i class='fa fa-check'>Select</i></a></a><div class='albumInfo" + i + " '></div>" + "</div>");
      $('.albumsImg' + i).attr("onclick", "showImage(event," + id + "," + pid + ")");
      if (description.length > 0) {
        $(".albumInfo" + i).append("<p><span>Description: </span><span>" + description + "</span></p>");
      };
      if (comments.count) {
        $(".albumInfo" + i).append("<p><span>Comments: </span><span>" + comments.count + "</span></p>");
      };
      if (likes.count) {
        $(".albumInfo" + i).append("<p><span>Likes: </span><span>" + likes.count + "</span></p>");
      };
      if (reposts.count) {
        $(".albumInfo" + i).append("<p><span>Reposts: </span><span>" + reposts.count + "</span></p>");
      };
      if (tags.count) {
        $(".albumInfo" + i).append("<p><span>Tags: </span><span>" + tags.count + "</span></p>");
      };
    };
  });
  $('.hideAlbum span').text(albumTitle);
};



function showImage(event, id, pid) {
  event.preventDefault();
  VK.api('photos.get', {
    album_id: id,
    photo_ids: pid,
    extended: 1
  }, function(data) {
    var bigImg = data.response[0].src_big;
    var description = data.response[0].text;
    var comments = data.response[0].comments;
    var likes = data.response[0].likes;
    var reposts = data.response[0].reposts;
    var tags = data.response[0].tags;
    $('.photo').append("<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>" + "<img src=" + bigImg + " class='fullImage'>" + "<div class='photoInfo'></div>" + "</div>");
    if (description.length > 0) {
      $('.hideImage span').text(description);
      $(".photoInfo").append("<p><span>Description: </span><span>" + description + "</span></p>");
    } else {
      $('.hideImage span').text('no title yet');
    }
    if (comments.count > 0) {
      $(".photoInfo").append("<p><span>Comments: </span><span>" + comments.count + "</span></p>");
    };
    if (likes.count > 0) {
      $(".photoInfo").append("<p><span>Likes: </span><span>" + likes.count + "</span></p>");
    };
    if (reposts.count > 0) {
      $(".photoInfo").append("<p><span>Reposts: </span><span>" + reposts.count + "</span></p>");
    };
    if (tags.count > 0) {
      $(".photoInfo").append("<p><span>Tags: </span><span>" + tags.count + "</span></p>");
    };
  });
  $('.openedAlbum').css('display', 'none');
  $('.openedImage').css('display', 'block');
}



function hideAlbum(elem) {
  $(elem).next().html("");
}

function hideImage(elem) {
  $(elem).next().html("");
  $('.openedAlbum').css('display', 'block');
  $('.openedImage').css('display', 'none');
}
