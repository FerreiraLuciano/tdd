import { describe, it, expect, beforeEach } from 'vitest';
import { Deck, Card, Suit, Rank } from './Deck';

describe('Test deck', () => {

    describe('Card Class', () => {
        it('should initialize with correct suit and rank', () => {
            const card = new Card(Suit.Spades, Rank.Ace);
            expect(card.rank).toBe(Rank.Ace);
            expect(card.suit).toBe(Suit.Spades);
        });

        it('should map the correct numeric value for an Ace (14)', () => {
            const card = new Card(Suit.Clubs, Rank.Ace);
            expect(card.value).toBe(14);
        });

        it('should map the correct numeric value for a Face card (King = 13)', () => {
            const card = new Card(Suit.Diamonds, Rank.King);
            expect(card.value).toBe(13);
        });
    });

    describe('Deck Class', () => {
        let deck: Deck;

        beforeEach(() => {
            deck = new Deck();
        });

        it('should contain exactly 52 cards upon initialization', () => {
            expect(deck.cards.length).toBe(52);
        });

        it('should have 13 cards of each suit', () => {
            const hearts = deck.cards.filter(card => card.suit === Suit.Hearts);
            const diamonds = deck.cards.filter(card => card.suit === Suit.Diamonds);
            const clubs = deck.cards.filter(card => card.suit === Suit.Clubs);
            const spades = deck.cards.filter(card => card.suit === Suit.Spades);

            expect(hearts.length).toBe(13);
            expect(diamonds.length).toBe(13);
            expect(clubs.length).toBe(13);
            expect(spades.length).toBe(13);
        });

        it('should change the order of cards after shuffling', () => {
            const originalOrder = [...deck.cards];
            deck.shuffle();
            const shuffledOrder = deck.cards;

            expect(shuffledOrder).not.toEqual(originalOrder);
            expect(shuffledOrder.length).toBe(52);
        });

        it('should remove cards from the deck when drawing a hand', () => {
            const hand = deck.drawHand();
            expect(hand.length).toBe(2);
            expect(deck.cards.length).toBe(50);
        });

        it('should remove 5 cards when drawing the river', () => {
            const river = deck.drawRiver();
            expect(river.length).toBe(5);
            expect(deck.cards.length).toBe(47);
        });

        it('should reset to a full 52-card deck', () => {
            deck.drawRiver();
            deck.drawHand();
            expect(deck.cards.length).toBe(45);

            deck.reset();
            expect(deck.cards.length).toBe(52);
        });
    });
});