import { Box, Button, Card, Container, Snackbar, Typography } from "@mui/joy";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import {  useLocation } from "react-router-dom";
import { useAtom } from "jotai";

import apiClient from "../apis/client";
import { refreshCounterAtom } from "../core/store";

interface Repository {
  github_id: number;
  owner: string;
  name: string;
  description: string;
  stars: number;
  open_issues: number;
  help_wanted_issues: number;
  language: string;
  starred: boolean;
}
export const Component = function Repos(): JSX.Element {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [refreshCounter, setRefreshCounter] = useAtom(refreshCounterAtom);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const language = queryParams.get("lang");
  const searchTerm = queryParams.get("q");

  const fetchRepos = async ({ pageParam = 1 }): Promise<Repository[]> => {
    const _params: { [key: string]: any } = {
      page: pageParam,
    };

    if (language) {
      _params.lang = language;
    }
    if (searchTerm) {
      _params.q = searchTerm;
    }
    _params.count = 10;

    const repos = await apiClient.get("/github/repo/search", {
      params: _params,
    });
    console.log(repos.data);
    return repos.data.Items;
  };

  const {
    data: repos,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["repos"],
    queryFn: fetchRepos,
    getNextPageParam: (lastPage, pages) => {
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const doFollow = async (repo: Repository) => {
    try {
      await apiClient.post("/repo", {
        github_id: repo.github_id,
        owner: repo.owner,
        name: repo.name,
        description: repo.description,
        stars: repo.stars,
        open_issues: repo.open_issues,
        help_wanted_issues: repo.help_wanted_issues,
        language: repo.language,
        starred: repo.starred,
      });

      setRefreshCounter(refreshCounter + 1);
      
      setSuccessMessage(" Submitted successfully!");
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
        Repos of search for '{searchTerm}' {language}
      </Typography>
      <Box sx={{ width: "100%", py: 2, overflowY: "auto" }}>
        {repos?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.map((repo: Repository) => (
              <Card key={repo.github_id} sx={{ p: 2, my: 2 }}>
                <Typography level="h3" gutterBottom>
                  {repo.owner}/{repo.name}
                </Typography>
                <Typography gutterBottom>{repo.description}</Typography>
                <Typography gutterBottom><a href={`/issues/${repo.owner}/${repo.name}`}>issues</a></Typography>
                <Typography gutterBottom>Language: {repo.language}</Typography>
                <Typography gutterBottom>Stars: {repo.stars}</Typography>
                <Typography gutterBottom>
                  Open Issues: {repo.open_issues}
                </Typography>

                <Button onClick={() => doFollow(repo)} sx={{ mt: 2 }}>
                  Follow
                </Button>
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
