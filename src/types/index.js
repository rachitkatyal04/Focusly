/**
 * @typedef {Object} InboxItem
 * @property {string} id - Unique identifier
 * @property {string} title - Item title
 * @property {string} description - Item description
 * @property {Date} createdAt - Creation date
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique identifier
 * @property {string} name - Project name
 * @property {string} description - Project description
 * @property {Date} createdAt - Creation date
 * @property {boolean} completed - Completion status
 */

/**
 * @typedef {Object} Context
 * @property {string} id - Unique identifier
 * @property {string} name - Context name (e.g., @computer, @home)
 * @property {string} color - Display color
 */

/**
 * @typedef {Object} NextAction
 * @property {string} id - Unique identifier
 * @property {string} title - Action title
 * @property {string} description - Action description
 * @property {string} projectId - Associated project ID (optional)
 * @property {string} contextId - Associated context ID (optional)
 * @property {Date} createdAt - Creation date
 * @property {boolean} completed - Completion status
 * @property {Date} completedAt - Completion date (optional)
 */

export {};
