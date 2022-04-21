export type CheckCVResponse = {
  fairCV: {
    cv: Record<string, Record<string, {
      txId: string | null,
      val: {
        root: {
          root: string,
          transactionNum: number
        }
      }
    }>>
  }
}

export type GetBlockInfoByTxIdResponse = {
  privateBlockHeader: {
    merkleRoot: string,
  }
}