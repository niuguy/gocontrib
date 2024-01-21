import {
  Box,
  Button,
  Card,
  Container,
  Snackbar,
  Typography,
  Chip,
  IconButton,
} from "@mui/joy";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";

import apiClient from "../apis/client";

import { Issue } from "../core/types";
import { useAtom } from "jotai";
import { refreshCounterAtom } from "../core/store";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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
  console.log("repo_name", repo_name, "repo_owner", repo_owner);
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
    getNextPageParam: (pages) => {
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
        issue_id: issue.github_id,
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
    <Container sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography level="h2" gutterBottom sx={{ mr: 2 }}>
          {repo_owner}/{repo_name}
        </Typography>
        <IconButton
          onClick={handleFollowClick}
          disabled={isLoading}
          sx={{ color: isFollowing ? "error" : "inherit" }}
        >
          {isFollowing ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Chip
          key="helpwanted"
          disabled={false}
          size="lg"
          sx={{
            backgroundColor: "secondary.light",
            color: "green",
            ":hover": { backgroundColor: "secondary.dark" },
            marginRight: "10px",
          }}
          slotProps={{
            action: {
              component: "a",
              href: `/issues/${repo_owner}/${repo_name}?label=help%20wanted`,
            },
          }}
        >
          Help Wanted
        </Chip>

        <Chip
          key="helpwanted"
          disabled={false}
          size="lg"
          sx={{
            backgroundColor: "secondary.light",
            color: "chocolate",
            ":hover": { backgroundColor: "secondary.dark" },
          }}
          slotProps={{
            action: {
              component: "a",
              href: `/issues/${repo_owner}/${repo_name}?label=good%20first%20issue`,
            },
          }}
        >
          Good First Issue
        </Chip>
      </Box>

      <Box sx={{ width: "100%", py: 2, overflowY: "auto" }}>
        {issues?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.map((issue: Issue) => (
              <Card key={issue.github_id} sx={{ mb: 2, p: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 0, mb: 1 }}
                >
                  <a
                    href={issue.url}
                    target="_blank"
                  >
                    {issue.title}
                    <OpenInNewIcon fontSize="small" />
                  </a>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {issue.labels?.map((label, i) => (
                      <Chip key={i} disabled={false}>
                        {label}
                      </Chip>
                    ))}
                  </Box>
                  <Button onClick={() => submitTask(issue)}>Add Task</Button>
                </Box>
              </Card>
            ))}
          </Fragment>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </Button>
        </Box>
        <Box sx={{ textAlign: "center", mt: 1 }}>
          {isFetching && !isFetchingNextPage ? "Fetching..." : null}
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {successMessage || errorMessage}
      </Snackbar>
    </Container>
  );
};
