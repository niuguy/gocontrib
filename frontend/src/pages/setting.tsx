import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import React, { useState } from "react";
import { AddOrUpdateSetting, SyncStaredRepos } from "../../wailsjs/go/main/App"; // Adjust the import path as needed

const Settings: React.FC = () => {
  const [githubToken, setGithubToken] = useState<string>("");

  const [syncing, setSyncing] = useState(false);

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGithubToken(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const setting = { key: "github_token", val: githubToken };
      await AddOrUpdateSetting(setting);
      alert("Token updated successfully!");
    } catch (error) {
      console.error("Error updating token:", error);
      alert("Failed to update token.");
    }
  };

  const handleSyncRepo = async () => {
    try {
      setSyncing(true); // Start synchronization, set loading to true

      await SyncStaredRepos();

      alert("Synced successfully!");
    } catch (error) {
      console.error("Error syncing:", error);
      alert("Failed to sync.");
    } finally {
      setSyncing(false); // Synchronization is complete, set loading to false
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      <FormControl required size="sm" color="primary">
        <FormLabel>GitHub Token</FormLabel>
        <Input
          type="password"
          name="githubToken"
          placeholder="Enter your GitHub token"
          autoComplete="on"
          autoFocus
          error={false} // Set to true if there's a validation error
          fullWidth
          value={githubToken}
          onChange={handleTokenChange}
          variant="outlined"
        />
        <FormHelperText>
          Enter your GitHub personal access token.
        </FormHelperText>
      </FormControl>
      <div style={{ marginTop: "20px" }}>
        <Button onClick={handleSubmit} variant="solid">
          Submit
        </Button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Button onClick={handleSyncRepo} variant="solid" disabled={syncing}>
          {syncing ? "Syncing..." : "Sync Repos"}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
