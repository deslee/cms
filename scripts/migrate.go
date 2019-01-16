package main

import (
	"github.com/deslee/cms/data"
	_ "github.com/mattn/go-sqlite3"
	"github.com/jmoiron/sqlx"
)

func main() {
	db, err := sqlx.Open("sqlite3", "./db/database.sqlite?_loc=auto")
	if err != nil {
		panic(err)
	}

	data.CreateTablesAndIndicesIfNotExist(db)
}
