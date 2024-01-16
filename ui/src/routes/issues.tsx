/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Alert, Box, Button, Card, Container, Snackbar, Typography } from "@mui/joy";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

import apiClient from "../apis/client";

interface Issue {
  id: number; // Represents gorm.Model's ID
  createdAt: string; // ISO 8601 date string, equivalent to time.Time
  updatedAt: string; // ISO 8601 date string, equivalent to time.Time
  deletedAt: string | null; // ISO 8601 date string or null, equivalent to time.Time
  gitHubID: number; // int64 in Go
  repoID: number; // uint in Go
  url: string;
  title: string;
  language: string;
  commentsCount: number; // int in Go
  isAssigned: boolean;
  labels: string;
  isGoodFirst: boolean;
  isHelpWanted: boolean;
  gitHubCreatedAt: string; // ISO 8601 date string, equivalent to time.Time
  status: "open" | "closed"; // Specific string values
}

export const Component = function Issues(): JSX.Element {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { repo_owner, repo_name } = useParams();


  const fetchIssues = async (): Promise<Issue[]> => {
    const _issues = await apiClient.get(
      "/github/repo/" + repo_owner + "/" + repo_name + "/issues"
    );

    //map to the tasks object
    console.log(_issues.data);
    return _issues.data;
  };

  const {
    data: issues,
    isLoading,
    error,
  } = useQuery({ queryKey: ["issues"], queryFn: fetchIssues });

  if (isLoading) {
    return <Typography>Loading issues...</Typography>;
  }

  if (error) {
    return <Typography>Error fetching issues</Typography>;
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const submitTask = async (issue: Issue) => {
    try {
      const _task = await apiClient.post("/tasks", { 
        issue_id: issue.id,
        issue_title: issue.title,
        issue_url: issue.url,
        issue_repo_name: repo_name,
        issue_repo_owner: repo_owner

       });
      console.log(_task.data);
      setSuccessMessage("Task submitted successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error submitting task:", error);
      setErrorMessage("Failed to submit task.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container sx={{ py: 2 }}>
      <Typography level="h2" gutterBottom>
        Issues
      </Typography>
      <Box sx={{ width: "100%", py: 2, overflowY: "auto" }}>
        {issues?.map((issue) => (
          <Card key={issue.gitHubID} sx={{ mb: 2, p: 2 }}>
            <a href={issue.url} target = "_blank">{issue.title}</a>
            <Button onClick={() => submitTask(issue)}>Submit</Button>
          </Card>
        ))}
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          {successMessage || errorMessage}
      </Snackbar>
    </Container>
  );
};
