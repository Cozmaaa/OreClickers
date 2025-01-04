package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

type GlobalServer struct {
	Connections map[*Player]bool
	Servers     []Server
	NextId      int `json:"-"`
}

type Server struct {
	Players          map[*Player]bool `json:"-"`
	GameObjectMatrix [][]Block        `json:"-"`
	GameMatrix       [][]int          `json:"gameMatrix"`
}

type Player struct {
	Conn           *websocket.Conn `json:"-"`
	Username       string          `json:"username"`
	ID             int             `json:"id"`
	CursorPosition [2]int          `json:"CursorPosition"`
	Money          int             `json:"money"`
	Damage         int             `json:"damage"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func newGlobalServer() *GlobalServer {
	return &GlobalServer{
		Connections: make(map[*Player]bool),
		Servers:     []Server{},
	}
}

func newServer() *Server {
	return &Server{
		Players:          make(map[*Player]bool),
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
		Damage:         1,
	}
}

func (gs *GlobalServer) handleWs(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	player := newPlayer(conn, gs.NextId)
	gs.NextId++
	gs.Connections[player] = true

	// go s.broadcastServerGameMatrix()
	defer func() {
		delete(gs.Connections, player)
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

		// handleClientMessages(p, player, s)
		// fmt.Println("Am primit un call cu ", string(p))
	}
}

func main() {
	fmt.Println("Hello , world!")
	static := http.Dir("./web/dist/")
	server := newGlobalServer()
	// initializeAndGenerateMatrices(server, 50)

	http.Handle("/", http.FileServer(static))
	http.HandleFunc("/ws", server.handleWs)

	http.ListenAndServe("127.0.0.1:8080", nil)
}
