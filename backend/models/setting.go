package models

import "gorm.io/gorm"

type Setting struct {
	gorm.Model
	Key string `gorm:"primaryKey;column:key" json:"key"`
	Val string `json:"val"`
}
