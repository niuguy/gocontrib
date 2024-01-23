export interface Issue {
    github_id: number; // int64 in Go
    repoID: number; // uint in Go
    url: string;
    title: string;
    language: string;
    commentsCount: number; // int in Go
    isAssigned: boolean;
    labels: string[];
    is_good_first: boolean;
    is_help_wanted: boolean;
    github_created_at: string; // ISO 8601 date string, equivalent to time.Time
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


export interface Task {
  id: number;
  issue_id: number;
  issue_title: string;
  issue_repo_owner: string;
  issue_repo_name: string;
  issue_url: string;
  status: string;
  note: string;
}

  