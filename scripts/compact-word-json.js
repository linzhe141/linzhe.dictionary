import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 当前文件路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function main() {
  const dirPath = path.resolve(__dirname, '../public/words')
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.json'))

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    const raw = fs.readFileSync(filePath, 'utf-8')

    try {
      const json = JSON.parse(raw)
      const compressed = JSON.stringify(json) // 默认就是压缩成一行
      fs.writeFileSync(filePath, compressed, 'utf-8')
      console.log(`Compressed: ${file}`)
    } catch (err) {
      console.error(`Failed to process ${file}:`, err)
    }
  })
}

main()
