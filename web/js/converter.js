/**
 * Core conversion logic for Konbata (JSON, YAML, XML)
 */

import { copyToClipboard, pasteFromClipboard, showError } from "./utils.js";

/**
 * Initializes the converter event listeners and state.
 */
export function setupConverter() {
  const sourceText = document.getElementById("source-text");
  const targetText = document.getElementById("target-text");
  const sourceFormat = document.getElementById("source-format");
  const targetFormat = document.getElementById("target-format");
  const clearBtn = document.getElementById("clear-btn");
  const pasteBtn = document.getElementById("paste-btn");
  const copyBtn = document.getElementById("copy-btn");

  if (!sourceText || !targetText || !sourceFormat || !targetFormat) return;

  // Load saved formats from local storage
  const savedSourceFormat = localStorage.getItem("source-format");
  const savedTargetFormat = localStorage.getItem("target-format");

  if (savedSourceFormat) {
    sourceFormat.value = savedSourceFormat;
  }
  if (savedTargetFormat) {
    targetFormat.value = savedTargetFormat;
  }

  /**
   * Performs the conversion from source to target.
   */
  const performConversion = () => {
    const input = sourceText.value.trim();
    if (!input) {
      targetText.value = "";
      showError(null);
      return;
    }

    try {
      const data = parseData(input, sourceFormat.value);
      const output = stringifyData(data, targetFormat.value);
      targetText.value = output;
      showError(null);
    } catch (err) {
      console.error("Conversion error:", err);
      showError(
        `Error parsing ${sourceFormat.value.toUpperCase()}: ${err.message}`,
      );
      targetText.value = "";
    }
  };

  // Event listeners for real-time sync
  sourceText.addEventListener("input", performConversion);
  sourceFormat.addEventListener("change", () => {
    localStorage.setItem("source-format", sourceFormat.value);
    performConversion();
  });
  targetFormat.addEventListener("change", () => {
    localStorage.setItem("target-format", targetFormat.value);
    performConversion();
  });

  // Auto-detect format on paste
  sourceText.addEventListener("paste", (e) => {
    const text = e.clipboardData?.getData("text");
    if (text) {
      const detected = detectFormat(text);
      if (detected) {
        sourceFormat.value = detected;
        localStorage.setItem("source-format", detected);
      }
    }
  });

  // Button actions
  clearBtn?.addEventListener("click", () => {
    sourceText.value = "";
    targetText.value = "";
    showError(null);
    sourceText.focus();
  });

  pasteBtn?.addEventListener("click", async () => {
    const text = await pasteFromClipboard();
    if (text !== null) {
      const detected = detectFormat(text);
      if (detected) {
        sourceFormat.value = detected;
        localStorage.setItem("source-format", detected);
      }
      sourceText.value = text;
      performConversion();
    }
  });

  copyBtn?.addEventListener("click", () => {
    copyToClipboard(targetText.value);
  });

  // Perform initial conversion if there's any content
  performConversion();
}

/**
 * Attempts to detect the format of the input text based on its structure.
 * @param {string} input - The raw input text.
 * @returns {string|null} - The detected format or null.
 */
export function detectFormat(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // JSON detection: Usually starts with { or [
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "object" && parsed !== null) return "json";
    } catch (_) {
      // Not valid JSON
    }
  }

  // XML detection: Usually starts with <
  if (trimmed.startsWith("<")) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(trimmed, "text/xml");
      if (!doc.getElementsByTagName("parsererror").length) {
        return "xml";
      }
    } catch (_) {
      // Not valid XML
    }
  }

  // TOML detection: Often has tables [table] or key = "value"
  if (
    trimmed.includes("=") || (trimmed.startsWith("[") && trimmed.includes("]"))
  ) {
    try {
      const parsed = parseTOML(trimmed);
      // Ensure we actually found some data
      if (Object.keys(parsed).length > 0) return "toml";
    } catch (_) {
      // Not valid TOML
    }
  }

  // YAML detection: Often has key: value or list items - item
  if (trimmed.includes(":") || trimmed.startsWith("-")) {
    try {
      const parsed = parseYAML(trimmed);
      // Ensure we actually found some data
      if (Object.keys(parsed).length > 0) return "yaml";
    } catch (_) {
      // Not valid YAML
    }
  }

  // Properties detection: Simple key=value pairs
  if (trimmed.includes("=") || trimmed.includes(":")) {
    try {
      const parsed = parseProperties(trimmed);
      // Ensure we actually found some data
      if (Object.keys(parsed).length > 0) return "properties";
    } catch (_) {
      // Not valid Properties
    }
  }

  return null;
}

/**
 * Parses the input string based on the format.
 * @param {string} input - The raw input string.
 * @param {string} format - The format (json, yaml, xml).
 * @returns {any} - The parsed JavaScript object.
 */
