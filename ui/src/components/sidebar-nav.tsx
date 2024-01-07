import { List, ListItem } from "@mui/joy";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DeleteIcon from "@mui/icons-material/Delete";
import ExploreIcon from "@mui/icons-material/Explore";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { NavItem } from "./NavItem";

export function Navigation(): JSX.Element {
  return (
    <ListItem nested>
      {/* <ListSubheader sx={{ letterSpacing: "2px", fontWeight: "800" }}>
        TODO
      </ListSubheader> */}
      <List aria-labelledby="nav-list-browse">
        <NavItem path="/explore" label="Explore" icon={<ExploreIcon />} />
        <NavItem
          path="/tasks"
          label="My Tasks"
          icon={<FormatListBulletedIcon />}
        />
        <NavItem path="/prs" label="My PRs" icon={<AssignmentTurnedInIcon />} />
        <NavItem path="/trashed" label="Trashed" icon={<DeleteIcon />} />
      </List>
    </ListItem>
  );
}
