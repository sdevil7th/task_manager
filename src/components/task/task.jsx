import React from "react";
import { Button, ProgressBar } from "react-bootstrap";
import styles from "./task.module.scss";

import DeleteIcon from "@material-ui/icons/Delete";

const task = (props) => {
  return (
    <div className={styles.taskContainer}>
      <ProgressBar
        className={styles.progressbar}
        now={props.data.progress}
        label={`${props.data.progress}%`}
      />
      <Button
        onClick={props.onRemove}
        disabled={props.data.isAssigned}
        className={styles.deleteBtn}
      >
        <DeleteIcon
          alt="Server_SVG"
          style={{ fontSize: "24px", color: "white" }}
        />
      </Button>
      {props.data.isAssigned ? (
        ""
      ) : (
        <p className={styles.helpText}>Waiting...</p>
      )}
    </div>
  );
};

export default task;
