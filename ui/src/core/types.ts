export interface Issue {
    github_id: number; // int64 in Go
    repoID: number; // uint in Go
    url: string;
    title: string;
    language: string;
    commentsCount: number; // int in Go
    isAssigned: boolean;
    labels: string[];
    isGoodFirst: boolean;
    isHelpWanted: boolean;
    gitHubCreatedAt: string; // ISO 8601 date string, equivalent to time.Time
    status: "open" | "closed"; // Specific string values
}

export interface Repository {
  github_id: number;
  owner: string;
  name: string;
  description: string;
  stars: number;
  open_issues: number;
  help_wanted_issues: number;
  language: string;
  starred: boolean;
}


  