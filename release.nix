{ witnessUrl ? null
, subgraphApiUrl ? "https://api.thegraph.com/subgraphs/name/hbb228/disciplina-indexer"
, buildYarnPackage
, parallel
, brotli
}:

buildYarnPackage {
  WITNESS_API_URL = witnessUrl;
  SUBGRAPH_API_URL = subgraphApiUrl;
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
