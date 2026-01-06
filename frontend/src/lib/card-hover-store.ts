import { motionValue, type MotionValue } from "framer-motion"

// Singleton store - lives outside React lifecycle
const cardHoverStore = new Map<number, MotionValue<boolean>>()

// Global motion value tracking if ANY card is hovered
const anyCardHoveredValue = motionValue(false)

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
 * Gets the global motion value that tracks if ANY card is hovered
 * Useful for triggering effects that respond to any card interaction
 */
export function getAnyCardHoveredValue(): MotionValue<boolean> {
	return anyCardHoveredValue
}

/**
 * Sets hover state for a specific card index
 * Used by pseudo cards to trigger hover on their neighbors
 * Also updates the global "any card hovered" state
 */
export function setCardHover(index: number, isHovered: boolean): void {
	getCardHoverValue(index).set(isHovered)
	
	// Check if ANY card is now hovered
	let anyHovered = false
	for (const [_, value] of cardHoverStore) {
		if (value.get()) {
			anyHovered = true
			break
		}
	}
	anyCardHoveredValue.set(anyHovered)
}
