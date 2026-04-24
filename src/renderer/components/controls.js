/**
 * Controls Component
 * ------------------
 * Form panel where the user configures the pallet and items to optimize,
 * then triggers an optimization request to the backend.
 *
 * Responsibilities:
 *   - Collect pallet dimensions and weight limit
 *   - Allow adding / editing / removing items (SKUs) with dimensions, weight, qty
 *   - Allow import of item data from CSV / JSON
 *   - Expose constraints (stackable, fragile, max weight per layer, etc.)
 *   - Emit a "run optimization" event with the full payload
 */

// TODO: Import any small UI helpers (e.g. createField, createButton)

export class Controls {
	constructor(container) {
		this.container = container;
		this.palletConfig = {
			width: 1200,
			depth: 1000,
			maxHeight: 2200,
			maxWeight: 1000,
		};
		this.items = [];
		this.constraints = {};
		this._onRunCallback = null;
		this._onItemsChangeCallback = null;
	}

	// ---------------------------------------------------------------------------
	// Lifecycle
	// ---------------------------------------------------------------------------

	render() {
		this.container.innerHTML = `
    <form id="optimization-controls" novalidate>
      <h2>Pallet Configuration</h2>

      <label>Width (mm)
        <input type="number" name="width" value="${this.palletConfig.width}" min="1" required />
      </label>
      <label>Depth (mm)
        <input type="number" name="depth" value="${this.palletConfig.depth}" min="1" required />
      </label>
      <label>Max Height (mm)
        <input type="number" name="maxHeight" value="${this.palletConfig.maxHeight}" min="1" required />
      </label>
      <label>Max Weight (kg)
        <input type="number" name="maxWeight" value="${this.palletConfig.maxWeight}" min="1" required />
      </label>

      <div id="controls-error" hidden></div>
      <button type="submit">Run Optimization</button>
    </form>
  `;

		const form = this.container.querySelector("form");
		["width", "depth", "maxHeight", "maxWeight"].forEach((field) => {
			form.elements[field].addEventListener("input", (e) => {
				this.palletConfig[field] = Number(e.target.value);
			});
		});

		form.addEventListener("submit", (e) => {
			e.preventDefault();
			if (!this._validate()) return;
			if (this._onRunCallback) this._onRunCallback(this.getPayload());
		});
	}

	destroy() {
		this.container.innerHTML = "";
	}

	// ---------------------------------------------------------------------------
	// Data management
	// ---------------------------------------------------------------------------

	// TODO: addItem(item)
	//   - Append a new item to the list and re-render the item table

	// TODO: removeItem(id)
	//   - Remove an item by id

	// TODO: importItemsFromCSV(file)
	//   - Parse a CSV file and populate the items list

	getPayload() {
		return {
			pallet: { ...this.palletConfig },
			items: [...this.items], // populated in FE-2
			constraints: { ...this.constraints }, // populated in FE-3
		};
	}

	// ---------------------------------------------------------------------------
	// State
	// ---------------------------------------------------------------------------

	// TODO: setLoading(isLoading)
	//   - Disable the Run button and inputs while an optimization is in-flight

	showValidationError(message) {
		const el = this.container.querySelector("#controls-error");
		if (!el) return;
		el.textContent = message;
		el.hidden = !message;
	}

	// ---------------------------------------------------------------------------
	// Events
	// ---------------------------------------------------------------------------

	onRun(callback) {
		this._onRunCallback = callback;
	}

	// TODO: onItemsChange(callback)
	//   - Optional: notify the 3D viewer in real time as items are added/removed

	// ---------------------------------------------------------------------------
	// Private
	// ---------------------------------------------------------------------------

	_validate() {
		const { width, depth, maxHeight, maxWeight } = this.palletConfig;
		if (!width || !depth || !maxHeight || !maxWeight) {
			this.showValidationError(
				"All pallet dimensions and max weight are required.",
			);
			return false;
		}
		this.showValidationError("");
		return true;
	}
}
