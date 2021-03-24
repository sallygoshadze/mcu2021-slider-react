import React from 'react';
import './App.css';
import Header from './components/Header';
import Slides from './components/Slides';
import Slide from './components/Slide';
import { repeated, data } from './core/data';

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

      {/* <Slides repeated={repeatedTwo} slides={dataTwo}>
        {dataTwo.map((slide) => {
          return (
            <div key={slide.id}>
              <p>testes {slide.id}</p>
            </div>
          );
        })}
      </Slides> */}
    </div>
  );
}

export default App;
