/**
 * OptimizationService
 * -------------------
 * Thin client for the backend pallet-optimization API.
 * Keeps all HTTP / transport concerns out of the UI components.
 */

// TODO: Define API_BASE_URL (env-driven, e.g. import.meta.env.VITE_API_URL)

export class OptimizationService {
  constructor(baseUrl) {
    // TODO: Store baseUrl (defaulting to API_BASE_URL)
  }

  // TODO: async optimize(payload)
  //   - POST payload to `${baseUrl}/optimize`
  //   - Expected response shape:
  //       {
  //         stats: { ... },
  //         placements: [{ id, position, rotation, dimensions }, ...],
  //         unplacedItems: [ ... ]
  //       }
  //   - Throw on non-2xx responses with a useful error message

  // TODO: async optimizeStream(payload, onProgress)
  //   - Optional: open a WebSocket / SSE connection to receive iterative
  //     optimization progress so the UI can animate placement in real time

  // TODO: async getSavedLayouts()
  //   - GET `${baseUrl}/layouts`

  // TODO: async saveLayout(name, result)
  //   - POST result to `${baseUrl}/layouts`

  // TODO: abort()
  //   - Cancel an in-flight optimization request (AbortController)
}
