package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/gorilla/websocket"
)

func parseCursorPosition(message []byte) [2]int {
	parts := bytes.Split(message, []byte(" "))
	x, err1 := strconv.Atoi(string(parts[0]))
	y, err2 := strconv.Atoi(string(parts[1]))
	if err1 != nil || err2 != nil {
		panic(err1)
	}
	return [2]int{x, y}
}

func (s *Server) broadcastCursorPosition(player *Player) {
	var playerCursorMessage Message
	playerCursorMessage.CursorPosition = player.CursorPosition
	playerCursorMessage.Type = ServerCursorPosition
	playerCursorMessage.Id = player.ID

	playerData, err := json.Marshal(playerCursorMessage)
	if err != nil {
		fmt.Println("ERROR MARSHAL DATA")
		return
	}

	for otherPlayers := range s.Players {
		if otherPlayers == player {
			continue
		}
		err := otherPlayers.Conn.WriteMessage(websocket.TextMessage, playerData)
		if err != nil {
			fmt.Println("ERROR SENDING DATA MARSHALL")
			otherPlayers.Conn.Close()
			return
		}
	}
}
