import classNames from 'classnames';
import React from 'react';
import styles from './PlayPause.module.css';

const PlayPause = ({ playing, onClick }) => (
  <button
    onClick={onClick}
    className={classNames(styles.button, { [styles.paused]: playing })}
  ></button>
);

export default PlayPause;
