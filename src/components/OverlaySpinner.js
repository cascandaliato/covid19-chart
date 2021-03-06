import React, { useCallback, useRef } from "react";
import { createUseStyles } from "react-jss";
import { CSSTransition } from "react-transition-group";
import "./OverlaySpinner.css";

const useFadeStyles = (initialOpacity, duration) =>
  createUseStyles({
    enter: {
      opacity: initialOpacity,
    },
    enterActive: {
      opacity: 1,
      transition: `opacity ${duration}ms`,
    },
    exit: {
      opacity: 1,
    },
    exitActive: {
      opacity: 0,
      transition: `opacity ${duration}ms`,
    },
  });

const Fade = ({
  visible,
  duration,
  initialOpacity,
  children,
  onExited,
  unmountOnExit,
  positionAbsolute = true,
  className = "flex items-center justify-center",
}) => {
  const div = useRef(null);
  const classes = useFadeStyles(initialOpacity, duration)();

  return (
    <>
      <CSSTransition
        in={visible}
        timeout={duration}
        nodeRef={div}
        classNames={{
          enter: classes.enter,
          enterActive: classes.enterActive,
          exit: classes.exit,
          exitActive: classes.exitActive,
        }}
        mountOnEnter={false}
        unmountOnExit={unmountOnExit}
        onExited={useCallback(() => onExited && onExited(), [onExited])}
      >
        <div
          ref={div}
          className={`w-full h-full ${className}
          ${positionAbsolute ? "absolute" : "relative"} ${classes.enter}`}
        >
          {children}
        </div>
      </CSSTransition>
    </>
  );
};

const OverlaySpinner = ({
  loading,
  duration,
  children,
  onAnimationEnd,
  initialOpacity = 0.1,
  className,
}) => (
  <div className="relative w-full h-full">
    <Fade
      duration={duration}
      initialOpacity={1}
      onExited={onAnimationEnd}
      unmountOnExit={true}
      visible={loading}
    >
      {/* https://tobiasahlin.com/spinkit/ */}
      <div className="sk-circle">
        <div className="sk-circle1 sk-child"></div>
        <div className="sk-circle2 sk-child"></div>
        <div className="sk-circle3 sk-child"></div>
        <div className="sk-circle4 sk-child"></div>
        <div className="sk-circle5 sk-child"></div>
        <div className="sk-circle6 sk-child"></div>
        <div className="sk-circle7 sk-child"></div>
        <div className="sk-circle8 sk-child"></div>
        <div className="sk-circle9 sk-child"></div>
        <div className="sk-circle10 sk-child"></div>
        <div className="sk-circle11 sk-child"></div>
        <div className="sk-circle12 sk-child"></div>
      </div>
    </Fade>
    <Fade
      duration={duration}
      initialOpacity={initialOpacity}
      unmountOnExit={false}
      visible={!loading}
      positionAbsolute={false}
      className={className}
    >
      {children}
    </Fade>
  </div>
);

export default OverlaySpinner;
