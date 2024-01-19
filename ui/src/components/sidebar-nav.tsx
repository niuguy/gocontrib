import { List, ListItem } from "@mui/joy";

import ExploreIcon from "@mui/icons-material/Explore";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { NavItem } from "./NavItem";

export function Navigation(): JSX.Element {
  return (
    <ListItem nested>
      <List aria-labelledby="nav-list-browse">
        <NavItem path="/explore" label="Explore" icon={<ExploreIcon />} />
        <NavItem
          path="/tasks"
          label="Tasks"
          icon={<FormatListBulletedIcon />}
        />
        {/* <NavItem path="/prs" label="Report" icon={<AssignmentTurnedInIcon />} /> */}
      </List>
    </ListItem>
  );
}
