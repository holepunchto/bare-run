import Bundle from 'bare-bundle'
import Module from 'bare-module'
import { pathToFileURL } from 'bare-url'
import path from 'bare-path'
import fs from 'bare-fs'
import unpack from 'bare-unpack'

const [, filename] = Bare.argv

const root = path.dirname(filename)

const bundle = Bundle.from(await fs.readFile(filename))

const id = bundle.id

const repacked = await unpack(
  bundle,
  {
    files: false,
    addons: true,
    assets: true
  },
  async (key) => {
    const target = path.join(root, id, key)

    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, bundle.read(key))

    return pathToFileURL(target)
  }
)

Module.load(pathToFileURL(filename), repacked)
