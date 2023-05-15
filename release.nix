{ witnessUrl ? "https://validator.watches.disciplina.io"
, etherscanNetwork ? "sepolia"
, dscpContractAddr ? "0xd25dB49fa9f9b27Ffe7B016395CEC704Ca650a8F"
, buildYarnPackage
, parallel
, brotli
}:

buildYarnPackage {
  WITNESS_API_URL = witnessUrl;
  ETHERSCAN_NETWORK = etherscanNetwork;
  DSCP_CONTRACT_ADDR = dscpContractAddr;
  src = ./.;

  buildInputs = [ parallel brotli ];

  postBuild = ''
    find build/ -type f \
      -not -name '*.jpg' \
      -not -name '*.png' \
      -not -name '*.webp' \
      -not -name '*.woff' \
      -not -name '*.woff2' | parallel brotli
  '';

  yarnBuildMore = "yarn build";
  installPhase = "mv build $out";
}
