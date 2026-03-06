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
  sourceFormat.addEventListener("change", performConversion);
  targetFormat.addEventListener("change", performConversion);

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
      sourceText.value = text;
      performConversion();
    }
  });

  copyBtn?.addEventListener("click", () => {
    copyToClipboard(targetText.value);
  });
}

/**
 * Parses the input string based on the format.
 * @param {string} input - The raw input string.
 * @param {string} format - The format (json, yaml, xml).
 * @returns {any} - The parsed JavaScript object.
 */
function parseData(input, format) {
  switch (format) {
    case "json":
      return JSON.parse(input);
    case "yaml":
      return parseYAML(input);
    case "xml":
      return parseXML(input);
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
function stringifyData(data, format) {
  switch (format) {
    case "json":
      return JSON.stringify(data, null, 2);
    case "yaml":
      return stringifyYAML(data);
    case "xml":
      return stringifyXML(data);
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
  let currentObject = result;
  const stack = [{ obj: result, indent: -1 }];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const indent = line.search(/\S/);
    const [key, ...valueParts] = trimmed.split(":");
    const value = valueParts.join(":").trim();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }
    currentObject = stack[stack.length - 1].obj;

    if (value === "") {
      // It's a nested object or array start
      const newObj = {};
      currentObject[key.trim()] = newObj;
      stack.push({ obj: newObj, indent: indent });
    } else if (trimmed.startsWith("-")) {
      // It's an array item (very basic)
      // Real YAML parsing is hard, let's try a slightly better approach if possible
    } else {
      currentObject[key.trim()] = parseValue(value);
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
          parent.setAttribute(attrName, attrValue);
        }
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          const child = doc.createElement(key);
          parent.appendChild(child);
          buildXML(child, item);
        }
      } else {
        const child = doc.createElement(key);
        parent.appendChild(child);
        buildXML(child, value);
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
