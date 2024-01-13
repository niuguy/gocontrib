import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Input,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import apiClient from "../apis/client";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedLanguage, _setSelectedLanguage] = useState("");
  const [currentPage, _setCurrentPage] = useState(1);
  const [_totalPages, _setTotalPages] = useState(1); // Assuming you know total pages, adjust as needed

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

  const fetchRepos = async (
    lang: string,
    searchTerm: string,
    currentPage: number
  ): Promise<Repo[]> => {
    const _params: { [key: string]: any } = {};

    if (lang) {
      _params.lang = lang;
    }
    if (searchTerm) {
      _params.q = searchTerm;
    }
    if (currentPage) {
      _params.page = currentPage;
    }
    _params.count = 10;

    const repos = await apiClient.get("/github/repo/search", {
      params: _params,
    });
    return repos.data;
  };

  const handleSearch = async () => {
    try {
      const fetchedRepos = await fetchRepos(
        "",
        searchTerm,
        currentPage
      );
      setRepos(fetchedRepos);
      // Optionally, set total pages based on response if available
    } catch (error) {
      console.error("Error fetching repos:", error);
    }
  };

  const handleLanguageChange = (language: string) => {
    _setSelectedLanguage(language);
    fetchRepos(language, "", currentPage).then((res) => {
      setRepos(res);
    });
  }

  // const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {

  //   setCurrentPage(page);
  //   handleSearch(); // Fetch new page of repos
  // };

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
          sx={{ "--Input-decoratorChildHeight": "45px", width: "60%" }}
          type="text"
          placeholder="Search repositories..."
          value={searchTerm} // Bind the input to the searchTerm state
          onChange={(e) => setSearchTerm(e.target.value)} // Update the state on input change
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
        {languages.map((language, _) => (
          <Chip
          key={language}
          disabled={false}
          onClick={() => handleLanguageChange(language)}
          size="lg"
          variant={selectedLanguage === language ? "solid" : "outlined"}
        >
          {language}
        </Chip>
        ))}
      </Box>

      <Box sx={{ width: "100%", py: 2 }}>
        {repos.map((repo) => (
          <Card key={repo.id} sx={{ mb: 2, p: 2 }}>
            <Typography>{repo.name}</Typography>
            <Typography>{repo.description}</Typography>
            {/* Add more repository details here */}
          </Card>
        ))}
      </Box>
    </Container>
  );
};
