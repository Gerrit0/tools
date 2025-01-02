"use strict";
(() => {
  // src/copy.ts
  function stripCopy(text) {
    return text.split("\n").slice(0, -2).join("\n");
  }

  // src/tools.ts
  var tools = [
    {
      name: "Sort lines",
      transform: (text) => text.split("\n").sort((a, b) => a.localeCompare(b, "standard", { sensitivity: "base" })).join("\n"),
      placeholder: "b\na"
    },
    {
      name: "Unique lines",
      transform: (text) => {
        const seen = /* @__PURE__ */ new Set();
        const result = [];
        for (const line of text.split("\n")) {
          if (seen.has(line)) continue;
          seen.add(line);
          result.push(line);
        }
        return result.join("\n");
      },
      placeholder: "a\nb\na"
    },
    {
      name: "Strip Kindle Copy",
      transform: stripCopy,
      placeholder: ""
    }
  ];

  // src/index.ts
  var select = document.querySelector("select");
  var input = document.querySelector("textarea");
  var output = document.querySelector(".right");
  var copyBox = document.querySelector("input[type=checkbox]");
  var copyButton = document.querySelector("button");
  var transform = tools[0].transform;
  for (const tool of tools) {
    const option = select.appendChild(document.createElement("option"));
    option.textContent = tool.name;
    option.value = tool.name;
  }
  navigator.clipboard.readText().then((text) => input.value = text).catch(console.error);
  select.value = tools[0].name;
  selectTool(tools[0]);
  select.addEventListener("change", () => {
    selectTool(tools.find((t) => t.name === select.value));
  });
  input.addEventListener("input", runTransform);
  function selectTool(tool) {
    input.placeholder = tool.placeholder;
    transform = tool.transform;
    runTransform();
  }
  function runTransform() {
    try {
      output.textContent = transform(input.value);
      if (copyBox.checked) {
        navigator.clipboard.writeText(output.textContent).catch(console.error);
      }
    } catch (err) {
      output.textContent = err.message;
    }
  }
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(output.textContent || "").catch(console.error);
  });
})();
