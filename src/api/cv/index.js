import HttpService from '../../Modules/Http';
import { getContractTxById } from '../../Modules/Etherscan';
import { CheckCVResponse, GetBlockInfoByTxIdResponse } from './types.js';

const checkCV = (file: File): Promise<CheckCVResponse> => (
  HttpService.post(
    '/checkcv-pdf',
    file,
    {
      headers:
      {
        'Content-Type': 'application/pdf',
      }
    })
)

const getBlockInfoByTxId = async (txId: string): Promise<GetBlockInfoByTxIdResponse> => {
  const { sender, parsed } = await getContractTxById(txId);

  console.log(sender, parsed);

  if (parsed.name !== 'submitHeader') {
    throw new Error('Invalid transaction type');
  }

  const prevHash = parsed.args[0];
  const merkleRoot = parsed.args[1];
  const transactionNum = parsed.args[2];
  return { prevHash, merkleRoot, transactionNum, sender };
}

export const CVApi = { checkCV, getBlockInfoByTxId }