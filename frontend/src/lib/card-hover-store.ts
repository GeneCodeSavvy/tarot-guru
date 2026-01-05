import { motionValue } from "framer-motion"
import type { MotionValue } from "framer-motion"

// Singleton store - lives outside React lifecycle
const cardHoverStore = new Map<number, MotionValue<boolean>>()

/**
 * Gets or creates a motion value for a card's hover state
 * Motion values update without causing React re-renders
 */
export function getCardHoverValue(index: number): MotionValue<boolean> {
	if (!cardHoverStore.has(index)) {
		cardHoverStore.set(index, motionValue(false))
	}
	return cardHoverStore.get(index)!
}

/**
 * Sets hover state for a specific card index
 * Used by pseudo cards to trigger hover on their neighbors
 */
export function setCardHover(index: number, isHovered: boolean): void {
	getCardHoverValue(index).set(isHovered)
}
