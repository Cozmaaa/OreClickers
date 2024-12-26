package main

import (
	"encoding/json"
	"fmt"
)

type ServerMessageType int

const (
	ServerCursorPosition   ServerMessageType = 1
	ServerGameMatrix       ServerMessageType = 2
	ServerGameMatrixUpdate ServerMessageType = 3
)

type Message struct {
	Type           ServerMessageType `json:"type"`
	Id             int               `json:"id"`
	CursorPosition [2]int            `json:"CursorPosition"`
}

type MatrixMessage struct {
	Matrix [][]int           `json:"gameMatrix"`
	Type   ServerMessageType `json:"type"`
}

type MatrixUpdatePositionMessage struct {
	UpdatedPosition [2]int            `json:"updatedMatrixPosition"`
	Type            ServerMessageType `json:"type"`
}

type BaseMessageType struct {
	Type ServerMessageType `json:"type"`
}

func handleMessages(rawMessage []byte, player *Player, server *Server) {
	var baseMessage BaseMessageType

	err := json.Unmarshal(rawMessage, &baseMessage)
	if err != nil {
		fmt.Println("Error partial Unmarshal")
		panic(err)
	}
	/*
	   switch baseMessage.Type {
	   case ServerCursorPosition:

	   	player.CursorPosition = parseCursorPosition(rawMessage)

	   case ServerGameMatrix:

	   	fmt.Println("Am primit call cu matrice de la client")
	   	// TODO: CRED CA E GRESIT AICI , AR TREBUI SA FIE CHESTII LEGATE DE CLIENT DAR SUNT SERVER FOR SOME REASON (VERIFICA LOGICA)

	   case ServerGameMatrixUpdate:

	   	fmt.Println("Am primit call cu update la matrice")
	   	updatedPos := parseMatrixUpdate(rawMessage)
	   	updateServerMatrixAfterUpdate(updatedPos[:], server)
	   	server.broadcastServerGameMatrix()

	   }
	*/
}
