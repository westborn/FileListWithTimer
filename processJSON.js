function processJSON() {
  const fileTree = readFile('Communications folder-scanner.json')
  if (!fileTree) return
  const fs = new FileStructure()
  fs.import(fileTree)
  const { tree } = fs
  const rootId = tree.root.id
  Object.entries(tree).map(([key, item]) => {
    console.log(`Folder is:${getParentFolder(item, '', rootId, tree)}${item.name}`)
  })
}

function getParentFolder(fsEntry, str, rootId, tree) {
  if (fsEntry.parent === rootId) {
    return `${tree.root.name}\\${str}`
  }
  if (fsEntry.parent === null) {
    return str
  }
  str = `${tree[fsEntry.parent].name}\\${str}`
  return getParentFolder(tree[fsEntry.parent], str, rootId, tree)
}
