import React from "react";
import {Require, RequireAll, Trash} from "@rework/Require";
import S, {Selector} from "@rework/Selector";
import './Any2Img.scss'
import {Row, Column} from "@rework/Generic";

const _select = (a1111) => (suffix) => `${a1111} ${suffix}`

function GenerateBox({a1111}) {

  const select = _select(a1111);

  const style = {display: 'none'} //TODO NEVYSHA - listen on image generation

  return (
    <div className="GenerateBox">
      <div className="interrupt-box" style={style}>
        <Require a1111={select('.generate-box-interrupt')} cnCss="interrupt" />
        <Require a1111={select('.generate-box-skip')} cnCss="skip" />
      </div>
      {/*TODO NEVYSHA - remove txt2img*/}
      <Require a1111={select('#txt2img_generate')} cnCss="generate" />
    </div>
  );
}

export function Any2Img({a1111, prefix, cnCssPrefix}) {

  const select = _select(a1111);

  const topRow = select('#txt2img_toprow');
  const generateBox = select(`.generate-box`);
  const toolBox = `${prefix}_tools`
  //txt2img_styles_row
  const stylesRow = select(`${prefix}_styles_row`);
  //txt2img_settings
  const settings = select(`${prefix}_settings`);
  //txt2img_results
  const results = select(`${prefix}_results`);

  return (
        <div className="Any2Img">
          <Column>
            <div className="Settings">
              <div className="Header">
                <GenerateBox a1111={generateBox} />
                <Row>
                  <Require a1111={toolBox} cnCss={`${cnCssPrefix}-toolbox`}/>
                  <Require a1111={topRow} cnCss={`${cnCssPrefix}-toprow`}/>
                </Row>
              </div>
              <Require a1111={stylesRow} cnCss={`${cnCssPrefix}-styles-row`}/>
              <div className="Content">
                <Require a1111={settings} cnCss={`${cnCssPrefix}-settings`}/>
                <RequireAll a1111={
                  Selector(`${a1111} > div > div`)
                    .not(topRow)
                    .use()
                }
                />
                <Trash a1111={
                  Selector(`${prefix}_actions_column`).use()
                } />

              </div>
            </div>
            <Require a1111={results} cnCss={`${cnCssPrefix}-results`}/>
          </Column>
        </div>
    )
}
