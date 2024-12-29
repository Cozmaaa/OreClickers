package main

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

func notifyUserBalance(player *Player, newBalance int) {
	var playerBalanceNotify playerBalanceNotify
	playerBalanceNotify.Type = ServerBalanceNotify
	playerBalanceNotify.NewBalance = newBalance

	jsonPlayerBalance, err := json.Marshal(playerBalanceNotify)
	if err != nil {
		fmt.Println("Error json balance")
		panic(err)
	}

	err = player.Conn.WriteMessage(websocket.TextMessage, jsonPlayerBalance)
	if err != nil {
		panic(err)
	}
}
