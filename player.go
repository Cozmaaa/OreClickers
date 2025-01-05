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

func handleClientCreateLobby(player *Player, rawMessage []byte, globalServer *GlobalServer) {
	fmt.Println("AM FACUT LOBBY NOU")
	type ClientCreateLobbyMessage struct {
		Type           ClientMessageType `json:"type"`
		LobbyName      string            `json:"LobbyName"`
		PlayerUsername string            `json:"PlayerUsername"`
	}
	var createLobbyMessage ClientCreateLobbyMessage

	err := json.Unmarshal(rawMessage, &createLobbyMessage)
	if err != nil {
		panic(err)
	}

	newServer := &Server{
		Players:          make(map[*Player]bool),
		NextId:           2,
		GameObjectMatrix: [][]Block{},
		GameMatrix:       [][]int{},
	}
	newServer.Players[player] = true
	newServer.LobbyName = createLobbyMessage.LobbyName
	player.Username = createLobbyMessage.PlayerUsername
	player.ConnectedLobby = newServer

	globalServer.Servers = append(globalServer.Servers, newServer)
	initializeAndGenerateMatrices(newServer, 64)
	newServer.broadcastServerGameMatrix()
}

func handeClientJoinLobby(player *Player, rawMessage []byte, globalServer *GlobalServer) {
	type ClientJoinLobbyMessage struct {
		Type           ClientMessageType `json:"type"`
		LobbyName      string            `json:"LobbyName"`
		PlayerUsername string            `json:"PlayerUsername"`
	}

	var joinLobbyMessage ClientJoinLobbyMessage

	err := json.Unmarshal(rawMessage, &joinLobbyMessage)
	if err != nil {
		panic(err)
	}

	for i, server := range globalServer.Servers {
		if server.LobbyName == joinLobbyMessage.LobbyName {
			player.ConnectedLobby = globalServer.Servers[i]
			globalServer.Servers[i].Players[player] = true
			player.Username = joinLobbyMessage.PlayerUsername
			player.ConnectedLobby.broadcastServerGameMatrix()
			return
		}
	}
	fmt.Println("Server not found")
	delete(globalServer.Connections, player)
	player.Conn.Close()
}
