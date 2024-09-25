import words from "../data/words";

const randomWord = (): string => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex].toUpperCase();
};

export default randomWord;
