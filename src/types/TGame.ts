import { TResult } from "./TResult";
import { TTry } from "./TTry";

export type TGame = {
    finished: boolean;
    results: TResult[];
    success: boolean | undefined;
    tries: TTry[];
    usedChances: number;
    word: string;
};
