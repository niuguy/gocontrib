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
import { useQuery } from "@tanstack/react-query";

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
  const fetchFollowings = async (): Promise<Repo[]> => {
    const _repos = await apiClient.get("/repos");
    //map to the tasks object
    console.log(_repos.data);
    return _repos.data;
  };

  const {
    data: followings,
    isLoading,
    error,
  } = useQuery({ queryKey: ["following"], queryFn: fetchFollowings });

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
          "--ListItemDecorator-size": "32px",
        }}
      >
        {followings?.map((repo) => (
          <ListItem key={repo.id}>
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
                {repo.owner}/{repo.name} ({repo.open_issues})
                </a>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </ListItem>
  );
}
