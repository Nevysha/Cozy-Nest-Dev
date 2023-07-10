import React from "react";
import {createRoot} from "react-dom/client";
import {App} from "@rework/App";
import {ChakraProvider} from '@chakra-ui/react'
import {theme} from "../chakra/chakra-theme.ts";
import { ConfigProvider } from './ConfigContext';


export function startCozyNest() {
  document.addEventListener("DOMContentLoaded", function() {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    try {
      gradioApp()?.append(root);
    } catch {
      document.querySelector('gradio-app')?.append(root);
    }
    const client = createRoot(root);
    client.render(
      <React.StrictMode>
        <ConfigProvider>
          {/*<ChakraProvider theme={theme} >*/}
            <App />
          {/*</ChakraProvider >*/}
        </ConfigProvider>
      </React.StrictMode>,
    );
  })
}
