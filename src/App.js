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
      <Slides repeated={repeated} slides={data}>
        {data.map((slide) => {
          return <Slide key={slide.id} slide={slide} />;
        })}
      </Slides>
    </div>
  );
}

export default App;
