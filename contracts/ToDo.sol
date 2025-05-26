// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ToDo {
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(address => Task[]) private userTasks;
    uint private taskCounter = 0;

    event TaskCreated(address indexed user, uint id, string content);
    event TaskUpdated(address indexed user, uint id, bool completed);
    event TaskDeleted(address indexed user, uint id);

    function createTask(string calldata _content) external {
        Task memory newTask = Task(taskCounter, _content, false);
        userTasks[msg.sender].push(newTask);
        emit TaskCreated(msg.sender, taskCounter, _content);
        taskCounter++;
    }

    function getTasks() external view returns (Task[] memory) {
        return userTasks[msg.sender];
    }

    function toggleTask(uint _id) external {
        Task[] storage tasks = userTasks[msg.sender];
        for (uint i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                tasks[i].completed = !tasks[i].completed;
                emit TaskUpdated(msg.sender, _id, tasks[i].completed);
                return;
            }
        }
    }

    function deleteTask(uint _id) external {
        Task[] storage tasks = userTasks[msg.sender];
        for (uint i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                tasks[i] = tasks[tasks.length - 1];
                tasks.pop();
                emit TaskDeleted(msg.sender, _id);
                return;
            }
        }
    }
}
