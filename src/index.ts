import {Deck, Card} from "./interfaces/deck/Deck";
import {Hand, EvaluatedHand} from "./interfaces/hand/Hand";

const formatCards = (cards: readonly Card[] | Card[]) =>
    cards.map(c => c.toString()).join(" ");

function playRound() {
    console.log("--- Start New Game ---\n");

    const deck = new Deck();
    deck.shuffle();

    // 1. Distribution
    const playerCount = 2;
    const players: { id: number; hole: Card[]; hand?: Hand }[] = [];

    for (let i = 1; i <= playerCount; i++) {
        players.push({id: i, hole: deck.drawHand()});
    }

    const board = deck.drawRiver();
    console.log(`Board (River): [ ${formatCards(board)} ]\n`);

    players.forEach(p => {
        p.hand = new Hand(p.hole, board);
        console.log(`PLAYER ${p.id}:`);
        console.log(`  Hole: ${formatCards(p.hole)}`);
        console.log(`  Best Hand: ${formatCards(p.hand.bestHand.chosen5)}`);
        console.log(`  Category: ${p.hand.bestHand.category} (${formatCategory(p.hand.bestHand.category)})\n`);
    });

    console.log("--- Oui ---");

    const sortedPlayers = [...players].sort((a, b) => {
        return compareTwoHands(a.hand!.bestHand, b.hand!.bestHand);
    });

    const winner = sortedPlayers[0];

    const winners = sortedPlayers.filter(p =>
        compareTwoHands(p.hand!.bestHand, winner.hand!.bestHand) === 0
    );

    if (winners.length > 1) {
        const ids = winners.map(w => `PLAYER ${w.id}`).join(" & ");
        console.log(`IT'S A TIE (Split Pot) between: ${ids}!`);
    } else {
        console.log(`PLAYER ${winner.id} WINS with ${formatCategory(winner.hand!.bestHand.category)}!`);
    }
}

function compareTwoHands(a: EvaluatedHand, b: EvaluatedHand): number {
    if (a.category !== b.category) return b.category - a.category;

    for (let i = 0; i < a.scoreValues.length; i++) {
        if (a.scoreValues[i] !== b.scoreValues[i]) {
            return b.scoreValues[i] - a.scoreValues[i];
        }
    }
    return 0;
}

function formatCategory(cat: number): string {
    const names = ["", "High Card", "Pair", "Two Pair", "Three of a Kind", "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush"];
    return names[cat] || "Unknown";
}

playRound();