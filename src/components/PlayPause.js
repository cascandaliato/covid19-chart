import classNames from "classnames";
import React from "react";
import styles from "./PlayPause.module.css";

const PlayPause = ({ playing, onClick, classes }) => (
  <button
    onClick={onClick}
    className={`${classes} ${classNames(styles.button, {
      [styles.paused]: playing,
    })}`}
    aria-label="Play/Pause"
  ></button>
);

export default PlayPause;
