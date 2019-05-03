import React, { Component } from 'react';
import $ from 'jquery';

import MovieCard from './MovieCard';
import Base_Url from '../config/config';

class Movies extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery : '',
      currentPage : 1,
      movies : [],
      totalMovies: 0,
      totalPages: 0
    };
    this.onSearchInput = this.onSearchInput.bind(this);
    this._getResults = this._getResults.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  onSearchInput(e) {
    let searchQuery = e.target.value;
    this.setState({searchQuery});
  }

  _getResults(url) {
    let oThis = this;
    let pageNumber = null;
    if(url.indexOf("page")) pageNumber = parseInt(url[url.length-1], 10);
    fetch(url)
      .then(res => res.json())
      .then(results => {
        if(results.Response === "True") {
          oThis.movies = results.Search;
          oThis.setState({
            movies: results.Search,
            totalMovies: results.totalResults,
            totalPages: parseInt(results.totalResults/10),
            currentPage: pageNumber ? pageNumber : 1
          })
          $('#no-movie-alert').removeClass("show").addClass("d-none");
          $('#invalid-search').removeClass("show").addClass("d-none");
        } else {
          $('#no-movie-alert').addClass("show").removeClass("d-none");
          $('#invalid-search').removeClass("show").addClass("d-none");
        }
      })
      .catch(e => {
        alert("Unable to fetch from API");
      });
  }

  onSearch(e) {
    e.preventDefault();
    let searchQuery = this.state.searchQuery;
    if(!searchQuery.trim()) {
      $('#no-movie-alert').removeClass("show").addClass("d-none");
      $('#invalid-search').addClass("show").removeClass("d-none");
      return;
    }
    let url = "http://www.omdbapi.com/?apikey=4df1e146&s=" + searchQuery;
    this._getResults.call(this, url);

  }

  onPrevious() {
    let root_url = Base_Url;
    let pageNumber = this.state.currentPage - 1;
    let searchQuery = this.state.searchQuery;
    let url = root_url + "&s=" + searchQuery + "&page=" + pageNumber;
    this._getResults.call(this, url);
    let currentPage = this.state.currentPage;
    this.setState({
      currentPage : currentPage-1
    });
  }

  onNext() {
    let root_url = Base_Url;
    let pageNumber = this.state.currentPage + 1;
    let searchQuery = this.state.searchQuery;
    let url = root_url + "&s=" + searchQuery + "&page=" + pageNumber;
    this._getResults.call(this, url);
    let currentPage = this.state.currentPage;
    this.setState({
      currentPage : currentPage+1
    });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark bg-dark d-flex justify-content-center">
          <span className="navbar-brand">
            Movie Finder
          </span>
        </nav>
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand">Movies ({this.state.totalMovies})</span>
          <form className="form-inline">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value={this.state.searchQuery} onChange={this.onSearchInput}/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={this.onSearch}>Search</button>
          </form>
        </nav>
        <div className="alert alert-warning alert-dismissible fade d-none" id="no-movie-alert" role="alert">
          <strong>No movies!</strong> No movies with the search keyword.
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="alert alert-warning alert-dismissible fade d-none" id="invalid-search" role="alert">
          <strong>Invalid search!</strong> Search with a valid keyword.
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        {
          this.state.movies.length ? (
            <div className="d-flex flex-wrap justify-content-center">
            {
              this.state.movies.map(movie => {
                return <MovieCard poster={movie.Poster} title={movie.Title} type={movie.Type} year={movie.Year} key={movie.imdbID}/>
              })
            }
            </div>
          ) : (
            <div>
              <div className="jumbotron d-flex align-items-center justify-content-center mt-2" style={{height:"25rem", backgroundColor: "#cce5ff"}}>
                <h2>Go ahead! Search for any movie</h2>
              </div>
            </div>
          )
        }


        <div className="d-flex justify-content-around mb-2" style={{visibility: this.state.totalMovies ? 'visible':'hidden'}}>
          <button className="btn btn-dark" onClick={this.onPrevious} disabled={this.state.currentPage === 1}>Previous</button>
          <button className="btn btn-dark" onClick={this.onNext} disabled={this.state.currentPage === this.state.totalPages}>Next</button>
        </div>
      </div>
    )
  }
}

export default Movies;
