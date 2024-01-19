import { Container, Typography } from "@mui/joy";
import Table from "@mui/joy/Table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apis/client";
import { Task } from "../core/types";
import { Fragment } from "react";

export const Component = function Tasks(): JSX.Element {
  const queryClient = useQueryClient();

  const fetchTasks = async (): Promise<Task[]> => {
    const _tasks = await apiClient.get("/tasks");
    return _tasks.data;
  };

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  // Group tasks by repo_owner and repo_name
  const groupedTasks = tasks?.reduce<Record<string, Task[]>>((acc, task) => {
    const key = `${task.issue_repo_owner}/${task.issue_repo_name}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(task);
    return acc;
  }, {});

  if (isLoading) {
    return <Typography>Loading tasks...</Typography>;
  }

  if (error) {
    return <Typography>Error fetching tasks</Typography>;
  }

  const handleStatusChange = async (docId: number, newStatus: string) => {
    try {
      // // Reference to the specific task document in Firestore
      // const taskRef = doc(db, "tasks", docId);

      // // Update the status field in the document
      // await updateDoc(taskRef, {
      //   status: newStatus,
      // });

      console.log(`Task ${docId} status changed to ${newStatus}`);

      // Refetch tasks to reflect the update
      queryClient.invalidateQueries();
    } catch (error) {
      console.error("Error updating task status: ", error);
    }
  };

  return (
    <Container sx={{ py: 2 }}>
      {groupedTasks && Object.keys(groupedTasks).length > 0 ? (
        <Table
          aria-label="Tasks table"
          style={{ width: "100%", tableLayout: "fixed" }}
        >
          <thead>
            <tr>
              <th style={{ width: "10%"}}>Repository</th>
              <th>Issue</th>
              <th style={{ width: "10%"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedTasks).map(([key, tasks], groupIndex) => {
              const [repo_owner, repo_name] = key.split("/");
              const repoUrl = `https://github.com/${repo_owner}/${repo_name}`;

              return tasks.map((task, index) => (
                <tr
                  key={task.issue_id}
                  style={{
                    backgroundColor: groupIndex % 2 ? "#f7f7f7" : "white",
                  }}
                >
                  <td>
                    {index === 0 && (
                      <a href={repoUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 'bold' }}>
                        {repo_owner}/{repo_name}
                      </a>
                    )}
                  </td>
                  <td>
                    <a
                      href={task.issue_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {task.issue_title}
                    </a>
                  </td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                      aria-label="Change Task Status"
                    >
                      <option value="TODO">To Do</option>
                      <option value="INPROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </Table>
      ) : (
        <Typography>No tasks found.</Typography>
      )}
    </Container>
  );
};