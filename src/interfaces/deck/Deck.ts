export enum Suit {
    Spades = "♠",
    Hearts = "♥",
    Diamonds = "♦",
    Clubs = "♣",
}

export enum Rank {
    Ace = "A",
    Two = "2",
    Three = "3",
    Four = "4",
    Five = "5",
    Six = "6",
    Seven = "7",
    Eight = "8",
    Nine = "9",
    Ten = "10",
    Jack = "J",
    Queen = "Q",
    King = "K",
}

const rank_values: Record<Rank, number> = {
    [Rank.Two]: 2,
    [Rank.Three]: 3,
    [Rank.Four]: 4,
    [Rank.Five]: 5,
    [Rank.Six]: 6,
    [Rank.Seven]: 7,
    [Rank.Eight]: 8,
    [Rank.Nine]: 9,
    [Rank.Ten]: 10,
    [Rank.Jack]: 11,
    [Rank.Queen]: 12,
    [Rank.King]: 13,
    [Rank.Ace]: 14,
};

export class Card {
    readonly suit: Suit;
    readonly rank: Rank;
    readonly value: number;

    constructor(suit: Suit, rank: Rank) {
        this.suit = suit;
        this.rank = rank;
        this.value = rank_values[rank];
    }
}

export class Deck {
    private _cards: Card[];

    constructor() {
        this._cards = Deck.buildDeck();
    }

    private static buildDeck(): Card[] {
        const deck: Card[] = [];
        for (const suit of Object.values(Suit)) {
            for (const rank of Object.values(Rank)) {
                deck.push(new Card(suit, rank));
            }
        }
        return deck;
    }

    get cards(): ReadonlyArray<Card> {
        return this._cards;
    }

    shuffle(): void {
        for (let i = this._cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
        }
    }

    drawHand(): Card[] {
        return this._cards.splice(0, 2);
    }

    drawRiver(): Card[] {
        return this._cards.splice(0, 5);
    }

    reset(): void {
        this._cards = Deck.buildDeck();
    }
}