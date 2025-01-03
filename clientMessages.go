package main

import (
	"encoding/json"
	"fmt"
)

type ClientMessageType int

const (
	ClientCursorPosition   ClientMessageType = 1
	ClientGameMatrix       ClientMessageType = 2
	ClientGameMatrixUpdate ClientMessageType = 3
	ClientUpgradeBought    ClientMessageType = 4
)

type ClientCursorPositionMessage struct {
	Type           ClientMessageType `json:"type"`
	Id             int               `json:"id"`
	CursorPosition [2]int            `json:"CursorPosition"`
}

type ClientMatrixUpdateMessage struct {
	UpdatePosition []int             `json:"UpdatedPosition"`
	Type           ClientMessageType `json:"type"`
}

type BaseClientMessageType struct {
	Type ClientMessageType `json:"type"`
}

func handleClientMessages(rawMessage []byte, player *Player, server *Server) {
	var baseClientMessage BaseClientMessageType

	err := json.Unmarshal(rawMessage, &baseClientMessage)
	if err != nil {
		fmt.Println("Error partial unmarshal client")
		panic(err)
	}

	switch baseClientMessage.Type {
	case ClientCursorPosition:
		player.CursorPosition = parseCursorPosition(rawMessage)
		server.broadcastCursorPosition(player)
	case ClientGameMatrixUpdate:
		fmt.Println("Am primit call cu update la matrice")
		updatedPos := parseMatrixUpdate(rawMessage)
		updateServerMatrixAfterUpdate(updatedPos, server, player)
	case ClientUpgradeBought:
		fmt.Println("Userul a cumparat un upgrade")
		handleClientUpgradeBought(player, rawMessage)
		fmt.Println(player.Damage)
	}
}
