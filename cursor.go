package main

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

func parseCursorPosition(message []byte) [2]int {
	var cursorPositionMessage Message
	json.Unmarshal(message, &cursorPositionMessage)
	return [2]int{cursorPositionMessage.CursorPosition[0], cursorPositionMessage.CursorPosition[1]}
}

func (s *Server) broadcastCursorPosition(player *Player) {
	var playerCursorMessage Message
	playerCursorMessage.CursorPosition = player.CursorPosition
	playerCursorMessage.Type = ServerCursorPosition
	playerCursorMessage.Username = player.Username

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
