import React, { useState, useEffect, useCallback, useRef } from 'react';
import './styles.css';

const Slides = ({ repeated, slides, children }) => {
  const [mainState, setMainState] = useState({
    index: 1,
    dotsIndex: 1,
    move: 0,
    lastTouch: 0,
    transitionDuration: '0s',
    transitionTimeout: 0,
    clicked: false,
  });
  const [width, setWidth] = useState(0);

  const swiperRef = useCallback((swiperElement) => {
    if (swiperElement !== null) {
      // Observes resize changes on swiper element
      new ResizeObserver((elements) => {
        // We have only one observed element
        const swiperDiv = elements[0];
        const swiperDivWidth = swiperDiv.contentRect.width;
        if (width !== swiperDivWidth) {
          setWidth(swiperDivWidth);
        }
      }).observe(swiperElement);
    }
  });

  const SLIDE_WIDTH = width;

  // Click and drag effect with mouse events
  //#region mouseEvents
  const handleMouseDown = (e) => {
    setMainState((prevState) => ({
      ...prevState,
      lastTouch: e.pageX,
      clicked: true,
    }));
  };

  const handleMouseMove = (e) => {
    if (!mainState.clicked) return;
    const delta = mainState.lastTouch - e.pageX;
    setMainState((prevState) => ({
      ...prevState,
      lastTouch: e.pageX,
    }));
    handleMovement(delta);
  };

  const handleMouseLeave = () => {
    if (!mainState.clicked) return;
    handleMovementEnd();
    setMainState((prevState) => ({
      ...prevState,
      lastTouch: 0,
      clicked: false,
    }));
  };
  //#endregion

  // Creating animated swipe using touch events
  //#region touchFunctions
  const touchStart = (e) => {
    setMainState((prevState) => ({
      ...prevState,
      lastTouch: e.nativeEvent.touches[0].clientX,
    }));
  };

  const touchMove = (e) => {
    const delta = mainState.lastTouch - e.nativeEvent.touches[0].clientX;
    setMainState((prevState) => ({
      ...prevState,
      lastTouch: e.nativeEvent.touches[0].clientX,
    }));
    handleMovement(delta);
  };

  const touchEnd = () => {
    handleMovementEnd();
    setMainState((prevState) => ({ ...prevState, lastTouch: 0 }));
  };

  const handleMovement = (delta) => {
    clearTimeout(mainState.transitionTimeout);
    setMainState((prevState) => {
      const maxLength = slides.length - 1;
      let nextMove = prevState.move + delta;

      if (nextMove < 0) {
        nextMove = maxLength * SLIDE_WIDTH;
      }
      if (nextMove > maxLength * SLIDE_WIDTH) {
        nextMove = 0;
      }
      return { ...prevState, move: nextMove, transitionTimeout: null };
    });
    setMainState((prevState) => ({ ...prevState, transitionDuration: '0s' }));
  };

  const handleMovementEnd = () => {
    const lastPos = mainState.move / SLIDE_WIDTH;
    const partial = lastPos % 1;
    const lastIndex = lastPos - partial;
    const deltaInt = lastIndex - mainState.index;

    // Handling the direction of slider
    let nextIndex = lastIndex;
    if (deltaInt >= 0) {
      if (partial >= 0.5) {
        nextIndex += 1;
      }
    } else if (deltaInt < 0) {
      nextIndex = mainState.index - Math.abs(deltaInt);
      if (partial > 0.5) {
        nextIndex += 1;
      }
    }

    transition(nextIndex, Math.min(0.2, 1 - Math.abs(partial)));
  };
  //#endregion

  const transition = (index, duration) => {
    let dotsIndex = index;
    for (let slide of repeated) {
      if (slide.repeatedID === index) {
        dotsIndex = slide.originalID;
      }
    }
    setMainState({
      ...mainState,
      index: index,
      dotsIndex: dotsIndex,
      transitionDuration: `${duration}s`,
      move: index * SLIDE_WIDTH,
      transitionTimeout: setTimeout(() => {
        setMainState((prevState) => ({
          ...prevState,
          transitionDuration: '0s',
          transitionTimeout: null,
        }));
      }, duration * 1000),
    });

    setTimeout(() => {
      for (let slide of repeated) {
        if (slide.repeatedID === index) {
          setMainState((prevState) => ({
            ...prevState,
            index: slide.originalID,
            move: slide.originalID * SLIDE_WIDTH,
          }));
        }
      }
    }, 1000);
  };

  useEffect(() => {
    clearTimeout(mainState.transitionTimeout);
  }, []);

  useEffect(() => {
    console.log(mainState.transitionDuration);
  }, [mainState.transitionDuration]);

  useEffect(() => {
    setMainState((prevState) => ({
      ...prevState,
      move: SLIDE_WIDTH * prevState.index,
    }));
  }, [SLIDE_WIDTH]);

  return (
    <div
      className="container"
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseLeave}
      onMouseLeave={handleMouseLeave}
      style={{ userSelect: 'none' }}
    >
      <div
        className="swiper"
        ref={swiperRef}
        style={{
          transform: `translateX(${mainState.move * -1}px)`,
          transitionDuration: mainState.transitionDuration,
        }}
      >
        {children.map((child, i) => (
          <div
            style={{
              width: 'inherit',
              flexShrink: 0,
            }}
            key={i}
          >
            {child}
          </div>
        ))}
      </div>
      <button
        className="prev"
        onClick={() => {
          transition(mainState.index - 1, 1);
        }}
      >
        ←
      </button>
      <button
        className="next"
        onClick={() => {
          transition(mainState.index + 1, 1);
        }}
      >
        →
      </button>

      <ul>
        {slides.slice(1, slides.length - 1).map((slide, i) => {
          const { id } = slide;
          return (
            <li
              key={i}
              className={id === mainState.dotsIndex ? 'dots filled' : 'dots'}
              onClick={() => transition(id, 1)}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Slides;
