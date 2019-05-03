import React from 'react';

function MovieCard(props) {
  return (
    <div className="card m-2">
      <img className="card-img-top" src={props.poster} alt={props.Poster}/>
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
      </div>
      <div className="card-footer">
        <small className="text-muted">{props.type} - {props.year}</small>
      </div>
    </div>
  )
}

export default MovieCard;
