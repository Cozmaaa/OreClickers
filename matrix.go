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

func updateServerMatrixAfterUpdate(modifiedIndeces [2]int, server *Server, player *Player) {
	for _, direction := range directions {
		if (modifiedIndeces[0]+direction[0] < len(server.GameMatrix) && modifiedIndeces[0]+direction[0] >= 0) &&
			(modifiedIndeces[1]+direction[1] < len(server.GameMatrix[modifiedIndeces[0]]) && modifiedIndeces[1]+direction[1] >= 0) {

			if modifiedIndeces[0] == 0 || server.GameObjectMatrix[modifiedIndeces[0]+direction[0]][modifiedIndeces[1]+direction[1]].id == -1 {
				currentBlock := &server.GameObjectMatrix[modifiedIndeces[0]][modifiedIndeces[1]]
				currentBlock.health--

				if currentBlock.health == 0 {
					blockType, err := generateObjectGameMatrix(currentBlock.id)
					if err != nil {
						panic(err)
					}
					player.Money += blockType.health
					notifyUserBalance(player, player.Money)
					fmt.Println(player.Money)

					currentBlock.id = -1
					currentBlock.name = "Empty"
					currentBlock.health = -1
					server.GameMatrix[modifiedIndeces[0]][modifiedIndeces[1]] = -1
					server.broadcastServerGameMatrixUpdate(modifiedIndeces)

				}
				break
			}
		}
	}
}

func initializeAndGenerateMatrices(server *Server, matrixSize int) {
	server.GameMatrix = make([][]int, matrixSize)
	server.GameObjectMatrix = make([][]Block, matrixSize)
	for i := 0; i < len(server.GameMatrix); i++ {
		server.GameMatrix[i] = make([]int, matrixSize)
		server.GameObjectMatrix[i] = make([]Block, matrixSize)
		for j := 0; j < len(server.GameMatrix[i]); j++ {
			// server.GameMatrix[i][j] = rand.Intn(3)
			server.GameMatrix[i][j] = generateGameMapAlgorithm(i, matrixSize)
			block, err := generateObjectGameMatrix(server.GameMatrix[i][j])
			if err != nil {
				fmt.Println("Eroare in timp ce generez matricile")
				panic(err)
			}
			server.GameObjectMatrix[i][j] = block
		}
	}
}

func generateGameMapAlgorithm(i, matrixSize int) int {
	switch {
	case i == 0:
		return 0
	case i <= matrixSize/21:
		return 4
	case i <= matrixSize/10:
		return weightedRandomPicker([]int{50, 50}, []int{2, 4})
	case i <= matrixSize/6:
		return weightedRandomPicker([]int{80, 15, 5}, []int{2, 3, 6})
	case i <= matrixSize/2:
		return weightedRandomPicker([]int{75, 5, 1, 9, 10}, []int{2, 5, 1, 3, 6})
	case i < matrixSize:
		return weightedRandomPicker([]int{70, 20, 10}, []int{2, 1, 5})
	}
	return 1
}

func weightedRandomPicker(weights, blocksId []int) int {
	var cumWeightSum int
	cumulativeWeights := make([]int, len(weights))
	for i, weight := range weights {
		cumWeightSum += weight
		cumulativeWeights[i] = cumWeightSum
	}
	rnd := rand.Intn(cumWeightSum) + 1
	for i, weight := range cumulativeWeights {
		if rnd <= weight {
			return blocksId[i]
		}
	}
	return -1
}

func generateObjectGameMatrix(blockType int) (Block, error) {
	switch blockType {
	case 0:
		return Block{id: 0, name: "Grass", health: 1}, nil
	case 1:
		return Block{id: 1, name: "Diamond", health: 30}, nil
	case 2:
		return Block{id: 2, name: "Stone", health: 3}, nil
	case 3:
		return Block{id: 3, name: "Coal", health: 10}, nil
	case 4:
		return Block{id: 4, name: "Dirt", health: 1}, nil
	case 5:
		return Block{id: 5, name: "Gold", health: 20}, nil
	case 6:
		return Block{id: 6, name: "Iron", health: 15}, nil
	}
	return Block{}, fmt.Errorf("error while making a bloc %d", blockType)
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

func (s *Server) broadcastServerGameMatrixUpdate(updatedPos [2]int) {
	fmt.Println("Am trimis update position de la matrice la user")
	var matrixPositionUpdate MatrixUpdatePositionMessage
	matrixPositionUpdate.Type = ServerGameMatrixUpdate
	matrixPositionUpdate.UpdatedPosition = updatedPos

	jsonMatrixUpdateMessage, err := json.Marshal(matrixPositionUpdate)
	if err != nil {
		fmt.Println("Erroare marshall matrixpositionupdate")
		panic(err)
	}

	for players := range s.Players {
		err := players.Conn.WriteMessage(websocket.TextMessage, jsonMatrixUpdateMessage)
		if err != nil {
			players.Conn.Close()
			panic(err)
		}
	}
}
