import { tools, Tool } from './tools'

const select = document.querySelector('select')!
const input = document.querySelector('textarea')!
const output = document.querySelector('.right') as HTMLDivElement
const copyBox = document.querySelector('input[type=checkbox]') as HTMLInputElement

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

declare global {
  interface Navigator {
    clipboard: {
      writeText (text: string): Promise<string>,
      readText (): Promise<string>
    }
  }
}

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
