import { TResult } from "./TResult";
import { TTry } from "./TTry";

export enum EGameActions {
    finishGame = "FINISH_GAME",
    newGame = "NEW_GAME",
    submitResult = "SUBMIT_RESULT",
    chanceUsed = "CHANCE_USED",
    letterInput = "LETTER_INPUT",
}

export type TFinishGame = {
    type: EGameActions.finishGame;
    payload: boolean;
};

export type TNewGame = {
    type: EGameActions.newGame;
    payload: string;
};

export type TChanceUsed = {
    type: EGameActions.chanceUsed;
};

export type TSubmitResult = {
    type: EGameActions.submitResult;
    payload: { newResult: TResult; lineIndex: number };
};

export type TLetterInput = {
    type: EGameActions.letterInput;
    payload: { newTry: TTry; lineIndex: number };
};
