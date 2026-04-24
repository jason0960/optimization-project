/**
 * Deterministic color assignment for pallet items.
 * Two items with the same SKU / id should always get the same color
 * so that the 3D scene is easy to read visually.
 */

// TODO: getColorForItem(id)
//   - Hash the id string and map it to a THREE.Color (or hex string)
//   - Same id in -> same color out

// TODO: getHighlightColor()
//   - Return the color used when an item is selected in the Results list

// TODO: getPalletColor()
//   - Return the base color for the pallet base mesh

