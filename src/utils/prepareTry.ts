const prepareTry = (lineIndex: number) => {
    const currentTry = currentGame.tries[lineIndex];
    const wordArray = currentGame.word.split("");
    const newResults = Array.from(currentGame.results);

    newResults[lineIndex] = {
        correctPosition: [],
        wrongPosition: [],
    };

    const wordLetterCount = {} as Record<string, number>;
    wordArray.forEach((letter) => {
        wordLetterCount[letter] = (wordLetterCount[letter] || 0) + 1;
    });

    const tryLetterCount = {} as Record<string, number>;
    currentTry.forEach((letter) => {
        tryLetterCount[letter] = (tryLetterCount[letter] || 0) + 1;
    });

    currentTry.forEach((letter, i) => {
        if (wordArray[i] === letter) {
            newResults[lineIndex].correctPosition.push(i);
            wordLetterCount[letter]--;
            tryLetterCount[letter]--;
        }
    });

    return {
        currentTry,
        wordArray,
        newResults,
    };
};
