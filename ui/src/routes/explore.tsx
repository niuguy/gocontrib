import { Box, Button, Chip, Container, Input, Typography } from "@mui/joy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


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
  const [selectedLanguage, _setSelectedLanguage] = useState("");
  const navigate = useNavigate();

  const languages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "C++",
    "C",
    "C#",
    "Java",
    "PHP",
    "Ruby",
    "Go",
    ".NET",
    "SQL",
    "Scratch",
    "Rust",
    "Fortran",
    "Kotlin",
    "Swift",
    "Ruby",
    "Cobol",
  ];

  const handleSearch = async () => {
    navigate(`/repos?q=${searchTerm}`);
  };

  const handleLanguageChange = (language: string) => {
    navigate(`/repos?lang=${language}`);
  };

  return (
    <Container
      sx={{
        py: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60%",
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


      <Typography
        sx={{ 
          my: 3 }} 
        level="h4"
      >
        Top Repositories by Language:
      </Typography>

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
    </Container>
  );
};
