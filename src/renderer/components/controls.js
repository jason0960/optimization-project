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
    this._onRunCallback = null;
    this._onItemsChangeCallback = null;

    this.constraints = {
      allowRotation: true,
      fragileOnTop: false,
      stackableOnly: false,
    };
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

      <table id="item-table">
  <thead>
    <tr>
      <th>SKU</th>
      <th>Width (mm)</th>
      <th>Depth (mm)</th>
      <th>Height (mm)</th>
      <th>Weight (kg)</th>
      <th>Qty</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="item-rows">
    <!-- rows added dynamically by addItem() -->
  </tbody>
</table>
<button type="button" id="add-item-btn">+ Add Item</button>
<button type="button" id="import-btn" style="cursor:pointer">Import CSV / JSON</button>
<input type="file" id="import-csv-input" accept=".csv, .json" hidden />
<section>
  <h2>Constraints</h2>
  <label>
    <input type="checkbox" name="allowRotation" checked />
    Allow item rotation
  </label>
  <label>
    <input type="checkbox" name="fragileOnTop" />
    Fragile items on top
  </label>
  <label>
    <input type="checkbox" name="stackableOnly" />
    Stackable items only
  </label>
</section>

      <div id="controls-error" hidden></div>
      <button type="submit">Run Optimization</button>
      
    </form>
  `;
    this.container
      .querySelector("#add-item-btn")
      .addEventListener("click", () => {
        this.addItem({
          id: Date.now(),
          sku: "",
          width: 0,
          depth: 0,
          height: 0,
          weight: 0,
          qty: 1,
        });
      });

    const form = this.container.querySelector("form");
    ["width", "depth", "maxHeight", "maxWeight"].forEach((field) => {
      form.elements[field].addEventListener("input", (e) => {
        this.palletConfig[field] = Number(e.target.value);
      });
    });

    this.container
      .querySelector("#import-csv-input")
      .addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        this.importItemsFromFile(file);
      });

    this.container
      .querySelector("#import-btn")
      .addEventListener("click", () => {
        this.container.querySelector("#import-csv-input").click();
      });

    ["allowRotation", "fragileOnTop", "stackableOnly"].forEach((field) => {
      form.elements[field].addEventListener("change", (e) => {
        this.constraints[field] = e.target.checked;
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

  addItem(item) {
    this.items.push(item);
    const tbody = this.container.querySelector("#item-rows");
    const tr = document.createElement("tr");
    tr.dataset.id = item.id;
const escapedSku = item.sku.toString()
  .replace(/&/g, "&amp;")
  .replace(/"/g, "&quot;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");
    tr.innerHTML = `
      <td><input type="text" name="sku" value="${escapedSku}" required /></td>
      <td><input type="number" name="width" value="${item.width}" min="1" required /></td>
      <td><input type="number" name="depth" value="${item.depth}" min="1" required /></td>
      <td><input type="number" name="height" value="${item.height}" min="1" required /></td>
      <td><input type="number" name="weight" value="${item.weight}" min="0.01" step="0.01" required /></td>
      <td><input type="number" name="qty" value="${item.qty}" min="1" required /></td>
      <td><button type="button" class="remove-item-btn">Remove</button></td>
    `;
    tr.querySelector(".remove-item-btn").addEventListener("click", () =>
      this.removeItem(item.id),
    );
    tbody.appendChild(tr);
  }

  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
    const row = this.container.querySelector(`tr[data-id="${id}"]`);
    if (row) row.remove();
  }
  importItemsFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const items = file.name.endsWith(".json")
        ? JSON.parse(text)
        : this._parseCSV(text);
      items.forEach((item) =>
        this.addItem({ id: Date.now() + Math.random(), ...item }),
      );
    };
    reader.readAsText(file);
  }

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
  const palletOk = this._validatePallet();
  const itemsOk = this._validateItems();
  return palletOk && itemsOk;
}

_validatePallet() {
  const form = this.container.querySelector("form");
  let valid = true;
  const rules = [
    { field: "width",     label: "Width is required" },
    { field: "depth",     label: "Depth is required" },
    { field: "maxHeight", label: "Max height is required" },
    { field: "maxWeight", label: "Max weight is required" },
  ];
  for (const { field, label } of rules) {
    const input = form.elements[field];
    const val = Number(input.value);
    const msg = (!input.value || val <= 0) ? label : "";
    this._setFieldError(input, msg);
    if (msg) valid = false;
  }
  return valid;
}

_validateItems() {
  if (this.items.length === 0) {
    this.showValidationError("Add at least one item before optimizing.");
    return false;
  }
  this.showValidationError("");

  let valid = true;
  const rows = this.container.querySelectorAll("#item-rows tr");
  for (const tr of rows) {
    const sku    = tr.querySelector("[name='sku']");
    const width  = tr.querySelector("[name='width']");
    const depth  = tr.querySelector("[name='depth']");
    const height = tr.querySelector("[name='height']");
    const weight = tr.querySelector("[name='weight']");
    const qty    = tr.querySelector("[name='qty']");

    this._setFieldError(sku,    sku.value.trim()     === "" ? "SKU is required"         : "");
    this._setFieldError(width,  Number(width.value)  <= 0   ? "Must be greater than 0"             : "");
    this._setFieldError(depth,  Number(depth.value)  <= 0   ? "Must be greater than 0"             : "");
    this._setFieldError(height, Number(height.value) <= 0   ? "Must be greater than 0"             : "");
    this._setFieldError(weight, Number(weight.value) <= 0   ? "Must be greater than 0"             : "");
    this._setFieldError(qty,    Number(qty.value)    <= 0    ? "Must be at least 1"      : "");

    if (!sku.value.trim() || [width, depth, height, weight, qty].some(i => Number(i.value) <= 0)) {
      valid = false;
    }
  }
  return valid;
}

  _parseCSV(text) {
    const [headerLine, ...rows] = text.trim().split("\n");
    const headers = headerLine.split(",").map((h) => h.trim());
    return rows.map((row) => {
      const values = row.split(",").map((v) => v.trim());
      return Object.fromEntries(
        headers.map((h, i) => [
          h,
          isNaN(values[i]) ? values[i] : Number(values[i]),
        ]),
      );
    });
  }

  _setFieldError(input, message) {
    let span = input.nextElementSibling;
    if (!span || !span.classList.contains("field-error")) {
      span = document.createElement("span");
      span.classList.add("field-error");
      input.after(span);
    }
    span.textContent = message;
    span.hidden = !message;
  }
}
