package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/websocket"
)

type Server struct {
	Players map[*Player]bool
	NextId  int
}

type Player struct {
	Conn           *websocket.Conn `json:"-"`
	ID             int             `json:"Id"`
	CursorPosition [2]int          `json:"CursorPosition"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func newServer() *Server {
	return &Server{
		Players: make(map[*Player]bool),
		NextId:  1,
	}
}

func newPlayer(websocket *websocket.Conn, id int) *Player {
	return &Player{
		Conn:           websocket,
		ID:             id,
		CursorPosition: [2]int{0, 0},
	}
}

func parseCursorPosition(message []byte) [2]int {
	parts := bytes.Split(message, []byte(" "))
	x, err1 := strconv.Atoi(string(parts[0]))
	y, err2 := strconv.Atoi(string(parts[1]))
	if err1 != nil || err2 != nil {
		panic(err1)
	}
	fmt.Println(x, y)
	return [2]int{x, y}
}

func (s *Server) broadcastCursorPosition(player *Player) {
	playerData, err := json.Marshal(player)
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

func (s *Server) handleWs(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	player := newPlayer(conn, s.NextId)
	s.NextId++
	s.Players[player] = true
	if err != nil {
		panic(err)
	}

	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			panic(err)
		}

		player.CursorPosition = parseCursorPosition(p)
		s.broadcastCursorPosition(player)
	}
}

func main() {
	fmt.Println("Hello , world!")
	static := http.Dir("./web/dist/")
	server := newServer()

	http.Handle("/", http.FileServer(static))
	http.HandleFunc("/ws", server.handleWs)

	http.ListenAndServe("127.0.0.1:8080", nil)
}
