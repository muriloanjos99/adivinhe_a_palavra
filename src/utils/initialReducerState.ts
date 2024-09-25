import { TInitialReducerState } from "../types/TInitialReducerStateInitialReducerStateType";
import { TResult } from "../types/TResult";
import { TTry } from "../types/TTry";
import randomWord from "./randomWord";

const newWord = randomWord();

const initialResults: TResult[] = Array.from({ length: 5 }, () => ({
    correctPosition: [],
    wrongPosition: [],
}));

const initialTries: TTry[] = Array.from({ length: 5 }, () =>
    Array(newWord.length).fill("")
);

const initialReducerState: TInitialReducerState = {
    currentGame: {
        finished: false,
        results: initialResults,
        success: false,
        tries: initialTries,
        usedChances: 0,
        word: newWord,
    },
    games: localStorage.getItem("played_games")
        ? JSON.parse(localStorage.getItem("played_games")!)
        : [],
    achievements: [],
};

export default initialReducerState;
