import 'animate.css';
import '@fontsource-variable/caveat';
import sheet from '../static/cozy-nest-style.css?inline' assert { type: 'css' };
import cozyNestModuleLoader, {fetchCozyNestConfig} from '@main/nevysha-cozy-nest.js'
import SimpleTimer from "@main/SimpleTimer.js";
import {COZY_NEST_GRADIO_LOAD_DURATION, WEBUI_SDNEXT} from "@main/Constants.js";
import {CozyLogger} from "@main/CozyLogger.js";
import {startCozyNestImageBrowser} from "@image-browser/main.jsx";
import {checkClientEnv, patchCozyNestForSdNext} from '@main/cozy-utils.js';
import {hasCozyNestNo} from "@main/cozy-utils-standalone.js";
import startCozyPrompt from "@cozy-prompt/main.jsx";
import {startExtraNetwork} from "@extra-network/main.jsx";
import {OverrideUiJs} from "@main/override_ui.js";
import CozyNestEventBus from "@main/CozyNestEventBus.js";
import {startCozyExtraNetwork} from "@cozy_extra_network/main.jsx";
import CozyModal from './modal/Module.jsx';
import {LoadingEventBus} from "@rework/App";
import {startCozyNest} from "@rework/main";
import {removeExistingCss} from "@rework/script/pruneStyle";
window.CozyTools = {
  stop:() => setTimeout(function(){debugger;}, 5000),
  removeExistingCss: removeExistingCss,
}

export async function _cozyNestLoader()  {

  await fetchCozyNestConfig();

  if (COZY_NEST_CONFIG.webui === WEBUI_SDNEXT) {
    patchCozyNestForSdNext();
  }

  await cozyNestModuleLoader(async () => {
    // startCozyNestSettings();

    if (COZY_NEST_CONFIG.enable_cozy_prompt === true) {
      await startCozyPrompt('txt2img_prompt', 'cozy_nest_prompt_txt2img', 'txt2img');
      await startCozyPrompt('img2img_prompt', 'cozy_nest_prompt_img2img', 'img2img');

      OverrideUiJs.override_confirm_clear_prompt();
    }
    if (COZY_NEST_CONFIG.enable_extra_network_tweaks === true) {
      await startExtraNetwork('txt2img')
      await startExtraNetwork('img2img')
    }
    if (COZY_NEST_CONFIG.enable_cozy_extra_networks === true) {
      await startCozyExtraNetwork()
    }

    startCozyNestImageBrowser();

    // load modal module
    await CozyModal.prepareReactHost();

    CozyNestEventBus.emit('cozy-nest-loaded');
    LoadingEventBus.emit('cozy-nest-loaded');
  });

  setTimeout(checkClientEnv, 1000); // small timer just for UX purposes
}

export default async function cozyNestLoader()  {
  CozyLogger.warn('mocked legacy start')
  CozyNestEventBus.emit('cozy-nest-loaded');
  LoadingEventBus.emit('cozy-nest-loaded');
}

window.cozyNestLoader = cozyNestLoader;

(async () => {
  if (hasCozyNestNo()) {
    return
  }

  // const styleSheet = new CSSStyleSheet();
  // styleSheet.replaceSync(sheet);
  // document.adoptedStyleSheets = [styleSheet];

  onUiLoaded(() => {
    LoadingEventBus.emit('gradio-ui-loaded');
  });

  SimpleTimer.time(COZY_NEST_GRADIO_LOAD_DURATION);

  startCozyNest();

  if (import.meta.env.VITE_CONTEXT === 'DEV') {
    CozyLogger.debug('DEV MODE');
    document.addEventListener("DOMContentLoaded", function() {
      cozyNestLoader();
    })
  }
})();




