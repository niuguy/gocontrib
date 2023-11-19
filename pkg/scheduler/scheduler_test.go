package scheduler

import "testing"

func Test_updateTopRepoGoodFirstIssues(t *testing.T) {
	tests := []struct {
		name string
	}{
		// TODO: Add test cases.
		{
			name: "Test updateTopRepoGoodFirstIssues",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			updateTopRepoGoodFirstIssues()
		})
	}
}
