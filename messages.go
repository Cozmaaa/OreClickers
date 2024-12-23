package main

type ServerMessageType int

const (
	ServerCursorPosition ServerMessageType = 1
	ServerGameMatrix     ServerMessageType = 2
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
