import { Box, Button, Chip, Container, Input, Card,Typography } from "@mui/joy";
import { Pagination } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import apiClient from "../apis/client";
import { useState } from "react";


interface Repo {
  id: number;
  github_id: number;
  owner: string;
  name: string;
  description: string;
  openIssues: number;
  stars: number;
}



export const Component = function Explore(): JSX.Element {

  const [searchTerm, setSearchTerm] = useState('');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Assuming you know total pages, adjust as needed


  const languages = [
    "Java",
    "JavaScript",
    "Python",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Go",
  ];

  const fetchRepos = async (lang: string, searchTerm: string): Promise<Repo[]> => {
    var _params = {}
    if (lang !==""){
      _params = {
        lang: lang,
      }
    } else {
      _params = {
        q: searchTerm,
      }
    }
    const repos = await apiClient.get("/github/repo/search", {
      params: _params,
    });
    return repos.data;
    
  };

  const handleSearch = async () => {
    try {
      const fetchedRepos = await fetchRepos(selectedLanguage, searchTerm, currentPage);
      setRepos(fetchedRepos);
      // Optionally, set total pages based on response if available
    } catch (error) {
      console.error("Error fetching repos:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch(); // Fetch new page of repos
  };

    


  return (
    <Container
      sx={{
        py: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "center", width: "100%", py: 2 }}
      >
        <Input
          sx={{ "--Input-decoratorChildHeight": "45px", width: "80%" }}
          type="text"
          placeholder="Search repositories..."
          endDecorator={
            <Button
              variant="solid"
              color="primary"
              type="submit"
              onClick={handleSearch}
              sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              Search
            </Button>
          }
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
          py: 2,
          width: "100%",
        }}
      >
        {languages.map((language, index) => (
          <Chip key={index} disabled={false} onClick={function () {}} size="lg">
            {language}
          </Chip>
        ))}
      </Box>

      <Box sx={{ width: '100%', py: 2 }}>
        {repos.map((repo) => (
          <Card key={repo.id} sx={{ mb: 2, p: 2 }}>
            <Typography >{repo.name}</Typography>
            <Typography>{repo.description}</Typography>
            {/* Add more repository details here */}
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ mt: 2 }}
      />
    </Container>
  );
};
