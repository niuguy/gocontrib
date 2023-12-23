
import React, { useEffect, useState } from "react";
import {Select} from "@mui/joy";

import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import { GetTasks, UpdateTask } from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";

const TaskPage: React.FC = () => {
    const [tasks, setTasks] = useState<models.Task[]>([]);
    const [taskStatus, setTaskStatus] = useState<{ [taskId: number]: string }>({});

    useEffect(() => {
        GetTasks().then((tasks) => {
            setTasks(tasks);
            const initialStatus = tasks.reduce<{ [taskId: number]: string }>((acc, task) => {
                acc[task.id] = task.status;
                return acc;
            }, {});
            setTaskStatus(initialStatus);
        });
    }, []);

    const handleStatusChange = (task: models.Task, newStatus: string) => {
        setTaskStatus(prev => ({ ...prev, [task.id]: newStatus }));
        task.status = newStatus;
        console.log(task);
        UpdateTask(task);
    };

    // Your existing handleStatusUpdate function...

    return (
        <div>
            <h1>Tasks</h1>
            <Table aria-label="All tasks table">
                <thead>
                    <tr>
                        <th>Repo</th>
                        <th>Issue</th>
                        <th>Notes</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>
                                <a href={`https://github.com/${task.issue_repo_owner}/${task.issue_repo_name}`}>
                                    {task.issue_repo_owner}/{task.issue_repo_name}
                                </a>
                            </td>
                            <td>
                                <a href={task.issue_url}>
                                    {task.issue_title}
                                </a>
                            </td>
                            <td>{task.note}</td>
                            <td>
                                <div>
                                    <Select 
                                        value={taskStatus[task.id] || task.status}
                                        onChange={(e, newStatus) => {
                                            if (newStatus) {
                                                handleStatusChange(task, newStatus);
                                            }
                                        }}
                                    >
                                        <Option value="TODO">TODO</Option>
                                        <Option value="DOING">DOING</Option>
                                        <Option value="DONE">DONE</Option>
                                    </Select>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TaskPage;
