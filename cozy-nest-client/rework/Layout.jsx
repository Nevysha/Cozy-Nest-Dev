import React, {useEffect, useState} from "react";
import './Layout.scss'
import {Menu} from "@rework/Menu";
import {Require, RequireAll} from "@rework/Require";
import {Selector} from "@rework/Selector";
import SimpleTimer from "@main/SimpleTimer";
import {COZY_NEST_DOM_TWEAK_LOAD_DURATION} from "@main/Constants";
import {Any2Img} from "@rework/Any2Img";

export function Layout() {

  useEffect(() => {
    SimpleTimer.end(COZY_NEST_DOM_TWEAK_LOAD_DURATION);
  }, []);

  return (
    <div className="CozyNestLayout">
      <Menu className="Menu">
        <Require a1111="#tabs > div.tab-nav" cnCss="tab-menu-button"/>
      </Menu>
      <Require a1111="#quicksettings" />
      <Tabs>
        <Any2Img a1111="#tab_txt2img" prefix="#txt2img" cnCssPrefix="txt2img"/>
        <Require a1111="#tab_img2img" />
        <RequireAll
          cnCss="tab"
          a1111={
            Selector('#tabs > .tabitem')
              .not(
                '#tab_txt2img'
                , '#tab_img2img'
                , '#tab_settings')
              .use()
          }
        />
        <Require a1111="#tab_settings" cnCss="tab-settings" />
      </Tabs>
      <SidePanels>
        <SidePanel label="Extra Networks"><div>Extra Networks</div></SidePanel>
        <SidePanel label="Image Browser"><div>Image Browser</div></SidePanel>
      </SidePanels>
      <Footer>
        {/*<Require a1111="#footer" cnCss="footer" />*/}
        {/*prose gradio-html*/}
        <Require a1111=".prose.gradio-html#footer > div" cnCss="footer-link" />
        <Require a1111=".prose.gradio-html#footer > .versions" cnCss="footer-version" />
      </Footer>
    </div>
  );
}

function Footer({children}) {
  return (
    <div className="Footer">
      {children}
    </div>
  );
}

function Tabs({children}) {
  return (
    <div className="Tabs">
      {children}
    </div>
  );
}

const ToggleComponent = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return children({ isOpen, toggle });
};

function SidePanels({children}) {
  return (
    <div className="SidePanels">
      {children}
    </div>
  );
}

function SidePanel({children, label}) {
  return (
    <ToggleComponent>
      {({ isOpen, toggle }) => (
        <div className="SidePanel">
          <button onClick={toggle}>
            <div className="label">{label}</div>
          </button>
          {isOpen && children}
        </div>
      )}
    </ToggleComponent>
  );
}