export function parseData(input, format) {
  switch (format) {
    case "json":
      return JSON.parse(input);
    case "yaml":
      return parseYAML(input);
    case "xml":
      return parseXML(input);
    case "properties":
      return parseProperties(input);
    case "toml":
      return parseTOML(input);
    default:
      throw new Error("Unsupported format");
  }
}

/**
 * Stringifies the data object based on the format.
 * @param {any} data - The JavaScript object to stringify.
 * @param {string} format - The format (json, yaml, xml).
 * @returns {string} - The formatted string.
 */
export function stringifyData(data, format) {
  switch (format) {
    case "json":
      return JSON.stringify(data, null, 2);
    case "yaml":
      return stringifyYAML(data);
    case "xml":
      return stringifyXML(data);
    case "properties":
      return stringifyProperties(data);
    case "toml":
      return stringifyTOML(data);
    default:
      throw new Error("Unsupported format");
  }
}

// --- YAML Parser (Basic implementation) ---

/**
 * Basic YAML parser.
 * Handles simple key-value pairs, nested objects, and arrays.
 * @param {string} yaml - The YAML string.
 * @returns {any}
 */
function parseYAML(yaml) {
  // This is a very simplified YAML parser
  const lines = yaml.split("\n");
  const result = {};
  const stack = [{ obj: result, indent: -1, key: null, parent: null }];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const indent = line.search(/\S/);

    // Pop from stack if indentation decreases
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const currentEntry = stack[stack.length - 1];

    if (trimmed.startsWith("-")) {
      // Handle array items
      const value = parseValue(trimmed.substring(1).trim());

      // If current object is not an array, convert it to one
      if (!Array.isArray(currentEntry.obj)) {
        const newArr = [];
        if (currentEntry.parent && currentEntry.key !== null) {
          currentEntry.parent[currentEntry.key] = newArr;
        }
        currentEntry.obj = newArr;
      }

      if (value !== "" && Array.isArray(currentEntry.obj)) {
        currentEntry.obj.push(value);
      }
    } else {
      const [key, ...valueParts] = trimmed.split(":");
      const k = key.trim();
      const value = valueParts.join(":").trim();

      if (value === "") {
        // It's a nested object or array start
        const newObj = {};
        currentEntry.obj[k] = newObj;
        stack.push({
          obj: newObj,
          indent: indent,
          key: k,
          parent: currentEntry.obj,
        });
      } else {
        currentEntry.obj[k] = parseValue(value);
      }
    }
  }
  return result;
}

function parseValue(val) {
  if (val === "true") return true;
  if (val === "false") return false;
  if (val === "null") return null;
  if (!isNaN(val) && val !== "") return Number(val);
  // Remove quotes if present
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    return val.substring(1, val.length - 1);
  }
  return val;
}

/**
 * Basic YAML stringifier.
 * @param {any} data - The data to stringify.
 * @param {number} indent - Current indentation level.
 * @returns {string}
 */
function stringifyYAML(data, indent = 0) {
  const spaces = " ".repeat(indent);
  if (data === null) return "null";
  if (typeof data !== "object") return String(data);

  if (Array.isArray(data)) {
    return data.map((item) =>
      `${spaces}- ${stringifyYAML(item, indent + 2).trimStart()}`
    ).join("\n");
  }

  return Object.entries(data).map(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      return `${spaces}${key}:\n${stringifyYAML(value, indent + 2)}`;
    }
    return `${spaces}${key}: ${stringifyYAML(value)}`;
  }).join("\n");
}

// --- XML Parser ---

/**
 * Parses XML string into a JS object.
 * @param {string} xml - The XML string.
 * @returns {any}
 */
function parseXML(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");

  const errorNode = xmlDoc.querySelector("parsererror");
  if (errorNode) {
    throw new Error(errorNode.textContent);
  }

  return xmlToJSON(xmlDoc.documentElement);
}

/**
 * Helper to convert XML node to JSON.
 */
