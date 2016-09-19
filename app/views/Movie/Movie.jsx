/*
  Movie
*/

import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Moment from 'moment';

import { getTmdbItemData, cleanTmdbData } from '../../actions/tmdb';

import Image from '../../components/Image';
import Gallery from '../../components/Gallery';

class Movie extends React.Component {
  constructor() {
    super();

    this.state = {
      watched: false
    }
  }

  componentWillMount() {
    const type = this.props.location.pathname.split('/')[1],
          currentId = this.props.params.id;

    this.props.getTmdbItemData(type, currentId);
    this.props.getTmdbItemData(type, currentId, 'keywords');
    this.props.getTmdbItemData(type, currentId, 'images');
    this.props.getTmdbItemData(type, currentId, 'videos');
  }

  componentWillUnmount() {
    this.props.cleanTmdbData();
  }

  handleWatch() {
    this.setState({watched: !this.state.watched});
  }

  render() {
    const movie = this.props.tmdb.movie,
          trailer = this.props.tmdb.movie_videos ? this.props.tmdb.movie_videos.results.find(video => video.site === 'YouTube') : '';

    if (movie) {
      return (
        <div className="main-container">
          <div className="cover-container">
            <Image
              src={movie.backdrop_path}
              size="5"
              class="img-responsive"
              alt={movie.title} />
            <div className="cover-content">
              <div className="detail-container">
                <div className="detail-aside">
                  <div className="detail-aside-inner">
                    <Image
                      src={movie.poster_path}
                      size="1"
                      class="img-responsive"
                      alt={movie.title} />

                    <ul className="list-unstyled">
                      <li>
                        <h4>Releases</h4>
                        {Moment(movie.release_date).format('LL')}
                      </li>

                      <li>
                        <h4>Countries</h4>
                        {movie.production_countries.map((country, key) => {
                          const separator = (key + 1) == movie.production_countries.length ? '' : ', ';
                          return (<span key={key}>{country.name}{separator}</span>);
                        })}
                      </li>

                      <li>
                        <h4>Keywords</h4>
                        {(() => {
                          if (this.props.tmdb.movie_keywords && this.props.tmdb.movie_keywords.keywords.length > 0) {
                            const keywords = this.props.tmdb.movie_keywords.keywords;
                            return keywords.map((keyword, key) => {
                              const separator = (key + 1) == keywords.length ? '' : ', ';
                              return (<span key={key}><Link to={`/tag/${keyword.id}/1`}>{keyword.name}</Link>{separator}</span>);
                            });
                          }
                        })()}
                      </li>

                      <li>
                        <h4>Links</h4>
                        <a href={`http://www.imdb.com/title/${movie.imdb_id}`} target="_blank">IMDB</a>
                      </li>

                      <li>
                        <h4>TMBD</h4>
                        <span className="icon icon-edit"></span>
                        <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank">Edit</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="detail-heading">
                  <h3>
                    <button onClick={this.handleWatch.bind(this)}>
                      <span className={this.state.watched ? 'icon icon-eye' : 'icon icon-unwatched'}></span>
                    </button>
                    Movie
                  </h3>
                  <h1>{movie.title}</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-container">
            <div className="detail-content">
              <div className="bg-white">
                <p>“{movie.tagline}”</p>
                <p>
                  {movie.genres.map((genre, key) => {
                    const separator = (key + 1) == movie.genres.length ? '' : ' | ';
                    return (
                      <span key={key}>
                        <Link to={`/genre/${genre.id}/1`}>{genre.name}</Link>
                        {separator}
                      </span>
                    );
                  })}
                </p>
                <p>{movie.overview}</p>
              </div>
              {(() => {
                if (false && this.props.tmdb.movie_videos && this.props.tmdb.movie_videos.results.length > 0) {
                  return (
                    <div className="embed-responsive">
                      <iframe
                        type="text/html"
                        width="533"
                        height="300"
                        src={`http://www.youtube.com/embed/${trailer.key}?enablejsapi=1&amp;autoplay=0&amp;fs=1`}
                        frameBorder="0"
                        allowFullScreen=""></iframe>
                    </div>
                  );
                }
              })()}
              <div className="bg-white">
                <h3>Gallery</h3>
                <Gallery items={this.props.tmdb.movie_images.backdrops} />
              </div>
            </div>
          </div>
        </div>
      );
    } else {return (<span></span>);}
  }
}

function mapStateToProps(state) {
  return {
    tmdb: state.tmdb
  };
}

function mapDispachToProps(dispatch) {
  return bindActionCreators({
    getTmdbItemData,
    cleanTmdbData
  }, dispatch);
}

export default connect(mapStateToProps, mapDispachToProps)(Movie);
