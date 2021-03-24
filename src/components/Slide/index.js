import React from 'react';
import './styles.css';

const Slide = ({ slide }) => {
  const { image, type, date, title, cast, details, url } = slide;
  return (
    <div className="slide">
      <img
        src={image}
        alt={`${title} poster`}
        onDragStart={(e) => e.preventDefault()}
      />
      <div className="content">
        <div>
          <a href={url} target="_blank">
            {title}
          </a>
          <h3>{type}</h3>
        </div>
        <span className="info">
          <span>Release Date:</span>
          <h4>{date}</h4>
        </span>
        <span className="info">
          <span>Cast:</span>
          <h4>{cast}</h4>
        </span>
        <p>{details}</p>
      </div>
    </div>
  );
};

export default Slide;
