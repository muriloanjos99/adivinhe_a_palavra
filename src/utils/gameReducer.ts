import { TGameAction } from "../types/TGameAction";
import { TInitialReducerState } from "../types/TInitialReducerStateInitialReducerStateType";

export const gameReducer = (
    state: TInitialReducerState,
    action: TGameAction
): TInitialReducerState => {
    switch (action.type) {
        case "FINISH_GAME": {
            const newCurrentGame = {
                ...state.currentGame,
                finished: true,
                success: action.payload,
            };
            return {
                ...state,
                currentGame: newCurrentGame,
                games: [...state.games, newCurrentGame],
            };
        }
        case "LETTER_INPUT": {
            const { lineIndex, newTry } = action.payload;
            return {
                ...state,
                currentGame: {
                    ...state.currentGame,
                    tries: state.currentGame.tries.map((item, index) =>
                        index === lineIndex ? newTry : item
                    ),
                },
            };
        }
        case "NEW_GAME": {
            return {
                ...state,
                currentGame: {
                    finished: false,
                    results: Array.from({ length: 5 }, () => ({
                        correctPosition: [],
                        wrongPosition: [],
                    })),
                    success: false,
                    tries: Array.from({ length: 5 }, () =>
                        Array(action.payload.length).fill("")
                    ),
                    usedChances: 0,
                    word: action.payload,
                },
            };
        }
        case "SUBMIT_RESULT": {
            const { lineIndex, newResult } = action.payload;
            return {
                ...state,
                currentGame: {
                    ...state.currentGame,
                    usedChances: state.currentGame.usedChances + 1,
                    results: state.currentGame.results.map((item, index) =>
                        index === lineIndex ? newResult : item
                    ),
                },
            };
        }
        default:
            return state;
    }
};
