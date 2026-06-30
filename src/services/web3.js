import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import { SERVER_WALLET } from "../constants/serverWallet";

const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831fc7";
const MAINNET_CHAIN_ID = 1;

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export function hasWalletProvider() {
  return typeof window !== "undefined" && Boolean(window.ethereum);
}

export async function ensureMainnet(provider) {
  const network = await provider.getNetwork();
  if (Number(network.chainId) === MAINNET_CHAIN_ID) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
  } catch (error) {
    if (error.code === 4902) {
      throw new Error("Add Ethereum Mainnet to your wallet, then try again.");
    }
    throw new Error("Switch to Ethereum Mainnet to deposit and bet.");
  }
}

export async function connectWallet() {
  if (!hasWalletProvider()) {
    throw new Error("Install MetaMask or another Web3 wallet to continue.");
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  await ensureMainnet(provider);

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
}

export async function getWalletUsdtBalance(provider, address) {
  const contract = new Contract(USDT_ADDRESS, ERC20_ABI, provider);
  const decimals = await contract.decimals();
  const raw = await contract.balanceOf(address);
  return Number(formatUnits(raw, decimals));
}

export async function sendUsdtDeposit(signer, amountUsdt) {
  const contract = new Contract(USDT_ADDRESS, ERC20_ABI, signer);
  const decimals = await contract.decimals();
  const parsed = parseUnits(String(amountUsdt), decimals);
  const tx = await contract.transfer(SERVER_WALLET, parsed);
  const receipt = await tx.wait();

  return {
    hash: receipt.hash,
    amount: Number(amountUsdt),
  };
}

export async function sendEthDeposit(signer, amountEth) {
  const tx = await signer.sendTransaction({
    to: SERVER_WALLET,
    value: parseUnits(String(amountEth), 18),
  });
  const receipt = await tx.wait();
  return {
    hash: receipt.hash,
    amount: Number(amountEth),
  };
}

export async function fundAccount(amountUsdt) {
  const { provider, signer, address } = await connectWallet();
  const walletBalance = await getWalletUsdtBalance(provider, address);

  if (walletBalance < amountUsdt) {
    throw new Error(
      `Insufficient USDT in wallet. You have ${walletBalance.toFixed(2)} USDT, need ${amountUsdt} USDT.`
    );
  }

  const transfer = await sendUsdtDeposit(signer, amountUsdt);
  return { address, ...transfer };
}
