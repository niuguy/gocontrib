import {
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
import { Link, useMatch } from "react-router-dom";

export function NavItem(props: NavItemProps): JSX.Element {
  return (
    <ListItem>
      <ListItemButton
        component={Link}
        selected={!!useMatch(props.path)}
        to={props.path}
        aria-current="page"
      >
        <ListItemDecorator children={props.icon} />
        <ListItemContent>{props.label}</ListItemContent>
      </ListItemButton>
    </ListItem>
  );
}

export type NavItemProps = {
  path: string;
  label: string;
  icon: JSX.Element;
};
