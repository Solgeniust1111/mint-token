import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  TokenStandard,
  createAndMint,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { secret } from "./config";
import bs58 from "bs58";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const umi = createUmi(new Connection(clusterApiUrl("devnet"), "confirmed")); //Replace with your QuickNode RPC Endpoint

const userWallet = umi.eddsa.createKeypairFromSecretKey(bs58.decode(secret));

console.log("userWallet----->", userWallet);
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const metadata = {
  name: "xyz",
  symbol: "_0_",
  uri: "https://arweave.net/0qUGUIrmXCu-N6lUQZTuSPSsaCF9bK7Y19GvgAjuBIY",
};
// create mint
const mint = generateSigner(umi);
const sol = new PublicKey("So11111111111111111111111111111111111111112");
//
umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata());

createAndMint(umi, {
  mint,
  authority: umi.identity,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 6,
  amount: 1000_000_000_000000,
  tokenOwner: userWallet.publicKey,
  tokenStandard: TokenStandard.Fungible,
})
  .sendAndConfirm(umi)
  .then(() => {
    console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
  })
  .catch((err) => {
    console.error("Error minting tokens:", err);
  });
