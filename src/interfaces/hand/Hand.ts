import {Card} from "../deck/Deck";

export enum HandCategory {
    HighCard = 1,
    Pair = 2,
    TwoPair = 3,
    ThreeOfAKind = 4,
    Straight = 5,
    Flush = 6,
    FullHouse = 7,
    FourOfAKind = 8,
    StraightFlush = 9
}

export interface EvaluatedHand {
    category: HandCategory;
    scoreValues: number[];
    chosen5: Card[];
}

export class Hand {
    private allSevenCards: Card[];
    public bestHand: EvaluatedHand;

    constructor(holeCards: Card[], board: Card[]) {
        this.allSevenCards = [...holeCards, ...board];
        this.bestHand = this.resolveBestHand();
    }

    private getCombinations(cards: Card[]): Card[][] {
        const results: Card[][] = [];
        const helper = (start: number, chosen: Card[]) => {
            if (chosen.length === 5) {
                results.push([...chosen]);
                return;
            }
            for (let i = start; i < cards.length; i++) {
                chosen.push(cards[i]);
                helper(i + 1, chosen);
                chosen.pop();
            }
        };
        helper(0, []);
        return results;
    }

    private resolveBestHand(): EvaluatedHand {
        const combos = this.getCombinations(this.allSevenCards);
        const evaluatedHands = combos.map(combo => this.evaluateFiveCards(combo));
        return evaluatedHands.sort((a, b) => this.compareHands(a, b))[0];
    }

    private compareHands(a: EvaluatedHand, b: EvaluatedHand): number {
        if (a.category !== b.category) return b.category - a.category;
        for (let i = 0; i < a.scoreValues.length; i++) {
            if (a.scoreValues[i] !== b.scoreValues[i]) {
                return b.scoreValues[i] - a.scoreValues[i];
            }
        }
        return 0;
    }

    private evaluateFiveCards(cards: Card[]): EvaluatedHand {
        const sorted = [...cards].sort((a, b) => b.value - a.value);

        const counts = sorted.reduce((acc, card) => {
            acc[card.value] = (acc[card.value] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        const frequencies = Object.entries(counts)
            .map(([value, count]) => ({value: parseInt(value), count}))
            .sort((a, b) => b.count - a.count || b.value - a.value);

        const isFlush = new Set(cards.map(card => card.suit)).size === 1;
        const straightHighCard = this.getStraightHighCard(sorted);

        if (isFlush && straightHighCard) {
            return {category: HandCategory.StraightFlush, scoreValues: [straightHighCard], chosen5: sorted};
        }

        if (frequencies[0].count === 4) {
            return {
                category: HandCategory.FourOfAKind,
                scoreValues: [frequencies[0].value, frequencies[1].value],
                chosen5: this.orderByImportance(sorted, frequencies)
            };
        }

        if (frequencies[0].count === 3 && frequencies[1].count === 2) {
            return {
                category: HandCategory.FullHouse,
                scoreValues: [frequencies[0].value, frequencies[1].value],
                chosen5: this.orderByImportance(sorted, frequencies)
            };
        }

        if (isFlush) {
            return {category: HandCategory.Flush, scoreValues: sorted.map(card => card.value), chosen5: sorted};
        }

        if (straightHighCard) {
            return {category: HandCategory.Straight, scoreValues: [straightHighCard], chosen5: sorted};
        }

        if (frequencies[0].count === 3) {
            return {
                category: HandCategory.ThreeOfAKind,
                scoreValues: [frequencies[0].value, frequencies[1].value, frequencies[2].value],
                chosen5: this.orderByImportance(sorted, frequencies)
            };
        }

        if (frequencies[0].count === 2 && frequencies[1].count === 2) {
            return {
                category: HandCategory.TwoPair,
                scoreValues: [frequencies[0].value, frequencies[1].value, frequencies[2].value],
                chosen5: this.orderByImportance(sorted, frequencies)
            };
        }

        if (frequencies[0].count === 2) {
            return {
                category: HandCategory.Pair,
                scoreValues: [frequencies[0].value, ...frequencies.slice(1).map(frequencie => frequencie.value)],
                chosen5: this.orderByImportance(sorted, frequencies)
            };
        }

        return {category: HandCategory.HighCard, scoreValues: sorted.map(card => card.value), chosen5: sorted};
    }

    private orderByImportance(cards: Card[], frequencies: { value: number, count: number }[]): Card[] {
        return [...cards].sort((a, b) => {
            const countA = frequencies.find(frequencie => frequencie.value === a.value)!.count;
            const countB = frequencies.find(frequencie => frequencie.value === b.value)!.count;
            if (countA !== countB) return countB - countA;
            return b.value - a.value;
        });
    }

    private getStraightHighCard(cards: Card[]): number | null {
        const values = cards.map(card => card.value);

        const isWheel = JSON.stringify(values) === JSON.stringify([14, 5, 4, 3, 2]);
        if (isWheel) return 5;

        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] !== values[i + 1] + 1) return null;
        }
        return values[0];
    }
}