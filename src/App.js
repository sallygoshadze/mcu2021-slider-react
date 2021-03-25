import React from 'react';
import './App.css';
import Header from './components/Header';
import Slides from './components/Slides';
import Slide from './components/Slide';
import { repeated, data, dataTwo, repeatedTwo } from './core/data';

function App() {
  return (
    <div className="app">
      <Header />
      {/* Each object in `data` should have an ID property */}
      <Slides repeated={repeated} slides={data}>
        {data.map((slide) => {
          return <Slide key={slide.id} slide={slide} />;
        })}
      </Slides>

      {/* A demonstration for random HTML content */}
      <Slides repeated={repeatedTwo} slides={dataTwo}>
        {dataTwo.map((slide) => {
          switch (slide.type) {
            case 'HEADER':
              return <h1 key={slide.id}>RANDOM HEADER</h1>;
            case 'TEXT':
              return <p key={slide.id}>Random Paragraph</p>;
            case 'IMG':
              return (
                <img
                  key={slide.id}
                  src="https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjN8fG11c2ljfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                  alt="random image"
                />
              );
            case 'IMG|TEXT':
              return (
                <div key={slide.id}>
                  <img
                    src="https://images.unsplash.com/photo-1548174753-897b449b097e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
                    alt="random image"
                  />
                  <h3>Random h3 text with an image wrapped in a div.</h3>
                </div>
              );
            default:
              break;
          }
        })}
      </Slides>
    </div>
  );
}

export default App;
