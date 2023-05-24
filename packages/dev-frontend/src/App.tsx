import React from "react";
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import { Flex, Spinner, Heading, ThemeProvider, Paragraph, Link } from "theme-ui";
import Web3ReactManager from "./components/Web3ReactManager"
import { Global, css } from "@emotion/react";
import { LiquityProvider } from "./hooks/LiquityContext";
import { TransactionProvider } from "./components/Transaction";
import { Icon } from "./components/Icon";
import { getConfig } from "./config";
import theme from "./theme";
import { ethers } from 'ethers'
import { Warning } from "./components/Warning";

import { LiquityFrontend } from "./LiquityFrontend";


// Start pre-fetching the config
getConfig().then(config => {
  // console.log("Frontend config:");
  // console.log(config);
  Object.assign(window, { config });
});

const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK')

function getLibrary(provider: any) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 10000
  return library
}

const UnsupportedMainnetFallback: React.FC = () => (
  <Flex
    sx={{
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center"
    }}
  >
    <Heading sx={{ mb: 3 }}>
      <Icon name="exclamation-triangle" /> This app is for testing purposes only.
    </Heading>

    <Paragraph sx={{ mb: 3 }}>
      Please change your network to Ropsten, Rinkeby, Kovan, Görli or Kiln.
    </Paragraph>

    <Paragraph>
      If you'd like to use the Liquity Protocol on mainnet, please pick a frontend{" "}
      <Link href="https://www.liquity.org/frontend">
        here <Icon name="external-link-alt" size="xs" />
      </Link>
      .
    </Paragraph>
  </Flex>
);

const App = () => {
  const loader = (
    <Flex sx={{ alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Spinner sx={{ m: 2, color: "text" }} size="32px" />
      <Heading>Loading...</Heading>
    </Flex>
  );

  const unsupportedNetworkFallback = () => (
    <Flex
      sx={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center"
      }}
    >
      <Warning>
        Opal is not yet deployed to this network. Please switch to Piccadilly.
      </Warning>      
    </Flex>
  );

  return (
    <ThemeProvider theme={theme}>
    <Global
          styles={css`
          @font-face {
            font-family: "Visby CF";
            src: url("./fonts/VisbyCF-Regular.woff2") format("woff2");
            font-style: normal;
            font-weight: 400;
          }
          @font-face {
            font-family: "Visby CF";
            src: url("./fonts/VisbyCF-Heavy.woff2") format("woff2");
            font-style: normal;
            font-weight: 600;
          }
          `}
        />
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Web3ReactManager fallback={unsupportedNetworkFallback}>
            <LiquityProvider
              loader={loader}
              unsupportedNetworkFallback={unsupportedNetworkFallback}
              unsupportedMainnetFallback={<UnsupportedMainnetFallback />}
            >
              <TransactionProvider>
                <LiquityFrontend loader={loader} />
              </TransactionProvider>
            </LiquityProvider>
          </Web3ReactManager>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </ThemeProvider>
  );
};

export default App;
