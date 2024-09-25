import { TGame } from "../types/TGame";

const sumVictoryStreak = (games: TGame[]) => {
    let currentStreak = 0;
    let biggestStreak = 0;
    games.forEach((game) => {
        game.success ? currentStreak++ : (currentStreak = 0);

        currentStreak > biggestStreak && (biggestStreak = currentStreak);
    });

    return biggestStreak;
};

export default sumVictoryStreak;