function xmlToJSON(node) {
  const obj = {};

  if (node.nodeType === 1) { // element
    if (node.attributes.length > 0) {
      obj["@attributes"] = {};
      for (let j = 0; j < node.attributes.length; j++) {
        const attribute = node.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (node.nodeType === 3) { // text
    return node.nodeValue.trim();
  }

  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i++) {
      const item = node.childNodes.item(i);
      const nodeName = item.nodeName;
      if (nodeName === "#text") {
        const text = item.nodeValue.trim();
        if (text) return text;
        continue;
      }
      if (typeof obj[nodeName] === "undefined") {
        obj[nodeName] = xmlToJSON(item);
      } else {
        if (typeof obj[nodeName].push === "undefined") {
          const old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJSON(item));
      }
    }
  }
  return obj;
}

/**
 * Stringifies data to XML.
 * @param {any} data - The data to stringify.
 * @returns {string}
 */
function stringifyXML(data) {
  const doc = document.implementation.createDocument("", "root", null);
  const root = doc.documentElement;

  function buildXML(parent, obj) {
    if (typeof obj !== "object" || obj === null) {
      parent.textContent = String(obj);
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      if (key === "@attributes") {
        for (const [attrName, attrValue] of Object.entries(value)) {
          try {
            parent.setAttribute(attrName, attrValue);
          } catch (e) {
            console.warn(`Invalid XML attribute name: ${attrName}`, e);
          }
        }
        continue;
      }

      // Ensure key is a valid XML element name
      let safeKey = key.trim().replace(/[^a-zA-Z0-9_.-]/g, "_");
      if (!safeKey || /^[^a-zA-Z_]/.test(safeKey)) {
        safeKey = "item_" + safeKey;
      }

      try {
        if (Array.isArray(value)) {
          for (const item of value) {
            const child = doc.createElement(safeKey);
            parent.appendChild(child);
            buildXML(child, item);
          }
        } else {
          const child = doc.createElement(safeKey);
          parent.appendChild(child);
          buildXML(child, value);
        }
      } catch (e) {
        console.warn(`Could not create XML element for key: ${key}`, e);
      }
    }
  }

  // If data is just an object, use its keys as children of root
  // If data is a primitive, set it as root content
  if (typeof data !== "object" || data === null) {
    root.textContent = String(data);
  } else {
    buildXML(root, data);
  }

  const serializer = new XMLSerializer();
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    formatXML(serializer.serializeToString(doc));
}

/**
 * Simple XML formatter.
 */
function formatXML(xml) {
  let indent = "";
  const tab = "  ";
  let result = "";
  const nodes = xml.split(/>\s*</);
  if (nodes[0].charAt(0) === "<") nodes[0] = nodes[0].substring(1);
  if (
    nodes[nodes.length - 1].charAt(nodes[nodes.length - 1].length - 1) === ">"
  ) {
    nodes[nodes.length - 1] = nodes[nodes.length - 1].substring(
      0,
      nodes[nodes.length - 1].length - 1,
    );
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.startsWith("/")) {
      indent = indent.substring(tab.length);
    }
    result += indent + "<" + node + ">\n";

    const isOpeningTag = !node.startsWith("/") && !node.endsWith("/") &&
      !node.includes(">");
    if (isOpeningTag) {
      indent += tab;
    }
  }
  return result.trim();
}

// --- Properties Parser ---

/**
 * Parses Properties string into a JS object.
 * Handles dotted keys for nested structures.
 * @param {string} str - The Properties string.
 * @returns {any}
 */
function parseProperties(str) {
  const result = {};
  const lines = str.split(/\r?\n/);

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("#") || line.startsWith("!")) continue;

    const match = line.match(/^(.+?)\s*[=:]\s*(.*)$/);
    if (!match) continue;

    const key = match[1].trim();
    let value = match[2].trim();

    // Handle basic escapes
    value = value
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r")
      .replace(
        /\\u([0-9a-fA-F]{4})/g,
        (_, hex) => String.fromCharCode(parseInt(hex, 16)),
      );

    // Unflatten dotted keys
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        current[part] = parseValue(value);
      } else {
        if (!current[part] || typeof current[part] !== "object") {
          current[part] = {};
        }
        current = current[part];
      }
    }
  }
  return result;
}

/**
 * Stringifies data to Properties.
 * Flattens nested objects into dotted keys.
 * @param {any} data - The data to stringify.
 * @returns {string}
 */
function stringifyProperties(data) {
  const lines = [];

  function flatten(obj, prefix = "") {
    if (obj === null) {
      lines.push(`${prefix} = null`);
      return;
    }
    if (typeof obj !== "object") {
      lines.push(`${prefix} = ${String(obj)}`);
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (
        typeof value === "object" && value !== null && !Array.isArray(value)
      ) {
        flatten(value, fullKey);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          flatten(item, `${fullKey}.${index}`);
        });
      } else {
        let valStr = String(value);
        // Basic escapes for stringifier
        valStr = valStr
          .replace(/\n/g, "\\n")
          .replace(/\t/g, "\\t")
          .replace(/\r/g, "\\r");
        lines.push(`${fullKey} = ${valStr}`);
      }
    }
  }

  flatten(data);
  return lines.join("\n");
}

// --- TOML Parser ---

/**
 * Basic TOML parser.
 * Handles tables, nested keys, and basic types.
 * @param {string} toml - The TOML string.
 * @returns {any}
 */
