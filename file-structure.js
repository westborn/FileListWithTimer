// jshint esversion: 9
// jshint laxbreak: true
class Folder {
  constructor(options) {
    let { id, isRoot = false } = options

    const folder = DriveApp.getFolderById(id)
    const subfolders = []
    const files = []

    let parent = null
    try {
      parent = isRoot ? null : folder.getParents().next().getId()
    } catch {
      parent = null
    }

    const name = folder.getName()
    console.log(`Folder: ${name}`)

    const _subfolders = folder.getFolders()
    const _files = folder.getFiles()

    while (_subfolders.hasNext()) {
      subfolders.push(_subfolders.next().getId())
    }

    while (_files.hasNext()) {
      const _id = _files.next().getId()
      const _file = new File(_id)
      files.push(_file.options)
    }
    return { id, name, parent, subfolders, files }
  }
}

class File {
  constructor(id) {
    const file = DriveApp.getFileById(id)
    const name = file.getName()
    const path = file.getParents().next().getName()
    const owner = file.getOwner() ? file.getOwner().getEmail() : 'No Owner'
    const mimeType = file.getMimeType()
    const size = file.getSize()
    const created = file.getDateCreated()
    const lastUpdated = file.getLastUpdated()
    this.options = { name, path, owner, mimeType, size, created, lastUpdated, id }
    return this
  }
}

class FileStructure {
  constructor(rootId) {
    if (FileStructure.instance) return FileStructure.instance
    const root = !!rootId ? new Folder({ id: rootId, isRoot: true }) : null

    this.tree = {
      root,
    }

    this.timer = new Timer()
    this.timer.start()
    this.threshold = 5 * 60 * 1000 // 5 minutes
    // this.threshold = 2 * 60 * 1000  // 2 minutes

    FileStructure.instance = this
    return FileStructure.instance
  }

  addFolder(folderObj) {
    if (this.tree && this.tree.root && this.tree.root.id === folderObj.id) {
      return
    }
    this.tree[folderObj.id] = folderObj
    return this
  }

  import(fs) {
    this.tree = fs.tree
    return this
  }
}
