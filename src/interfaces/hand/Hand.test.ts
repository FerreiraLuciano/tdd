import { describe, it, expect } from 'vitest';
import { Hand, HandCategory } from './Hand';
import { Card, Suit, Rank } from '../deck/Deck';

describe('Hand and Combination test', () => {

    const createCards = (cardDefinitions: { rank: Rank, suit: Suit }[]): Card[] => {
        return cardDefinitions.map(definition => new Card(definition.suit, definition.rank));
    };

    describe('Test identify winner on similar hands', () => {

        it('should identify Four of a Kind and the correct kicker', () => {
            const communityCards = createCards([
                { rank: Rank.Ace, suit: Suit.Spades }, { rank: Rank.Ace, suit: Suit.Hearts },
                { rank: Rank.Ace, suit: Suit.Diamonds }, { rank: Rank.King, suit: Suit.Clubs },
                { rank: Rank.Two, suit: Suit.Spades }
            ]);
            const holeCards = createCards([
                { rank: Rank.Ace, suit: Suit.Clubs }, { rank: Rank.Queen, suit: Suit.Spades }
            ]);

            const playerHand = new Hand(holeCards, communityCards);

            expect(playerHand.bestHand.category).toBe(HandCategory.FourOfAKind);
            expect(playerHand.bestHand.scoreValues).toEqual([14, 13]);
        });

        it('should identify a Full House (Aces full of Kings)', () => {
            const communityCards = createCards([
                { rank: Rank.Ace, suit: Suit.Spades }, { rank: Rank.Ace, suit: Suit.Hearts },
                { rank: Rank.King, suit: Suit.Diamonds }, { rank: Rank.King, suit: Suit.Clubs },
                { rank: Rank.Ten, suit: Suit.Spades }
            ]);
            const holeCards = createCards([
                { rank: Rank.Ace, suit: Suit.Clubs }, { rank: Rank.Two, suit: Suit.Spades }
            ]);

            const playerHand = new Hand(holeCards, communityCards);

            expect(playerHand.bestHand.category).toBe(HandCategory.FullHouse);
            expect(playerHand.bestHand.scoreValues).toEqual([14, 13]);
        });

        it('should identify Two Pair and the best kicker', () => {
            const communityCards = createCards([
                { rank: Rank.Jack, suit: Suit.Spades }, { rank: Rank.Jack, suit: Suit.Hearts },
                { rank: Rank.Eight, suit: Suit.Diamonds }, { rank: Rank.Eight, suit: Suit.Clubs },
                { rank: Rank.Four, suit: Suit.Spades }
            ]);
            const holeCards = createCards([
                { rank: Rank.Ace, suit: Suit.Clubs }, { rank: Rank.Two, suit: Suit.Spades }
            ]);

            const playerHand = new Hand(holeCards, communityCards);

            expect(playerHand.bestHand.category).toBe(HandCategory.TwoPair);
            expect(playerHand.bestHand.scoreValues).toEqual([11, 8, 14]);
        });
    });

    describe('Tie-Break Scenarios (Same Category)', () => {

        it('should split pot when hands are identical (Board plays)', () => {
            const communityCards = createCards([
                { rank: Rank.Ace, suit: Suit.Spades }, { rank: Rank.King, suit: Suit.Hearts },
                { rank: Rank.Queen, suit: Suit.Diamonds }, { rank: Rank.Jack, suit: Suit.Clubs },
                { rank: Rank.Ten, suit: Suit.Spades }
            ]);

            const playerOneHoleCards = createCards([{ rank: Rank.Two, suit: Suit.Hearts }, { rank: Rank.Three, suit: Suit.Diamonds }]);
            const playerTwoHoleCards = createCards([{ rank: Rank.Four, suit: Suit.Clubs }, { rank: Rank.Five, suit: Suit.Spades }]);

            const firstPlayerHand = new Hand(playerOneHoleCards, communityCards);
            const secondPlayerHand = new Hand(playerTwoHoleCards, communityCards);

            expect(firstPlayerHand.bestHand.category).toBe(HandCategory.Straight);
            expect(secondPlayerHand.bestHand.category).toBe(HandCategory.Straight);
            expect(firstPlayerHand.bestHand.scoreValues).toEqual(secondPlayerHand.bestHand.scoreValues);
        });

        it('should give victory to the higher kicker in a Pair vs Pair', () => {
            const communityCards = createCards([
                { rank: Rank.Ace, suit: Suit.Spades }, { rank: Rank.Ace, suit: Suit.Hearts },
                { rank: Rank.Ten, suit: Suit.Diamonds }, { rank: Rank.Eight, suit: Suit.Clubs },
                { rank: Rank.Six, suit: Suit.Spades }
            ]);

            const playerOneHoleCards = createCards([{ rank: Rank.King, suit: Suit.Hearts }, { rank: Rank.Two, suit: Suit.Diamonds }]);
            const playerTwoHoleCards = createCards([{ rank: Rank.Queen, suit: Suit.Clubs }, { rank: Rank.Jack, suit: Suit.Spades }]);

            const playerOneBestResult = new Hand(playerOneHoleCards, communityCards).bestHand;
            const playerTwoBestResult = new Hand(playerTwoHoleCards, communityCards).bestHand;

            expect(playerOneBestResult.scoreValues[1]).toBeGreaterThan(playerTwoBestResult.scoreValues[1]);
        });
    });

    describe('Ordering Requirement', () => {
        it('should return chosen5 cards ordered by importance (Three of a Kind example)', () => {
            const communityCards = createCards([
                { rank: Rank.Ten, suit: Suit.Spades }, { rank: Rank.Ten, suit: Suit.Hearts },
                { rank: Rank.Ten, suit: Suit.Diamonds }, { rank: Rank.Two, suit: Suit.Clubs },
                { rank: Rank.Four, suit: Suit.Spades }
            ]);
            const holeCards = createCards([{ rank: Rank.Ace, suit: Suit.Spades }, { rank: Rank.Seven, suit: Suit.Clubs }]);

            const playerHand = new Hand(holeCards, communityCards);
            const cardRanksInOrder = playerHand.bestHand.chosen5.map(card => card.rank);

            expect(cardRanksInOrder).toEqual([Rank.Ten, Rank.Ten, Rank.Ten, Rank.Ace, Rank.Seven]);
        });
    });
});