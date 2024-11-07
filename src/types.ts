export type messageType = {
    username: string
    usertype: string
    message: string
}

export type userType = {
    username: string
    usertype: 'player' | 'spectator'
    roomID: string
    usermark?: 'O' | 'X'
    userturn?: boolean
    errortype?: 'general'
}

export type playerType = {
    username: string,
    userSocketID: string,
    usertype: 'player',
    usermark: 'O' | 'X',
    userturn: boolean,
    matchesPlayed: number,
    userscore: number
}

export type gameStatusType = {
    win: boolean
    winner?: 'O' | 'X'
}

export type moveType = {
    playerSocketID: string,
    x: 0 | 1 | 2
    y: 0 | 1 | 2
}