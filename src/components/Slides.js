import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronRight, FiChevronLeft, FiCircle } from 'react-icons/fi';
import { BsFillCircleFill } from 'react-icons/bs';

const Slides = ({ repeated, slides, children }) => {
  const [mainState, setMainState] = useState({
    index: 1,
    move: 0,
    lastTouch: 0,
    transitionDuration: '0s',
    transitionTimeout: 0,
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
      return { ...prevState, move: nextMove };
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
    setMainState({
      ...mainState,
      index: index,
      transitionDuration: `${duration}s`,
      move: index * SLIDE_WIDTH,
      transitionTimeout: setTimeout(() => {
        setMainState((prevState) => ({
          ...prevState,
          transitionDuration: '0s',
        }));
      }, duration * 100),
    });

    setTimeout(() => {
      repeated.forEach((slide) => {
        if (slide.repeatedID === index) {
          setMainState({
            ...mainState,
            index: slide.originalID,
            move: slide.originalID * SLIDE_WIDTH,
            transitionDuration: '0s',
          });
        }
      });
    }, 1000);
  };

  useEffect(() => {
    clearTimeout(mainState.transitionTimeout);
  }, []);

  useEffect(() => {
    setMainState({ ...mainState, move: SLIDE_WIDTH });
  }, [SLIDE_WIDTH]);

  return (
    <div
      className="container"
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
    >
      <div
        className="swiper"
        ref={swiperRef}
        style={{
          transform: `translateX(${mainState.move * -1}px)`,
          transitionDuration: mainState.transitionDuration,
        }}
      >
        {children}
      </div>
      <button
        className="prev"
        onClick={() => {
          transition(mainState.index - 1, 1);
        }}
      >
        <FiChevronLeft />
      </button>
      <button
        className="next"
        onClick={() => {
          transition(mainState.index + 1, 1);
        }}
      >
        <FiChevronRight />
      </button>

      <ul>
        {slides.slice(1, slides.length - 1).map((slide, i) => {
          const { id } = slide;
          return id === mainState.index ? (
            <BsFillCircleFill key={i} />
          ) : (
            <FiCircle key={i} onClick={() => transition(id, 1)} />
          );
        })}
      </ul>
    </div>
  );
};

export default Slides;
