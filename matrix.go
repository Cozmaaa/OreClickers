package main

import (
	"encoding/json"
	"fmt"
	"math/rand"

	"github.com/gorilla/websocket"
)

func generateMatrix() [][]int {
	matrix := make([][]int, 25)
	for i := 0; i < len(matrix); i++ {
		matrix[i] = make([]int, 25)
		for j := 0; j < len(matrix[i]); j++ {
			matrix[i][j] = rand.Intn(3)
		}
	}

	return matrix
}

func (s *Server) broadcastServerGameMatrix() {
	var matrixMessage MatrixMessage
	matrixMessage.Type = ServerGameMatrix
	matrixMessage.Matrix = s.GameMatrix
	jsonMatrixMessage, err := json.Marshal(matrixMessage)
	if err != nil {
		fmt.Println("EROARE SERVER MARSHAL")
		panic(err)
	}

	for players := range s.Players {
		err := players.Conn.WriteMessage(websocket.TextMessage, jsonMatrixMessage)
		if err != nil {
			players.Conn.Close()
			panic(err)
		}
	}
}