function parseTOML(toml) {
  const result = {};
  let currentContext = result;
  const lines = toml.split(/\r?\n/);

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;

    // Handle Table Array [[table]]
    if (line.startsWith("[[") && line.endsWith("]]")) {
      const tableName = line.slice(2, -2).trim();
      const parts = tableName.split(".");
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          if (!Array.isArray(current[part])) {
            current[part] = [];
          }
          const newObj = {};
          current[part].push(newObj);
          currentContext = newObj;
        } else {
          if (!current[part]) current[part] = {};
          current = current[part];
        }
      }
      continue;
    }

    // Handle Table [table]
    if (line.startsWith("[") && line.endsWith("]")) {
      const tableName = line.slice(1, -1).trim();
      const parts = tableName.split(".");
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          if (!current[part] || typeof current[part] !== "object") {
            current[part] = {};
          }
          currentContext = current[part];
        } else {
          if (!current[part]) current[part] = {};
          current = current[part];
        }
      }
      continue;
    }

    // Handle key = value
    const match = line.match(/^(.+?)\s*=\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      const valueStr = match[2].trim();

      // Basic value parsing
      let value;
      if (valueStr.startsWith('"') && valueStr.endsWith('"')) {
        value = valueStr.slice(1, -1).replace(/\\"/g, '"').replace(
          /\\\\/g,
          "\\",
        );
      } else if (valueStr.startsWith("'") && valueStr.endsWith("'")) {
        value = valueStr.slice(1, -1);
      } else if (valueStr === "true") {
        value = true;
      } else if (valueStr === "false") {
        value = false;
      } else if (!isNaN(valueStr) && valueStr !== "") {
        value = Number(valueStr);
      } else if (valueStr.startsWith("[") && valueStr.endsWith("]")) {
        // Basic array parsing
        value = valueStr.slice(1, -1).split(",")
          .map((v) => v.trim())
          .filter((v) => v !== "")
          .map((v) => parseValue(v));
      } else {
        value = valueStr;
      }

      // Handle dotted keys within the context
      const keyParts = key.split(".");
      let target = currentContext;
      for (let i = 0; i < keyParts.length; i++) {
        const part = keyParts[i];
        if (i === keyParts.length - 1) {
          target[part] = value;
        } else {
          if (!target[part]) target[part] = {};
          target = target[part];
        }
      }
    }
  }
  return result;
}

/**
 * Basic TOML stringifier.
 * @param {any} data - The data to stringify.
 * @returns {string}
 */
function stringifyTOML(data) {
  let output = "";

  function isObject(val) {
    return typeof val === "object" && val !== null && !Array.isArray(val);
  }

  function formatValue(val) {
    if (typeof val === "string") {
      return `"${val.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    if (typeof val === "boolean") return String(val);
    if (typeof val === "number") return String(val);
    if (Array.isArray(val)) {
      if (val.length > 0 && isObject(val[0])) return null; // Array of tables
      return `[ ${val.map(formatValue).join(", ")} ]`;
    }
    return String(val);
  }

  // Root level key-values
  for (const [key, value] of Object.entries(data)) {
    if (
      !isObject(value) &&
      !(Array.isArray(value) && value.length > 0 && isObject(value[0]))
    ) {
      output += `${key} = ${formatValue(value)}\n`;
    }
  }

  // Sections
  function writeSection(obj, prefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(value) && value.length > 0 && isObject(value[0])) {
        // Array of tables
        for (const item of value) {
          output += `\n[[${fullKey}]]\n`;
          // Non-object properties
          for (const [k, v] of Object.entries(item)) {
            if (
              !isObject(v) &&
              !(Array.isArray(v) && v.length > 0 && isObject(v[0]))
            ) {
              output += `${k} = ${formatValue(v)}\n`;
            }
          }
          // Nested sections
          const nested = Object.fromEntries(
            Object.entries(item).filter(([_, v]) =>
              isObject(v) ||
              (Array.isArray(v) && v.length > 0 && isObject(v[0]))
            ),
          );
          writeSection(nested, fullKey);
        }
      } else if (isObject(value)) {
        output += `\n[${fullKey}]\n`;
        // Non-object properties
        for (const [k, v] of Object.entries(value)) {
          if (
            !isObject(v) &&
            !(Array.isArray(v) && v.length > 0 && isObject(v[0]))
          ) {
            const formatted = formatValue(v);
            if (formatted !== null) {
              output += `${k} = ${formatted}\n`;
            }
          }
        }
        // Nested sections
        const nested = Object.fromEntries(
          Object.entries(value).filter(([_, v]) =>
            isObject(v) || (Array.isArray(v) && v.length > 0 && isObject(v[0]))
          ),
        );
        writeSection(nested, fullKey);
      }
    }
  }

  const sections = Object.fromEntries(
    Object.entries(data).filter(([_, v]) =>
      isObject(v) || (Array.isArray(v) && v.length > 0 && isObject(v[0]))
    ),
  );
  writeSection(sections);

  return output.trim();
}
