import crypto from "crypto";

export interface MerkleProofItem {
  position: "left" | "right";
  hash: string;
}

export function sha256Hex(data: string): string {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

export function normalizeHex(hash: string): string {
  return hash.replace(/^0x/i, "").toLowerCase();
}

/**
 * Builds a cryptographic SHA-256 binary Merkle tree from an array of leaf hashes.
 * Returns the 0x-prefixed Merkle root and all tree levels.
 */
export function buildMerkleTree(leafHashes: string[]): {
  root: string;
  levels: string[][];
} {
  if (leafHashes.length === 0) {
    const emptyRoot = "0x" + sha256Hex("CERTCHAIN_EMPTY_TREE");
    return { root: emptyRoot, levels: [[emptyRoot]] };
  }

  const normalizedLeaves = leafHashes.map((h) => normalizeHex(h));
  const levels: string[][] = [normalizedLeaves];

  let currentLevel = normalizedLeaves;
  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
      const combined = sha256Hex(left + right);
      nextLevel.push(combined);
    }
    levels.push(nextLevel);
    currentLevel = nextLevel;
  }

  return {
    root: "0x" + currentLevel[0],
    levels,
  };
}

/**
 * Generates the Merkle proof path for a leaf at `leafIndex`.
 */
export function getMerkleProof(
  leafHashes: string[],
  leafIndex: number
): MerkleProofItem[] {
  const { levels } = buildMerkleTree(leafHashes);
  const proof: MerkleProofItem[] = [];
  let idx = leafIndex;

  for (let level = 0; level < levels.length - 1; level++) {
    const currentLevel = levels[level];
    const isRightNode = idx % 2 === 1;
    const siblingIdx = isRightNode ? idx - 1 : idx + 1;
    const siblingHash =
      siblingIdx < currentLevel.length
        ? currentLevel[siblingIdx]
        : currentLevel[idx];

    proof.push({
      position: isRightNode ? "left" : "right",
      hash: "0x" + siblingHash,
    });

    idx = Math.floor(idx / 2);
  }

  return proof;
}
