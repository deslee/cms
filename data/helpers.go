package data

import (
	"github.com/google/uuid"
)

func GenerateId() string {
	newUuid, err := uuid.NewRandom()
	if err != nil {
		panic(err)
	}

	return newUuid.String()
}
