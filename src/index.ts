// Module '"crypto"' has no default export.
import crypto from "crypto"
// import * as crypto from "crypto"

interface BlockShape {
  hash: string
  prevHash: string
  height: number
  data: string
}

class Block implements BlockShape {
  public hash: string
  constructor(
    // no readonly => 접근 및 수정 가능
    public readonly prevHash: string,
    public readonly height: number,
    public readonly data: string
  ) {
    this.hash = Block.calculateHash(prevHash, height, data)
  }

  static calculateHash(prevHash: string, height: number, data: string) {
    const toHash = `${prevHash}${height}${data}`
    return crypto.createHash("sha256").update(toHash).digest("hex")
  }
}

class BlockChain {
  private blocks: Block[]
  constructor() {
    this.blocks = []
  }

  private getPrevHash() {
    if(this.blocks.length === 0) return ''
    return this.blocks[this.blocks.length-1].hash
  }
  public addBlock(data: string) {
    const block = new Block(this.getPrevHash(), this.blocks.length+1, data)
    this.blocks.push(block)
  }
  public getBlocks() {
    // this.blocks => 접근 및 수정 가능
    return [...this.blocks]
  }
}

const blockchain = new BlockChain()

blockchain.addBlock('first one')
blockchain.addBlock('second one')
blockchain.addBlock('third one')

// 보안 취약 경우1
// getBlocks() { return this.blocks } 라면, 아래 해킹된 블럭 추가됨
blockchain.getBlocks().push(new Block('xxx', 111, 'hacked'))

// 보안 취약 경우2
// Block constructor(public property: type) 라면, data 접근 가능
// blockchain.getBlocks()[blockchain.getBlocks().length-1].data = 'hellllll'

blockchain.addBlock('fourth one')

console.log(blockchain.getBlocks());
