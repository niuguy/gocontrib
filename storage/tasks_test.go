package storage

import (
	"testing"

	"github.com/niuguy/gocontrib/models"
	"gorm.io/gorm"
)

func TestStorage_AddTask(t *testing.T) {
	type fields struct {
		DB *gorm.DB
	}
	type args struct {
		task *models.Task
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.

	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Storage{
				DB: tt.fields.DB,
			}
			if err := s.AddTask(tt.args.task); (err != nil) != tt.wantErr {
				t.Errorf("Storage.AddTask() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
