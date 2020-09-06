import React, { useCallback, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { CSSTransition } from 'react-transition-group';

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
    centered: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
  });

const useContainerStyles = createUseStyles({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    flexGrow: 1,
  },
});

const Fade = ({ visible, duration, initialOpacity, children, onExited, unmountOnExit }) => {
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
        <div ref={div} className={`${classes.enter} ${classes.centered}`}>
          {children}
        </div>
      </CSSTransition>
    </>
  );
};

const OverlaySpinner = ({ loading, duration, children, onAnimationEnd, initialOpacity = 0.1 }) => {
  const classes = useContainerStyles();

  return (
    <div className={classes.container}>
      <Fade
        duration={duration}
        initialOpacity={1}
        onExited={onAnimationEnd}
        unmountOnExit={true}
        visible={loading}
      >
        {/* https://projects.lukehaas.me/css-loaders/ */}
        {/* <div className="loader" /> */}
        {/* https://tobiasahlin.com/spinkit/ */}
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube"></div>
          <div className="sk-cube2 sk-cube"></div>
          <div className="sk-cube4 sk-cube"></div>
          <div className="sk-cube3 sk-cube"></div>
        </div>
        {/* <div className="loadingio-spinner-wedges-4txtq1mnnm9">
          <div className="ldio-koe2ptwtho">
            <div>
              <div>
                <div></div>
              </div>
              <div>
                <div></div>
              </div>
              <div>
                <div></div>
              </div>
              <div>
                <div></div>
              </div>
            </div>
          </div>
        </div> */}
      </Fade>
      <Fade
        duration={duration}
        initialOpacity={initialOpacity}
        unmountOnExit={false}
        visible={!loading}
      >
        {children}
      </Fade>
    </div>
  );
};

export default OverlaySpinner;
