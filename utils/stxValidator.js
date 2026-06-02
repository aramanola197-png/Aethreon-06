function validateStacksAddress(address) {
    if (!address || typeof address !== 'string') return false;

    // Clean up empty spaces and split out any attached contract identifiers (.smart-contract)
    const baseAddress = address.trim().split('.')[0];

    // Broadened regex to support standard mainnet (SP) and testnet (ST) formats
    const stxRegex = /^(SP|ST)[0-9A-HJ-NP-Z]{26,40}$/i;
    return stxRegex.test(baseAddress);
}

module.exports = { validateStacksAddress };
