export namespace models {
	
	export class Issue {
	    github_id: number;
	    repo_id: number;
	    url: string;
	    title: string;
	    language: string;
	    comments_count: number;
	    is_assigned: boolean;
	    labels: string;
	    is_good_first: boolean;
	    is_help_wanted: boolean;
	    // Go type: time
	    github_created_at: any;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new Issue(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.github_id = source["github_id"];
	        this.repo_id = source["repo_id"];
	        this.url = source["url"];
	        this.title = source["title"];
	        this.language = source["language"];
	        this.comments_count = source["comments_count"];
	        this.is_assigned = source["is_assigned"];
	        this.labels = source["labels"];
	        this.is_good_first = source["is_good_first"];
	        this.is_help_wanted = source["is_help_wanted"];
	        this.github_created_at = this.convertValues(source["github_created_at"], null);
	        this.status = source["status"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Repository {
	    github_id: number;
	    owner: string;
	    name: string;
	    description: string;
	    stars: number;
	    open_issues: number;
	    language: string;
	    starred: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Repository(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.github_id = source["github_id"];
	        this.owner = source["owner"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.stars = source["stars"];
	        this.open_issues = source["open_issues"];
	        this.language = source["language"];
	        this.starred = source["starred"];
	    }
	}
	export class Setting {
	    key: string;
	    val: string;
	
	    static createFrom(source: any = {}) {
	        return new Setting(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.val = source["val"];
	    }
	}
	export class Task {
	    id: number;
	    issue_id: number;
	    issue_title: string;
	    issue_repo_owner: string;
	    issue_repo_name: string;
	    issue_url: string;
	    status: string;
	    note: string;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.issue_id = source["issue_id"];
	        this.issue_title = source["issue_title"];
	        this.issue_repo_owner = source["issue_repo_owner"];
	        this.issue_repo_name = source["issue_repo_name"];
	        this.issue_url = source["issue_url"];
	        this.status = source["status"];
	        this.note = source["note"];
	    }
	}

}

