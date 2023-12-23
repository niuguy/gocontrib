import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Input,
  Link as MuiLink,
  Typography
} from "@mui/joy";
import { useEffect, useState } from "react";

import InfiniteScroll from 'react-infinite-scroll-component';
import {
  GetLanguages,
  GetReposByLanguage,
  GetReposByName,
} from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";
import SlidingPanel from "../components/IssuesSlidingPanel";

// Import other needed components...

interface Repository {
  id: number;
  github_id: number;
  owner: string;
  name: string;
  description: string;
  openIssues: number;
  stars: number;
  // Add other fields as needed...
}

export default function Repos() {
  const reposPerPage = 30;
  const [isAll, setIsAll] = useState<boolean>(true);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>(""); // Initialize with your current search term
  const [currentLanguage, setCurrentLanguage] = useState<string>(""); // Initialize with your current language

  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [panRepoName, setPanRepoName] = useState<string>("");
  const [panRepoOwner, setPanRepoOwner] = useState<string>("");

  const openPanel = (repoName: string, repoOwner: string) => {
    setIsPanelOpen(true);
    setPanRepoName(repoName);
    setPanRepoOwner(repoOwner);
  };
  const closePanel = () => {
    setIsPanelOpen(false);
  };

  // useeffect to get the first page of repos, will fetch the top 20 repos by open issues count
  useEffect(() => {
    GetLanguages().then((languages: string[]) => {
      // filter out empty strings
      languages = languages.filter((language) => language);
      setLanguages(languages);
    });

    fetchMoreData(0, true);
  }, []);

  const handleSearch = () => {
    // Reset the state when performing a new search
    setRepos([]);
    setCurrentPage(1);
    setIsAll(false);
    setCurrentSearchTerm(inputValue);
    fetchMoreData(1, false, inputValue,"");
  };

  const handleTagClick = (language: string) => {
    // Reset the state when clicking on a tag
    setRepos([]);
    setCurrentPage(1);
    setIsAll(false);
    setCurrentLanguage(language);
    fetchMoreData(1,false, "", language);
  };

  function repoConvert(newRepos: models.Repository[]): Repository[] {
    return newRepos.map((repo) => ({
      id: repo.github_id,
      github_id: repo.github_id,
      owner: repo.owner,
      name: repo.name,
      description: repo.description,
      openIssues: repo.open_issues,
      stars: repo.stars,
    }));
  }

  const fetchMoreData = (
    page: number,
    isAll: boolean = false,
    searchTerm: string = "",
    language: string = ""
  ) => {
    if (isAll){
      GetReposByName("", page, reposPerPage).then(
        (newRepos: models.Repository[]) => {
          const convertedRepos: Repository[] = repoConvert(newRepos);
          setRepos((prevRepos) => [...prevRepos, ...convertedRepos]);
        }
      );
    }
    else if (searchTerm) {
      GetReposByName(searchTerm, page, reposPerPage).then(
        (newRepos: models.Repository[]) => {
          const convertedRepos: Repository[] = repoConvert(newRepos);
          setRepos((prevRepos) => [...prevRepos, ...convertedRepos]);
        }
      );
    } else if (language) {
      GetReposByLanguage(language, page, reposPerPage).then(
        (newRepos: models.Repository[]) => {
          const convertedRepos = repoConvert(newRepos);
          setRepos((prevRepos) => [...prevRepos, ...convertedRepos]);
        }
      );
    }
  };

  const loadMoreFunc = () => {
    console.log("load more");

    const nextPage = currentPage + 1;

    setCurrentPage(nextPage);
    fetchMoreData(nextPage, isAll, currentSearchTerm, currentLanguage);
  };
  return (
    <Box sx={{ 
      p: 3,
      overflow: "auto",
    
    }}>
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 1, // margin-top for spacing between label and input
          }}
        >
          <Input
            placeholder="Explore your starred repos…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            endDecorator={<Button onClick={handleSearch}>Search</Button>}
            sx={{
              "--Input-radius": "9px",
              "--Input-gap": "23px",
              "--Input-focusedThickness": "0px",
              "--Input-paddingInline": "14px",
              "--Input-decoratorChildHeight": "40px",
              flexGrow: 0.8,
              alignItems: "center",
            }}
          />

        </Box>
        {/* Render tags */}
        <Box
          sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: "20px" }}
        >
          {languages.map((language, index) => (
            <Chip key={index} onClick={() => handleTagClick(language)}>
              {language}
            </Chip>
          ))}
        </Box>
      </Box>
      {/* Render repository cards */}
      <Grid container spacing={4}>
        <InfiniteScroll
          dataLength={repos.length}
          next={loadMoreFunc}
          hasMore={true}
          loader={
            <Box sx={{ textAlign: "center", py: 2 }} key={0}>
              Loading...
            </Box>
          }

        >
          {repos.map((repo, index) => (
            <Grid key={index}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderColor: "neutral.outlinedBorder",
                  boxShadow: "md",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography level="h4" sx={{ mb: 1 }}>
                    <MuiLink
                      href={`https://github.com/${repo.owner}/${repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {repo.name}
                    </MuiLink>
                  </Typography>

                  <Typography sx={{ mb: 2 }}>{repo.description}</Typography>
                  <Typography sx={{ display: "block", mb: 2 }}>
                    Stars: {repo.stars}
                  </Typography>
                </CardContent>
                <Box sx={{ mt: "auto", p: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => openPanel(repo.name, repo.owner)}
                  >
                    Open Issues: {repo.openIssues}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </InfiniteScroll>
      </Grid>
      {/* Sliding Panel */}
      <SlidingPanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        repoOwner={panRepoOwner}
        repoName={panRepoName}
      />
    </Box>
  );
}
