/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Container, Typography } from "@mui/joy";
import Table from "@mui/joy/Table";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";


interface Task {
  doc_id: string;
  issue_id: string;
  issue_title: string;
  issue_url: string;
  note: string;
  repo_name: string;
  repo_owner: string;
  status: string;
  uid: string;
}

export const Component = function Tasks(): JSX.Element {

  const queryClient = useQueryClient();

  const fetchTasks = async (): Promise<Task[]> => {
    // const querySnapshot = await getDocs(
    //   query(collection(db, "tasks"), where("uid", "==", user.uid)),
    // );
    // return querySnapshot.docs.map((doc) => ({
    //   doc_id: doc.id,
    //   issue_id: doc.data().issue_id,
    //   issue_title: doc.data().issue_title,
    //   issue_url: doc.data().issue_url,
    //   status: doc.data().status,
    //   repo_owner: doc.data().repo_owner,
    //   repo_name: doc.data().repo_name,
    // })) as Task[];
    return [];
  };

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  // Group tasks by repo_owner and repo_name
  const groupedTasks = tasks?.reduce<Record<string, Task[]>>((acc, task) => {
    const key = `${task.repo_owner}/${task.repo_name}`;
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

  const handleStatusChange = async (docId: string, newStatus: string) => {
    try {
      // // Reference to the specific task document in Firestore
      // const taskRef = doc(db, "tasks", docId);

      // // Update the status field in the document
      // await updateDoc(taskRef, {
      //   status: newStatus,
      // });

      // console.log(`Task ${docId} status changed to ${newStatus}`);

      // Refetch tasks to reflect the update
      queryClient.invalidateQueries();
    } catch (error) {
      console.error("Error updating task status: ", error);
    }
  };

  return (
    <Container sx={{ py: 2 }}>
      {groupedTasks && Object.keys(groupedTasks).length > 0 ? (
        Object.entries(groupedTasks).map(([key, tasks]) => {
          const [repo_owner, repo_name] = key.split("/");
          const repoUrl = `https://github.com/${repo_owner}/${repo_name}/issues`;
          return (
            <div key={key} style={{ marginBottom: "30px" }}>
              <Typography level="h3" gutterBottom>
                <a href={repoUrl} target="_blank" rel="noreferrer">
                  {key}
                </a>
              </Typography>
              <Table
                aria-label={`${key} tasks table`}
                style={{ width: "100%", tableLayout: "fixed" }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>Issue ID</th>
                    <th>Issue Title</th>
                    <th style={{ width: "20%" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.issue_id}>
                      <td>{task.issue_id}</td>
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
                            handleStatusChange(task.doc_id, e.target.value)
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
                  ))}
                </tbody>
              </Table>
            </div>
          );
        })
      ) : (
        <Typography>No tasks found.</Typography>
      )}
    </Container>
  );
};
