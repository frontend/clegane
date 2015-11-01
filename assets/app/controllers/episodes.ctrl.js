'use strict';

/* global app, PhotoSwipe, PhotoSwipeUI_Default, jQuery */

app.controller('EpisodesCtrl', function($http, ApiService) {
  var that = this;

  that.seasonOpen = [];
  that.episodeOpen = false;

  that.images = [];
  that.gallery = [];

  that.getData = function (id, season, episode) {
    that.number = episode;
    that.seasonnumber = season;

    // Get episode images
    $http.get('http://api.themoviedb.org/3/tv/'+id+'/season/'+season+'/episode/'+episode+'/images?api_key=6d83177ea3e67b870ab80fa72f06cbbd', {
      params: {
        api_key: 'API_KEY_HERE'
      }
    }).then(function(res){
      that.images = res.data.stills;
      that.gallery = [];
      res.data.stills.forEach(function(image){
        var item = {
          src : 'https://image.tmdb.org/t/p/original'+image.file_path,
          w   : image.width,
          h   : image.height
        };
        that.gallery.push(item);
      });
    });
  };

  that.init = function (seasons) {
    for (var i = 0; i <= seasons; i++) {
      that.seasonOpen[i] = false;
    }
  };

  that.selectSeason = function (id, season) {
    if (that.episodeOpen) {
      that.seasonOpen[season] = true;
      that.getData(id, season, 1);
    }
  };

  that.selectEpisode = function (id, season, episode) {
    that.episodeOpen = true;

    setTimeout(function(){
      that.getData(id, season, episode);
    }, 300);
  };

  that.openGallery = function (index) {
    var $pswp = $('.pswp')[0],
        options = {
          index: index,
          bgOpacity: 0.85,
          showHideOpacity: true
        };

    // Initialize PhotoSwipe
    var gallery = new PhotoSwipe($pswp, PhotoSwipeUI_Default, that.gallery, options);
    gallery.init();
  };

});
