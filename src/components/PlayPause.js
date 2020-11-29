import classNames from "classnames";
import React from "react";
import styles from "./PlayPause.module.css";

const PlayPause = ({ playing, onClick, className }) => (
  <button
    onClick={onClick}
    className={`${className} ${classNames(styles.button, {
      [styles.paused]: playing,
    })}`}
    aria-label="Play/Pause"
  ></button>
);

export default PlayPause;
