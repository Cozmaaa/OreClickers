package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

type Server struct {
	Players          map[*Player]bool `json:"-"`
	GameObjectMatrix [][]Block        `json:"-"`
	GameMatrix       [][]int          `json:"gameMatrix"`
	NextId           int              `json:"-"`
}

type Player struct {
	Conn           *websocket.Conn `json:"-"`
	ID             int             `json:"id"`
	CursorPosition [2]int          `json:"CursorPosition"`
	Money          int             `json:"money"`
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
		Players:          make(map[*Player]bool),
		NextId:           1,
		GameObjectMatrix: [][]Block{},
		GameMatrix:       [][]int{},
	}
}

func newPlayer(websocket *websocket.Conn, id int) *Player {
	return &Player{
		Conn:           websocket,
		ID:             id,
		CursorPosition: [2]int{0, 0},
		Money:          0,
	}
}

func (s *Server) handleWs(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	player := newPlayer(conn, s.NextId)
	s.NextId++
	s.Players[player] = true

	go s.broadcastServerGameMatrix()
	defer func() {
		delete(s.Players, player)
		conn.Close()
		fmt.Println("Connection with a user ennded")
	}()

	if err != nil {
		fmt.Println("Player left here")
		return
	}

	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				fmt.Println("Player disconnected:", err)
			} else {
				fmt.Println("Error reading message:", err)
			}
			break
		}

		handleClientMessages(p, player, s)
		// fmt.Println("Am primit un call cu ", string(p))
	}
}

func main() {
	fmt.Println("Hello , world!")
	static := http.Dir("./web/dist/")
	server := newServer()
	initializeAndGenerateMatrices(server, 50)

	http.Handle("/", http.FileServer(static))
	http.HandleFunc("/ws", server.handleWs)

	http.ListenAndServe("127.0.0.1:8080", nil)
}
