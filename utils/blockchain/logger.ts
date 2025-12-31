import { ethers } from "ethers";
import crypto from "crypto";

const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "";
const privateKey = process.env.AUDITOR_PRIVATE_KEY || "";
const contractAddress = process.env.PURCHASELOG_CONTRACT_ADDRESS || "";

const ABI = [
  "event PurchaseLogged(uint256 indexed id, bytes32 purchaseHash, uint256 timestamp)",
  "function logPurchase(bytes32 purchaseHash) external returns (uint256 id)",
];

export const computePayloadHash = (payload: any) => {
  const json = JSON.stringify(payload);
  const hash = crypto.createHash("sha256").update(json).digest("hex");
  return { hashHex: `0x${hash}`, json };
};

export async function logPurchaseOnChain(payloadHash: string) {
  if (!rpcUrl || !privateKey || !contractAddress) {
    throw new Error("Blockchain env missing");
  }
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, ABI, wallet);
  const tx = await contract.logPurchase(payloadHash);
  const receipt = await tx.wait();
  return receipt?.hash as string;
}
