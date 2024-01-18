import {
  Box,
  Button,
  Card,
  Container,
  Snackbar,
  Typography,
  Chip,
} from "@mui/joy";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";

import apiClient from "../apis/client";

import { Issue } from "../core/types";
import { useAtom } from "jotai";
import { refreshCounterAtom } from "../core/store";

export const Component = function Issues(): JSX.Element {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { repo_owner, repo_name } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const label = queryParams.get("label");
  const [refreshCounter, setRefreshCounter] = useAtom(refreshCounterAtom);

  const checkFollowStatus = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/repo/${repo_owner}/${repo_name}`);
      //if repo exist in db, then it is followed
      if (response.data) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error fetching follow status:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkFollowStatus();
  }, [repo_owner, repo_name]);

  const handleFollowClick = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await apiClient.delete(`/repo/${repo_owner}/${repo_name}`);
      } else {
        const repo = {
          owner: repo_owner,
          name: repo_name,
        };
        await apiClient.post("/repo", repo);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
    setIsLoading(false);
    setRefreshCounter(refreshCounter + 1);
  };

  const fetchIssues = async ({ pageParam = 1 }): Promise<Issue[]> => {
    var _url =
      "/github/repo/" +
      repo_owner +
      "/" +
      repo_name +
      "/issues?page=" +
      pageParam +
      "&per_page=10";

    if (label) {
      _url += "&label=" + label;
    }

    const _issues = await apiClient.get(_url);
    return _issues.data;
  };

  const {
    data: issues,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["issues", label],
    queryFn: fetchIssues,
    getNextPageParam: (lastPage, pages) => {
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const submitTask = async (issue: Issue) => {
    try {
      await apiClient.post("/tasks", {
        issue_title: issue.title,
        issue_url: issue.url,
        issue_repo_name: repo_name,
        issue_repo_owner: repo_owner,
      });
      setSuccessMessage("Task submitted successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error submitting task:", error);
      setErrorMessage("Failed to submit task.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container sx={{ py: 2, position: "relative" }}>
      <Chip
        key="helpwanted"
        disabled={false}
        size="lg"
        slotProps={{ action: { component: 'a', href: `/issues/${repo_owner}/${repo_name}?label=help%20wanted` } }}
      >
        Help Wanted
      </Chip>

      <Button
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          color: isFollowing ? "primary" : "secondary",
        }}
        onClick={handleFollowClick}
        disabled={isLoading}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      <Typography level="h2" gutterBottom>
        {repo_owner}/{repo_name} Issues
      </Typography>
      <Box sx={{ width: "100%", py: 2, overflowY: "auto" }}>
        {issues?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.map((issue: Issue) => (
              <Card key={issue.github_id} sx={{ mb: 2, p: 2 }}>
                <a href={issue.url} target="_blank">
                  {issue.title}
                </a>
                {issue.labels?.map((label, i) => (
                  <Chip key={i} disabled={false}>
                    {label}
                  </Chip>
                ))}
                <Button onClick={() => submitTask(issue)}>Add Task</Button>
              </Card>
            ))}
          </Fragment>
        ))}
        <div>
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </button>
        </div>
        <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        {successMessage || errorMessage}
      </Snackbar>
    </Container>
  );
};
