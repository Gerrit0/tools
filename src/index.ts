import { tools, Tool } from './tools'

const select = document.querySelector('select')!
const input = document.querySelector('textarea')!
const output = document.querySelector('.right') as HTMLDivElement
const copyBox = document.querySelector('input[type=checkbox]') as HTMLInputElement
const copyButton = document.querySelector('button')!

let transform: (input: string) => string = tools[0].transform

for (const tool of tools) {
  const option = select.appendChild(document.createElement('option'))
  option.textContent = tool.name
  option.value = tool.name
}

navigator.clipboard.readText().then(text => input.value = text).catch(console.error)
select.value = tools[0].name
selectTool(tools[0])
select.addEventListener('change', () => {
  selectTool(tools.find(t => t.name === select.value)!)
})

input.addEventListener('input', runTransform)

function selectTool (tool: Tool) {
  input.placeholder = tool.placeholder
  transform = tool.transform
  runTransform()
}

function runTransform () {
  try {
    output.textContent = transform(input.value)
    if (copyBox.checked) {
      navigator.clipboard.writeText(output.textContent).catch(console.error)
    }
  } catch (err) {
    output.textContent = err.message
  }
}

copyButton.addEventListener('click', () => {
  navigator.clipboard.writeText(output.textContent || '').catch(console.error)
})
