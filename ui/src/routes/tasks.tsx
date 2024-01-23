import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, Container, Drawer, Textarea, Typography } from "@mui/joy";
import Table from "@mui/joy/Table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import apiClient from "../apis/client";
import { Task } from "../core/types";

export const Component = function Tasks(): JSX.Element {
  const queryClient = useQueryClient();

  const [drawerState, setDrawerState] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null as Task | null);

  const handleNoteClick = (task: Task) => {
    setSelectedTask(task);
    setDrawerState(true);
  };
  const toggleDrawer = (open: boolean) => () => {
    setDrawerState(open);
  };

  const handleNoteUpdate = () => {
    const result = apiClient.put(`/tasks/${selectedTask!.id}`, selectedTask);
    result.then(
      (res) => {
        if (res.status === 200) {
          queryClient.invalidateQueries();
          window.location.reload(); // Refresh the page
        }
      },

      (error) => {
        console.log("error:", error);
      }
    );
    setDrawerState(false);
  };

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

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      task.status = newStatus;
      await apiClient.put(`/tasks/${task.id}`, task);

      queryClient.invalidateQueries();
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error updating task status: ", error);
    }
  };

  const handleDeleteClick = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await apiClient.delete(`/tasks/${taskId}`);
        queryClient.invalidateQueries();
        window.location.reload(); // Refresh the page
      } catch (error) {
        console.error("Error deleting task: ", error);
      }
    }
  };

  const drawer = (
    <Box
      role="presentation"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Centers the content horizontally
        justifyContent: "center", // Centers the content vertically
        gap: 2, // Adds gap between each child element
        width: "100%", // Ensures the box takes full width
        mt: 2, // Adds margin at the top for spacing
      }}
    >
      <Typography
        sx={{
          textAlign: "center", // Centers the text within Typography
          width: "100%", // Ensures Typography takes full width of the parent
        }}
      >
        {selectedTask?.issue_title}
      </Typography>

      <Textarea
        defaultValue={selectedTask ? selectedTask.note : ""}
        placeholder="Add a note..."
        minRows={20}
        sx={{
          width: "90%",
          mx: 2, // Adjusts horizontal margin if needed
        }}
        onChange={(e) => {
          selectedTask!.note = e.target.value;
        }}
      />

      <Button
        onClick={handleNoteUpdate}
        sx={{
          mt: 2, // Adjusts top margin for the button
          width: "fit-content", // Adjusts button width to fit its content
        }}
      >
        Update
      </Button>
    </Box>
  );

  return (
    <Fragment>
      <Container sx={{ py: 2 }}>
        {groupedTasks && Object.keys(groupedTasks).length > 0 ? (
          <Table
            aria-label="Tasks table"
            style={{ width: "100%", tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <th style={{ width: "10%" }}>Repository</th>
                <th>Task Issue</th>
                <th style={{ width: "10%" }}>Note</th>
                <th style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedTasks).map(([key, tasks], groupIndex) => {
                const [repo_owner, repo_name] = key.split("/");
                const repoUrl = `https://github.com/${repo_owner}/${repo_name}`;
                const internalUrl = `/issues/${repo_owner}/${repo_name}`;

                return tasks.map((task, index) => (
                  <tr
                    key={task.issue_id}
                    style={{
                      backgroundColor: groupIndex % 2 ? "#f7f7f7" : "white",
                    }}
                  >
                    <td>
                      {index === 0 && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <a
                            href={internalUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontWeight: "bold" }}
                          >
                            {repo_name}
                          </a>
                          <a href={repoUrl} target="_blank" rel="noreferrer">
                            <OpenInNewIcon fontSize="small" />
                          </a>
                        </div>
                      )}
                    </td>
                    <td>
                      <a href={task.issue_url} target="_blank" rel="noreferrer">
                        {task.issue_title}
                      </a>
                      <a href={task.issue_url} target="_blank" rel="noreferrer">
                        <OpenInNewIcon fontSize="small" />
                      </a>
                    </td>
                    <td>
                      <EditNoteIcon
                        style={{ cursor: "pointer", fontSize: "inherit" }} // Makes the icon look clickable
                        onClick={() => handleNoteClick(task)}
                      />
                    </td>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task, e.target.value)
                        }
                        aria-label="Change Task Status"
                      >
                        <option value="TODO">To Do</option>
                        <option value="INPROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                        <option value="CLOSED">Closed</option>
                      </select>

                      <DeleteIcon
                        style={{ cursor: "pointer", fontSize: "inherit" }} // Makes the icon look clickable
                        onClick={() => handleDeleteClick(task.id)}
                      />
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </Table>
        ) : (
          <Typography>No tasks found.</Typography>
        )}

        <Drawer anchor="right" open={drawerState} onClose={toggleDrawer(false)}>
          {drawer}
        </Drawer>
      </Container>
    </Fragment>
  );
};
