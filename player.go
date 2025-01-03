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

func handleClientUpgradeBought(player *Player, rawMessage []byte) {
	fmt.Println(string(rawMessage))
	type ClientUpgradeBoughtMessage struct {
		Type         ClientMessageType `json:"type"`
		NewDamage    int               `json:"NewDamage"`
		UpgradePrice int               `json:"UpgradePrice"`
	}
	var newDamageMessage ClientUpgradeBoughtMessage

	err := json.Unmarshal(rawMessage, &newDamageMessage)
	if err != nil {
		panic(err)
	}
	if player.Money > newDamageMessage.UpgradePrice {
		player.Damage += newDamageMessage.NewDamage
		player.Money -= newDamageMessage.UpgradePrice
		notifyUserBalance(player, player.Money)
		fmt.Printf("Banii utilizatorului sunt:%d , iar pretul este %d", player.Money, newDamageMessage.UpgradePrice)
	}
}
