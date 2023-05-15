import { EtherscanProvider, Interface } from "ethers";
import ABI from "./disciplina_abi.json";

export const etherscan = new EtherscanProvider(process.env.ETHERSCAN_NETWORK);
export const contractInterface = new Interface(ABI);

export const getContractTxById = async (txId) => {
    const tx = await etherscan.getTransaction(txId);    
    return {
        sender: tx.from,
        parsed: contractInterface.parseTransaction(tx),
    }
}