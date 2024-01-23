/**
 * The repos you are following with contribution in mind.
 */
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  ListSubheader,
} from "@mui/joy";
import apiClient from "../apis/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { refreshCounterAtom } from "../core/store";
import { useEffect } from "react";

interface Repo {
  id: number;
  github_id: number;
  owner: string;
  name: string;
  description: string;
  open_issues: number;
  stars: number;
}

export function Following(): JSX.Element {
  const queryClient = useQueryClient();

  const [refreshCounter] = useAtom(refreshCounterAtom);

  const fetchFollowings = async (): Promise<Repo[]> => {
    const _repos = await apiClient.get("/repos");
    return _repos.data;
  };

  const {
    data: followings,
    isLoading,
    error,
  } = useQuery({ queryKey: ["following"], queryFn: fetchFollowings });

  useEffect(() => {
    // Refetch the data when the refreshCounter changes
    queryClient.refetchQueries();
  }, [refreshCounter, queryClient]);

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <></>;
  }

  return (
    <ListItem nested sx={{ mt: 2 }}>
      <ListSubheader sx={{ letterSpacing: "px", fontWeight: "800" }}>
        Favourite Repos
      </ListSubheader>
      <List
        aria-labelledby="nav-list-tags"
        size="sm"
        sx={{
          "--ListItemDecorator-size": "40px",
          height: "600px",
          overflowY: "auto",
        }}
      >
        {followings?.map((repo) => (
          <ListItem key={repo.github_id}>
            <ListItemButton>
              <ListItemDecorator>
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "99px",
                    bgcolor: "primary.500",
                  }}
                />
              </ListItemDecorator>
              <ListItemContent>
                <a href={`/issues/${repo.owner}/${repo.name}`}>
                  {repo.owner}/{repo.name}
                </a>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </ListItem>
  );
}
