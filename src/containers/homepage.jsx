import React from "react";
import styles from "./homepage.module.scss";

import { Button } from "react-bootstrap";
import Task from "../components/task/task";
import DesktopMacIcon from "@material-ui/icons/DesktopMac";

import { createUUID } from "../utils/generateUuid";

// for help as TypeScript is not being used
// serverType = {
//     serverId: Number,
//     task: number | null,
// }

// taskType = {
//     taskId: Number,
//     isAssigned: Boolean,
//     progress: number
// }

class ServerPage extends React.Component {
  state = {
    servers: [],
    tasks: [],
    noOfTasks: 0,
  };

  componentDidMount() {
    this.addServer();
  }

  onChangeTasksInput(event) {
    this.setState({ noOfTasks: parseInt(event.target.value) });
  }

  onAddTasks() {
    this.addTasks(this.state.noOfTasks);
    this.setState({ noOfTasks: 0 });
  }

  addServer() {
    const servers = this.state.servers.slice();
    servers.push({ serverId: createUUID(), task: null });
    this.setState({ servers: servers }, () => {
      this.eventLoop();
    });
  }

  removeServer(serverId) {
    const servers = this.state.servers.slice();
    const serverIndex = servers.findIndex((item) => item.serverId === serverId);
    servers.splice(serverIndex, 1);
    this.setState({ servers: servers });
  }

  addTasks(noOfTasks) {
    const tasks = this.state.tasks.slice();
    for (let i = 0; i < noOfTasks; i++) {
      tasks.push({ taskId: createUUID(), isAssigned: false, progress: 0 });
    }
    this.setState({ tasks: tasks }, () => {
      this.eventLoop();
    });
  }

  removeTask(taskId) {
    const tasks = this.state.tasks.slice();
    const taskIndex = tasks.findIndex((item) => item.taskId === taskId);
    tasks.splice(taskIndex, 1);
    this.setState({ tasks: tasks });
  }

  taskProgressIncrease(taskId) {
    const taskIndex = this.state.tasks.findIndex(
      (item) => item.taskId === taskId
    );
    const tasks = this.state.tasks.slice();
    if (!tasks[taskIndex] || tasks[taskIndex].progress >= 100) {
      return;
    }
    tasks[taskIndex].progress += 1;
    this.setState({ tasks: tasks });
  }

  beginTask(taskId) {
    let taskInProgress = setInterval(
      (taskId) => {
        this.taskProgressIncrease(taskId);
      },
      200,
      taskId
    );
    setTimeout(() => {
      this.endTask(taskInProgress, taskId);
    }, 20000);
  }

  endTask(taskProcess, taskId) {
    clearInterval(taskProcess);
    const taskIndex = this.state.tasks.findIndex(
      (item) => item.taskId === taskId
    );
    const serverIndex = this.state.servers.findIndex(
      (item) => item.task === taskId
    );
    const tasks = this.state.tasks.slice();
    tasks.splice(taskIndex, 1);
    const servers = this.state.servers.slice();
    servers[serverIndex].task = null;

    this.setState({ tasks: tasks, servers: servers }, () => {
      this.eventLoop();
    });
  }

  eventLoop() {
    let servers = this.state.servers.slice();
    let tasks = this.state.tasks.slice();
    const idleServers = servers.filter((item) => item.task === null);
    const unassignedTasks = tasks.filter((item) => !item.isAssigned);

    if (!idleServers.length || !unassignedTasks.length) {
      return;
    }

    idleServers.forEach((item, index) => {
      const taskIndex = tasks.findIndex(
        (elem) => elem.taskId === unassignedTasks[index].taskId
      );
      const serverIndex = servers.findIndex(
        (elem) => item.serverId === elem.serverId
      );
      servers.splice(serverIndex, 1, {
        serverId: item.serverId,
        task: unassignedTasks[index].taskId,
      });
      tasks.splice(taskIndex, 1, {
        taskId: unassignedTasks[index].taskId,
        isAssigned: true,
        progress: 0,
      });
      this.setState({ servers: servers, tasks: tasks }, () => {
        this.beginTask(unassignedTasks[index].taskId);
      });
    });
  }

  render() {
    const { servers, tasks } = this.state;
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Task Manager</h1>
        <h2 className={styles.subHeading}>Servers</h2>
        <Button
          variant="primary"
          className={styles.addServerBtn}
          onClick={() => this.addServer()}
          disabled={servers.length > 9}
        >
          Add Server
        </Button>
        <div className={styles.serversContainer}>
          {servers.map((item, index) => (
            <div key={item.serverId + index} className={styles.serverBlock}>
              <DesktopMacIcon
                alt="Server_SVG"
                style={{ fontSize: "100px", color: "grey" }}
              />
              <p>{item.task ? "Working.." : "Idle"}</p>

              <Button
                className={styles.removeServerBtn}
                onClick={() => this.removeServer(item.serverId)}
                disabled={servers.length < 2 || item.task}
              >
                Remove Server
              </Button>
            </div>
          ))}
        </div>
        <h2 className={styles.subHeading}>Tasks</h2>
        <div className={styles.addTasksBlock}>
          <input
            className={styles.taskNumberInput}
            type="number"
            value={this.state.noOfTasks}
            onChange={(event) => this.onChangeTasksInput(event)}
          />
          <Button
            className={styles.addTaskBtn}
            onClick={() => this.onAddTasks()}
            disabled={!this.state.noOfTasks}
          >
            Add Tasks
          </Button>
        </div>
        <p className={styles.helpingText}>
          Remaining Tasks: {this.state.tasks.length}
        </p>
        <div className={styles.tasksContainer}>
          {tasks.map((item) => (
            <Task
              key={item.taskId}
              data={item}
              onRemove={() => this.removeTask(item.taskId)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default ServerPage;
