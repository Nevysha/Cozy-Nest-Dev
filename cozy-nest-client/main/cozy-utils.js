import {CozyLogger} from "./CozyLogger.js";
import DOM_IDS from "./dom_ids.js";
import CozyModal from "./modal/Module.jsx";

export const getTheme = (modeFromConfig) => {
  modeFromConfig = modeFromConfig || COZY_NEST_CONFIG.color_mode

  return modeFromConfig;
}

export const hexToRgb = (hex) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r} ${g} ${b}`;
}

export const isUpToDate = (current, remote) => {
  const v1 = current.split('.');
  const v2 = remote.split('.');

  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const num1 = parseInt(v1[i]) || 0;
    const num2 = parseInt(v2[i]) || 0;

    if (num1 < num2) {
      return false;
    } else if (num1 > num2) {
      return true;
    }
  }

  return true;  // Both versions are equal
}

export const getLuminance = (hexcolor) => {
  // remove # character from hex color string
  const hex = hexcolor.replace('#', '');

  // convert hex color to RGB values
  const r = parseInt(hex.substr(0,2),16);
  const g = parseInt(hex.substr(2,2),16);
  const b = parseInt(hex.substr(4,2),16);

  // calculate the relative luminance of the color
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

export function findNearestParent(element, selector) {
  let parent = element.parentElement;

  while (parent !== null) {
    if (parent.matches(selector)) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return null;
}

const COLOR_BRIGHTNESS_FACTOR = 0.75;
export const getSubduedFontColor = (hexCode) => {
  // Remove the '#' symbol if present
  hexCode = hexCode.replace('#', '');

  // Convert the hex code to RGB values
  const red = parseInt(hexCode.substr(0, 2), 16);
  const green = parseInt(hexCode.substr(2, 2), 16);
  const blue = parseInt(hexCode.substr(4, 2), 16);

  // Decrease the brightness by reducing the RGB values
  const decreasedRed = Math.floor(red * COLOR_BRIGHTNESS_FACTOR);
  const decreasedGreen = Math.floor(green * COLOR_BRIGHTNESS_FACTOR);
  const decreasedBlue = Math.floor(blue * COLOR_BRIGHTNESS_FACTOR);

  // Convert the decreased RGB values back to hex
  return `rgb(${decreasedRed},${decreasedGreen},${decreasedBlue})`;
}

export function hideNativeUiExtraNetworkElement(prefix) {
  const triggerButton = document.querySelector(`button#${DOM_IDS.get('extra_networks_btn')(prefix)}`)
  triggerButton.style.display = 'none'
  const tabs = document.querySelector(`div#${prefix}_extra_networks`)
  tabs.style.display = 'none';
}

export function checkClientEnv() {
  //legacy : check if url contains __theme which is deprecated
  if (window.location.href.includes('__theme')) {
    CozyModal.showToast(
      'warning',
      "Warning",
      "The __theme parameter is deprecated for CozyNest. Please remove it from URL and use Cozy Nest settings instead.",
    )
  }
  // check for gradio theme (vlad's fork)
  if (document.querySelector('#setting_gradio_theme input')) {
    const gradioTheme = document.querySelector('#setting_gradio_theme input').value
    if (gradioTheme !== 'gradio/default' && gradioTheme !== '' && gradioTheme !== 'Default') {
      CozyModal.showToast(
        'error',
        'Incompatible theme',
        'Cozy Nest may not be compatible with this theme. Please switch to the default theme. You can do this by going to the settings tab and selecting "gradio/default" or "Default" from the dropdown menu under "User interface > UI theme".',
        90000
      )
    }
  }
}

export function patchCozyNestForSdNext() {
  //add sdnext css
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = import.meta.env.VITE_CONTEXT === 'DEV' ?
    '/cozy-nest-client/static/cozy-nest-style-sdnext.css'
    :'/cozy-nest-client/assets/cozy-nest-style-sdnext.css';
  document.head.appendChild(link);
}

export function removeExistingCss() {
  // Get the base URL
  const baseUrl = window.location.origin;

  // Get all link elements in the header
  const linkElements = document.querySelectorAll('link[rel="stylesheet"]');

  // Filter the link elements whose href starts with the base URL followed by "/assets"
  const svelteLinkElements = Array.from(linkElements).filter(link =>
    link.href.startsWith(`${baseUrl}/assets`)
  );

  // Remove the matching link elements from the header
  CozyLogger.debug(`Removing ${svelteLinkElements.length} Svelte CSS links`)
  svelteLinkElements.forEach(link => link.parentNode.removeChild(link));

  // http://127.0.0.1:5173/file=style.css

  // Filter the default link elements whose href starts with the base URL followed by "/file=style.css"
  const defaultLinkElements = Array.from(linkElements).filter(link =>
    link.href.startsWith(`${baseUrl}/file=style.css`) ||
    link.href.startsWith(`file=style.css`) ||
    link.href.startsWith(`${baseUrl}/theme.css`) ||
    link.href.startsWith(`theme.css`)
  );
  CozyLogger.debug(`Removing ${defaultLinkElements.length} default CSS links`)
  defaultLinkElements.forEach(link => link.parentNode.removeChild(link));

  document.querySelectorAll('div').forEach(l => l.style.minWidth = '');
  document.querySelectorAll('div').forEach(l => l.style.flexGrow = '');
}

window.removeExistingCss = removeExistingCss;

export const findClassStartingWith = (element, prefix) => [...element.classList].find(className => className.startsWith(prefix));
