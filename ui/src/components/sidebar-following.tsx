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

export function Following(): JSX.Element {
  return (
    <ListItem nested sx={{ mt: 2 }}>
      <ListSubheader sx={{ letterSpacing: "2px", fontWeight: "800" }}>
        Following
      </ListSubheader>
      <List
        aria-labelledby="nav-list-tags"
        size="sm"
        sx={{
          "--ListItemDecorator-size": "32px",
        }}
      >
        <ListItem>
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
            <ListItemContent>Personal</ListItemContent>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemDecorator>
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "99px",
                  bgcolor: "danger.500",
                }}
              />
            </ListItemDecorator>
            <ListItemContent>Work</ListItemContent>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemDecorator>
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "99px",
                  bgcolor: "warning.400",
                }}
              />
            </ListItemDecorator>
            <ListItemContent>Travels</ListItemContent>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemDecorator>
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "99px",
                  bgcolor: "success.400",
                }}
              />
            </ListItemDecorator>
            <ListItemContent>Concert tickets</ListItemContent>
          </ListItemButton>
        </ListItem>
      </List>
    </ListItem>
  );
}
