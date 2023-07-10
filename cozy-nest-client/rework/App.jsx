import React, {Profiler, Suspense, useEffect, useRef, useState} from "react";
import '@rework/variables.css';
import '@rework/overload-native.scss';
import '@rework/Loading.scss';
import Loader from "react-spinners/CircleLoader";
import EventEmitter from 'eventemitter3';
import {Layout} from "@rework/Layout";
import {getTheme, hideNativeUiExtraNetworkElement, removeExistingCss} from "@main/cozy-utils";
import {CozyLogger} from "@main/CozyLogger";
import {useConfig} from "@rework/ConfigContext";
import SimpleTimer from "@main/SimpleTimer";
import {COZY_NEST_DOM_TWEAK_LOAD_DURATION, COZY_NEST_GRADIO_LOAD_DURATION} from "@main/Constants";

function Loading() {

  const config = JSON.parse(localStorage.getItem('COZY_NEST_CONFIG'))
  const color = config['accent_color'] || '#36d7b7'

  const maybeLightThemeClass = getTheme(config) === "light" ? "nevysha-light" : ""

  return (
    <div className="CozyNestLoading">
      <div id='nevysha-loading-wrap' className={`nevysha ${maybeLightThemeClass}`}>
        <div id='nevysha-loading' className='nevysha'>
          <div className="nevysha-loading-progress">
            <div className="nevysha-cozy-nest-app-name animate__animated animate__backInLeft">
              Cozy Nest
            </div>
            <Loader color={color} className="Loader" size={window.innerHeight / 2} />
            <div className="subtext1 animate__animated animate__pulse animate__infinite">
              Loading The Magic
            </div>
            <div className="subtext2 animate__animated animate__pulse animate__infinite">
              (and gradio)
            </div>

          </div>
          <div id='nevy_waves'>
            <div className='wave'></div>
            <div className='wave'></div>
            <div className='wave'></div>
          </div>
          <div className="footer">Made by Nevysha with <span className="heart">❤</span> and <span
            className="coffee">☕</span></div>
        </div>
      </div>
    </div>
  );
}

function TweaksNative({children}) {


  function hideNevyshaTabButton() {
    const buttonWithText =
      Array.from(document.getElementsByTagName('button'))
        .filter(button => button.innerText === 'Nevysha Cozy Nest')[0];

    buttonWithText && (buttonWithText.style.display = 'none');
  }

  function addCozyFlexClass() {
    const gRows = document.querySelectorAll('.gradio-row');
    gRows.forEach(element => {
      element.classList.add('cn-flex-row');
    });

    //gradio-column
    const gCols = document.querySelectorAll('.gradio-column');
    gCols.forEach(element => {
      element.classList.add('cn-flex-column');
    });
  }

  useEffect(() => {
    hideNevyshaTabButton();
    addCozyFlexClass();

    hideNativeUiExtraNetworkElement('txt2img')
    hideNativeUiExtraNetworkElement('img2img')

    CozyLogger.debug('TweaksNative')
  }, [])

  return children
}

class LoadingEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.hasEmitted = []
  }

  emit(event, ...args) {
    CozyLogger.debug(`LoadingEventBus: ${event}`)
    this.hasEmitted.push(event);
    return super.emit(event, ...args);
  }

  has(event) {
    return this.hasEmitted.includes(event);
  }
}

export const LoadingEventBus = new LoadingEventEmitter();

export function App() {

  const [loading, setLoading] = useState(true);
  const [gradioUILoading, setGradioUILoading] = useState(true);
  const config = useConfig();

  const [ready, setReady] = useState(false);

  useEffect(() => {

    removeGradioLoading();

    if (LoadingEventBus.has('cozy-nest-loaded')) {
      removeExistingCss();
      setLoading(false);
    }

    onUiLoaded(() => {
      removeExistingCss();
      setGradioUILoading(false)
    });

    LoadingEventBus.on('cozy-nest-loaded', () => {
      removeExistingCss();
      setLoading(false);
    });

    return () => {
      LoadingEventBus.off('cozy-nest-loaded');
    }

  }, [])

  useEffect(() => {

    if (gradioUILoading || loading || !config) return;
    CozyLogger.debug('App ready')
    SimpleTimer.end(COZY_NEST_GRADIO_LOAD_DURATION);
    SimpleTimer.time(COZY_NEST_DOM_TWEAK_LOAD_DURATION);
    setReady(true)

  }, [gradioUILoading, loading, config])

  function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
    // const profilingData = {
    //   id,
    //   phase,
    //   actualDuration,
    //   baseDuration,
    //   startTime,
    //   commitTime,
    // };
    //
    // console.table(profilingData);
  }

  function removeGradioLoading() {
    document.body.setAttribute('style', '');
  }

  return (
    <Suspense fallback={<Loading />}>
      {!ready ? <Loading /> :
        (
          <Profiler id="App" onRender={onRender}>
            <TweaksNative>
              <Layout />
            </TweaksNative>
          </Profiler>
        )}
    </Suspense>
  );
}
