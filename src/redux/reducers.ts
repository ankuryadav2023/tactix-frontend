import { PayloadAction } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { playerType } from "../types";

export const socketReducer = (state: any = null, action: PayloadAction<any>) => {
    switch (action.type) {
        case 'INITIALIZE_SOCKET':
            return io('https://tactix-backend.onrender.com')
        default:
            return state;
    }
}

export const userReducer = (state: any = null, action: PayloadAction<any>) => {
    switch (action.type) {
        case 'CREATE_USER':
            return action.payload
        default:
            return state;
    }
}

export const matchesReducer = (state: playerType[] = [], action: PayloadAction<any>) => {
    switch (action.type) {
        case 'UPDATE_MATCHES':
            return action.payload
        case 'UPDATE_PLAYERS_TURNS':
            return state.map((player: any) => {
                return { ...player, 'userturn': !(player.userturn) }
            })
        default:
            return state;
    }
}

export const isGameActiveReducer = (state: boolean = false, action: PayloadAction<any>) => {
    switch (action.type) {
        case 'UPDATE_GAME_ACTIVE_STATUS_TRUE':
            return true;
        case 'UPDATE_GAME_ACTIVE_STATUS_FALSE':
            return false;
        default:
            return state;
    }
}