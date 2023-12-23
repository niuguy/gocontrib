import React, { useState, useEffect, useRef } from "react";
import { Box, Chip, Typography, Button } from "@mui/joy";
import { models } from "../../wailsjs/go/models";
import { GetIssuesRemoteWithPagination } from "../../wailsjs/go/main/App";
import InfiniteScroll from "react-infinite-scroll-component";
import IssueCard from "./IssueCard";

interface SlidingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  repoName: string;
  repoOwner: string;
}

const SlidingPanel: React.FC<SlidingPanelProps> = ({
  isOpen,
  onClose,
  repoName,
  repoOwner,
}) => {
  if (!isOpen) return null; // If the panel is not open, don't render anything

  const [issues, setIssues] = useState<models.Issue[]>([]);
  const [currentLabel, setCurrentLabel] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(0);
  const numPerPage = 30;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setOverflow = (overflow: string) => {
    const body = document.body;
    body.style.overflow = overflow;
  };

  //disable outside scrolling when panel is open
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on main page when panel is open
      setOverflow("hidden");
    } else {
      // Re-enable scrolling on main page when panel is closed
      setOverflow("");
    }

    return () => {
      // Re-enable scrolling when the component is unmounted
      setOverflow("");
    };
  }, [isOpen]);

  const panelRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
      onClose();
      setOverflow("");
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
      setOverflow("");
    }
  };

  useEffect(() => {
    // Attach click listener
    document.addEventListener("mousedown", handleClickOutside);

    // Attach keydown listener
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Remove listeners on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const loadMore = () => {
    if (isLoading) return; // Prevent multiple simultaneous requests

    setIsLoading(true); // Set loading state to true

    const nextPage = currentPage + 1;
    GetIssuesRemoteWithPagination(
      repoOwner,
      repoName,
      [currentLabel],
      nextPage,
      numPerPage
    ).then((newIssues) => {
      console.log("got New issues, length: ", newIssues.length);
      setIssues((prevIssues) => [...prevIssues, ...newIssues]);
      setCurrentPage(nextPage);
      setIsLoading(false); // Set loading state back to false
    });
  };

  // default data
  useEffect(() => {
    if (!isOpen || !repoName || !repoOwner) return; // Check if the panel is open
    loadMore();
  }, [isOpen, repoName, repoOwner]);

  const LABELS = ["good first issue", "help wanted"];

  const handleLabelClick = (label: string) => {
    setCurrentLabel(label);
    GetIssuesRemoteWithPagination(repoOwner, repoName, [label], 1, 30).then(
      (newIssues) => {
        setIssues(newIssues);
        setCurrentPage(1);
      }
    );
  };

  return (
    <Box
      ref={panelRef}
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "40%", // Panel takes up half the width
        height: "100%", // Full height of the viewport
        backgroundColor: "white",
        boxShadow: "-2px 0px 5px rgba(0,0,0,0.2)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.5s ease",
        zIndex: 10,
        overflow: "auto", // Enable scrolling within the panel,
        padding: 2,
        gap: 2,
      }}
    >
      <Typography>
        Open Issues for {repoOwner}/{repoName}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, margin: "20px" }}>
        {LABELS.map((label, index) => (
          <Chip
            variant="outlined"
            color="primary"
            size="lg"
            key={index}
            onClick={() => handleLabelClick(label)}
          >
            {label}
          </Chip>
        ))}
      </Box>
      <InfiniteScroll
        dataLength={issues.length}
        next={loadMore}
        hasMore={true}
        loader={
          isLoading ? ( // Display loading indicator based on isLoading state
            <Box sx={{ textAlign: "center", py: 2 }} key={0}>
              Loading...
            </Box>
          ) : null
        }
      >
        {issues &&
          issues.map(
            (issue, index) =>
              issue && (
                <Box sx={{ margin: "10px" }}>
                  <IssueCard
                    key={index}
                    issue={issue}
                    repoOwner={repoOwner}
                    repoName={repoName}
                  />
                </Box>
              )
          )}
      </InfiniteScroll>

      {/* Load More Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button variant="outlined" onClick={loadMore}>
          Load More
        </Button>
      </Box>
    </Box>
  );
};

export default SlidingPanel;
