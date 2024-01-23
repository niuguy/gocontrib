import { Box, Button, Card, Container, Snackbar, Typography } from "@mui/joy";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";

import apiClient from "../apis/client";
import { refreshCounterAtom } from "../core/store";
import StarIcon from "@mui/icons-material/Star";

import { Repository } from "../core/types";
import Star from "@mui/icons-material/Star";
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
    _params.count = 20;

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
    getNextPageParam: (pages) => {
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container sx={{ py: 2 }}>
      <Typography level="h2" gutterBottom>
        Repositories
      </Typography>
      <Box sx={{ width: "100%", py: 2, overflowY: "auto" }}>
        {repos?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.map((repo: Repository) => (
              <Card key={repo.github_id} sx={{ p: 2, my: 2 }}>
                <Typography level="h3" gutterBottom>
                  {repo.owner}/{repo.name}{" "}
                  <Typography level="body-md">
                    <StarIcon /> {repo.stars}
                  </Typography>
                </Typography>

                <Typography>{repo.description}</Typography>
                <Typography gutterBottom>
                  <a href={`/issues/${repo.owner}/${repo.name}`}>
                    {" "}
                    Open Issues({repo.open_issues})
                  </a>
                </Typography>
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
      >
        {successMessage || errorMessage}
      </Snackbar>
    </Container>
  );
};
