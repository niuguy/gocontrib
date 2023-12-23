import React from "react";
import Typography from "@mui/joy/Typography";
import { Box, Chip, Card, Button, Accordion } from "@mui/joy";
import { AddTask } from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";
import AccordionSummary from "@mui/joy/AccordionSummary";
import AccordionDetails from "@mui/joy/AccordionDetails";

const IssueCard: React.FC<{
  issue: models.Issue;
  repoOwner: string;
  repoName: string;
}> = ({ issue, repoName, repoOwner }) => {
  const handleAddTaskClick = () => {
    // Create a new Task instance and pass it to addTask
    const newTask = new models.Task({
      issue_id: issue.github_id, // You can modify this as needed
      issue_title: issue.title,
      issue_repo_owner: repoOwner,
      issue_repo_name: repoName,
      issue_url: issue.url,
      status: "TODO", // Set the default status or modify as needed
      note: "", // Set the default note or modify as needed
    });
    AddTask(newTask);
  };
  //trim the labels string and split it into an array
  const labels = issue.labels.trim().split(",");

  return (
    <Card>
      <Typography level="h4">
        <Accordion>
          <AccordionSummary>{issue.title}</AccordionSummary>
          <AccordionDetails><a href={issue.url}>{issue.url}</a></AccordionDetails>
        </Accordion>
      </Typography>
      <Typography>{new Date(issue.github_created_at).toLocaleString()}</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {labels.map((label) => label && <Chip key={label}>{label}</Chip>)}
        {/* Add more details as needed */}
      </Box>
      <Button color="primary" onClick={handleAddTaskClick}>
        Add Task
      </Button>
    </Card>
  );
};

export default IssueCard;
