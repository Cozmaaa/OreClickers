package main

import (
	"encoding/json"
	"fmt"
	"math/rand"

	"github.com/gorilla/websocket"
)

type Block struct {
	name   string
	id     int
	health int
}

var directions = [4][2]int{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}

func parseMatrixUpdate(rawMessage []byte) [2]int {
	type MatrixUpdate struct {
		Type            ClientMessageType `json:"type"`
		UpdatedPosition [2]int            `json:"UpdatedPosition"`
	}

	var msgUpdatedMatrixPosition MatrixUpdate

	err := json.Unmarshal(rawMessage, &msgUpdatedMatrixPosition)
	if err != nil {
		fmt.Println("Erorare unmarshal msgUpdatedMatrixPosition")
		panic(err)
	}
	return msgUpdatedMatrixPosition.UpdatedPosition
}

func updateServerMatrixAfterUpdate(modifiedIndeces []int, server *Server) {
	for _, direction := range directions {
		if (modifiedIndeces[0]+direction[0] < len(server.GameMatrix) && modifiedIndeces[0]+direction[0] >= 0) &&
			(modifiedIndeces[1]+direction[1] < len(server.GameMatrix[modifiedIndeces[0]]) && modifiedIndeces[1]+direction[1] >= 0) {

			if modifiedIndeces[0] == 0 || server.GameObjectMatrix[modifiedIndeces[0]+direction[0]][modifiedIndeces[1]+direction[1]].id == -1 {
				currentBlock := &server.GameObjectMatrix[modifiedIndeces[0]][modifiedIndeces[1]]
				currentBlock.health--

				if currentBlock.health == 0 {
					currentBlock.id = -1
					currentBlock.name = "Empty"
					currentBlock.health = -1
					server.GameMatrix[modifiedIndeces[0]][modifiedIndeces[1]] = -1
				}
				break
			}
		}
	}
}

func initializeAndGenerateMatrices(server *Server) {
	server.GameMatrix = make([][]int, 25)
	server.GameObjectMatrix = make([][]Block, 25)
	for i := 0; i < len(server.GameMatrix); i++ {
		server.GameMatrix[i] = make([]int, 25)
		server.GameObjectMatrix[i] = make([]Block, 25)
		for j := 0; j < len(server.GameMatrix[i]); j++ {
			server.GameMatrix[i][j] = rand.Intn(3)
			block, err := generateObjectGameMatrix(server.GameMatrix[i][j])
			if err != nil {
				fmt.Println("Eroare in timp ce generez matricile")
				panic(err)
			}
			server.GameObjectMatrix[i][j] = block
		}
	}
}

func generateObjectGameMatrix(blockType int) (Block, error) {
	switch blockType {
	case 0:
		return Block{id: 0, name: "Grass", health: 1}, nil
	case 1:
		return Block{id: 1, name: "Diamond", health: 5}, nil
	case 2:
		return Block{id: 2, name: "Stone", health: 3}, nil
	}
	return Block{}, fmt.Errorf("Error while making a bloc %d", blockType)
}

func (s *Server) broadcastServerGameMatrix() {
	fmt.Println("Am trimis matricea la user")
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
