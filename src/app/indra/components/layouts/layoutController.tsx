import {Grid, Icon, InputProps} from '@material-ui/core';
import withOffsetProvider from 'app/indra/components/grids/withOffsetProvider';
import LayoutWrapperSaveSettings from 'app/indra/components/layouts/layoutWrapperSaveSettings';
import {
  PanelCommunication,
  PanelOrderAndType,
  PanelTypeAndDefinition
} from 'app/indra/components/panels/panelController';
import {RouteMatchProps} from 'app/indra/components/root';
import fetchService from 'app/indra/services/fetch';
import React, {FunctionComponent, Suspense, useEffect, useReducer, useState} from 'react';
import RGL, {WidthProvider} from 'react-grid-layout';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';

export const CustomReactGridLayout = withOffsetProvider(WidthProvider(RGL));

const Layout2VWrapper = React.lazy(() => import('./layout2V'));
const Layout3V = React.lazy(() => import('./layout3V'));
const Layout2H = React.lazy(() => import('./layout2H'));
const Layout3H = React.lazy(() => import('./layout3H'));
const SingleLayout = React.lazy(() => import('./singleLayout'));
const Layout3L2R = React.lazy(() => import('./layout3L2R'));
const DynamicLayout = React.lazy(() => import('./dynamicLayout'));

const Layouts = {
  SingleLayout: SingleLayout,
  Layout2V: Layout2VWrapper,
  Layout3V: Layout3V,
  Layout2H: Layout2H,
  Layout3H: Layout3H,
  Layout3L2R: Layout3L2R,
  DynamicLayout: DynamicLayout
};

export enum SettingsType {
  ALL_DATA,
  LAYOUT_PANEL_DEF,
  PANEL_DEF,
  GRID_DEF,
  INIT
}

export type WriteSettingsAction = {
  type: SettingsType;
  data: any;
};

export type LayoutData = {
  layoutId: number;
  layoutName: string;
  renderLayoutName?: boolean;
};

export interface LayoutProps extends InputProps {
  layoutData: LayoutData;
  // layoutComposition?: LayoutPanelComposition[];

  // userSettings?: UserSettingsForLayout;
  panels: Map<number, PanelOrderAndType>;
  outputs: LayoutCommunication[];
  communication?: PanelCommunication[];
  setCommunication?: any;
  writeSettings: (action: WriteSettingsAction) => void;
  resizedOffset?: number;
  newPanelDataByModal?: PanelTypeAndDefinition;
}

export interface UserSettingsForLayout {
  layout_panels_def: LayoutPanelComposition[];
  panels_def: PanelDefinition[];
  grids_def: GridDefinition[];
}

export interface LayoutPanelComposition {
  i: string;
  w: number;
  h: number;
  x: number;
  y: number;
}

export interface PanelDefinition {
  slot: number;
  type: string;
  definition: string;
}

export interface GridDefinition {
  gridId: number;
  columns: GridColumn[];
}

export interface GridColumn {
  id: string;
  isVisible: boolean;
  isSorted: boolean;
  isSortedDesc: boolean;
  width: number;
}

export interface LayoutCommunication {
  from: number;
  to: number;
  type: string;
}

export const WAITING = 'WAITING';
const DONE = 'DONE';
const ERROR_READ = 'ERROR_READ';
const ERROR_RENDER = 'ERROR_RENDER';

function writeSettingsReducer(settings: any, action: any) {
  // console.log('---------WriteSettings: ' + JSON.stringify(action.type));
  if (action.type === SettingsType.ALL_DATA) {
    // console.log('-------WriteSettings - 1: ' + JSON.stringify(action.data));

    settings = action.data.splice(0);

    // console.log('-------WriteSettings - 2: ' + JSON.stringify(settings));

    return settings;
  }

  if (action.type === SettingsType.LAYOUT_PANEL_DEF) {
    const panelsDef: LayoutPanelComposition[] = [];
    action.data.forEach((pane: any) => {
      panelsDef.push({
        h: pane.h,
        w: pane.w,
        x: pane.x,
        y: pane.y,
        i: pane.i
      });
    });

    settings.layout_panels_def = panelsDef;
  }

  if (action.type === SettingsType.PANEL_DEF) {
    action.data.forEach((panelDefNew: PanelDefinition) => {
      let found = false;
      settings.panels_def.forEach((panelDefOld: PanelDefinition) => {
        if (panelDefNew.slot == panelDefOld.slot && panelDefNew.type == panelDefOld.type) {
          panelDefOld.definition = panelDefNew.definition;
          found = true;
        }
      });
      if (!found) {
        settings.panels_def.push(panelDefNew);
      }
    });
  }

  if (action.type === SettingsType.GRID_DEF) {
    action.data.forEach((gridDefNew: GridDefinition) => {
      settings.forEach((panelDef: any, panelKey: number) => {
        if (
          panelDef.type == 'PanelGrid' &&
          panelDef.definition &&
          panelDef.definition.gridId &&
          panelDef.definition.gridId == gridDefNew.gridId
        ) {
          panelDef.definition.columns = gridDefNew.columns;
        }
      });
    });
  }

  if (action.type === SettingsType.INIT) {
    settings.layout_panels_def = action.data.layout_panels_def;
    settings.panels_def = action.data.panels_def;
    settings.grids_def = action.data.grids_def;
  }

  return settings;
}

interface LayoutRouteMatchProps extends RouteMatchProps {
  newPanelDataByModal: PanelTypeAndDefinition;
}

const LayoutController: FunctionComponent<LayoutRouteMatchProps> = React.memo((props) => {
  const {id} = useParams();

  const [communication, setCommunication] = useState<PanelCommunication[]>([]);
  const [value, setValue] = useState<any | null>(null);
  const [layoutInstance, setLayoutInstance] = React.useState<JSX.Element>(<div />);
  const [status, setState] = useState<string>(WAITING);

  const [settings, writeSettings] = useReducer(writeSettingsReducer, {});

  useEffect(() => {
    setState(WAITING);
  }, [id]);

  useEffect(() => {
    if (status === WAITING) {
      readLayoutDefinition(id)
        .then((json) => {
          if (json) {
            setValue(json);
          } else {
            setState(ERROR_READ);
          }
        })
        .catch(() => {
          setState(ERROR_READ);
        });
    }
  }, [status]);

  useEffect(() => {
    if (status === WAITING && value) {
      const layoutData = getLayoutData(id, value);
      const templatePage = getLayoutTemplatePage(value);
      const panels = getPanels(value);
      const outputs = getOutputs(value);

      writeSettings({type: SettingsType.INIT, data: Array.from(panels.keys()).slice(0)});

      if (templatePage) {
        let foundLayoutTemplateComp = false;
        for (const [k, val] of Object.entries(Layouts)) {
          if (k.localeCompare(templatePage) == 0) {
            //if (panels) {
            foundLayoutTemplateComp = true;
            setLayoutInstance(
              React.createElement(
                val,
                {
                  layoutData: layoutData,
                  panels: panels,
                  outputs: outputs,
                  communication: [],
                  setCommunication: setCommunication,
                  writeSettings: writeSettings,
                  resizedOffset: 0
                },
                null
              )
            );
            setState(DONE);
            //}
          }
        }

        if (!foundLayoutTemplateComp) {
          console.log('Unable to found layout template page: ' + templatePage);
          setState(ERROR_RENDER);
        }
      } else {
        console.log('Unable to define layout template page: ' + templatePage);
        setState(ERROR_RENDER);
      }
    }
  }, [value]);

  useEffect(() => {
    setLayoutInstance(
      React.cloneElement(
        layoutInstance,
        {
          communication: communication,
          newPanelDataByModal: props.newPanelDataByModal
        },
        null
      )
    );
  }, [communication, props.newPanelDataByModal]);

  let layoutInstanceTemp = layoutInstance;
  if (status === WAITING) {
    layoutInstanceTemp = <LoadingData />;
  }
  if (status === ERROR_READ) {
    layoutInstanceTemp = <UnableToReadLayout layoutId={id} />;
  }
  if (status === ERROR_RENDER) {
    layoutInstanceTemp = <UnableToRenderLayout layoutId={id} />;
  }

  return (
    <Suspense fallback={<LoadingData />}>
      <LayoutWrapperSaveSettings settings={settings} layoutId={id} setState={setState}>
        {layoutInstanceTemp}
      </LayoutWrapperSaveSettings>
    </Suspense>
  );
});

export const LayoutName: FunctionComponent<AuxProps> = React.memo((props) => {
  return (
    <Grid
      container
      alignItems="center"
      style={{
        flex: 1,
        display: 'flex',
        background: 'linear-gradient(45deg, #969696 30%, #727272 90%)',
        fontWeight: 'bold',
        fontSize: 18,
        minHeight: 30,
        paddingRight: 10,
        paddingLeft: 20
      }}>
      {props.layoutName}
    </Grid>
  );
});

function LoadingData(): JSX.Element {
  const {t} = useTranslation();

  return (
    <Grid alignContent="center" container justify="center" style={{flex: 1, display: 'flex'}}>
      {t('indra:layout.loading')}
    </Grid>
  );
}

interface AuxProps extends InputProps {
  layoutId?: number;
  layoutName?: string;
}

const UnableToRenderLayout: FunctionComponent<AuxProps> = React.memo((props) => {
  const {t} = useTranslation();

  return (
    <Grid alignContent="center" container justify="center" style={{flex: 1, display: 'flex'}}>
      {props.layoutId
        ? t('indra:layout.error.render').replace('%p1%', props.layoutId.toString())
        : t('indra:layout.error.undefined')}
    </Grid>
  );
});

const UnableToReadLayout: FunctionComponent<AuxProps> = React.memo((props) => {
  const {t} = useTranslation();

  return (
    <Grid alignContent="center" container justify="center" style={{flex: 1, display: 'flex'}}>
      {props.layoutId
        ? t('indra:layout.error.definition').replace('%p1%', props.layoutId.toString())
        : t('indra:layout.error.undefined')}
    </Grid>
  );
});

export function unableToRender(layoutId: number): JSX.Element {
  const {t} = useTranslation();

  return (
    <Grid alignContent="center" container justify="center" style={{flex: 1, display: 'flex'}}>
      {t('indra:layout.error.render').replace('%p1%', layoutId.toString())}
    </Grid>
  );
}

export function unableToRead(layoutId: number): JSX.Element {
  const {t} = useTranslation();

  return (
    <Grid alignContent="center" container justify="center" style={{flex: 1, display: 'flex'}}>
      {t('indra:layout.error.definition').replace('%p1%', layoutId.toString())}
    </Grid>
  );
}

async function readLayoutDefinition(layoutId: number) {
  console.log('readLayoutDefinition: ' + layoutId);
  const json: any = await fetchService.get(process.env.REACT_APP_API_URL_INDRA + '/layout/getLayout/' + layoutId);

  return json;
}

function getLayoutData(id: number, value: any): LayoutData {
  if (value && value.layoutDef) {
    const layoutDef = JSON.parse(value.layoutDef);
    return {
      layoutId: id,
      layoutName: layoutDef.labelCode,
      renderLayoutName: layoutDef.renderLayoutName
    };
  } else {
    return {
      layoutId: -1,
      layoutName: ''
    };
  }
}

function getLayoutTemplatePage(value: any) {
  if (value && value.layoutDef) {
    const templDef = JSON.parse(value.jsTemplate.templDef);
    return templDef.page;
  } else {
    return null;
  }
}

function getPanels(value: any) {
  const panels = new Map<number, PanelOrderAndType>();
  let userSettingsApplied = false;

  // applying user panel settings
  if (value && value.layoutUserSettings) {
    const userSettingsParsed = JSON.parse(value.layoutUserSettings);
    if (userSettingsParsed && userSettingsParsed.panels) {
      userSettingsApplied = true;
      userSettingsParsed.panels.forEach((panelTmp: any) => {
        console.log('PanelTmp: ' + panelTmp.order + ' + ' + panelTmp.type);

        const panel: PanelOrderAndType = {
          order: panelTmp.order,
          type: panelTmp.type,
          definition: panelTmp.definition,
          header: panelTmp.header,
          composition: panelTmp.composition
        };
        panels.set(panelTmp.order, panel);
      });
    }
  }

  // applying default panel settings
  if (!userSettingsApplied && value && value.panels && value.layoutPanels) {
    const panelsParsed = JSON.parse(value.panels);
    console.log(panelsParsed.panels);
    if (panelsParsed.panels) {
      panelsParsed.panels.forEach((panelTmp: any) => {
        let type = '';
        value.layoutPanels.forEach((layoutPanel: any) => {
          if (panelTmp.type == layoutPanel.idPanel) {
            type = JSON.parse(layoutPanel.panelDef).page;
          }
        });

        const panel: PanelOrderAndType = {
          order: panelTmp.order,
          type: type,
          definition: panelTmp.definition,
          header: panelTmp.header,
          composition: panelTmp.composition
        };

        panels.set(panelTmp.order, panel);
      });
    }
  }
  console.log('Number of panels: ' + panels.size);
  return panels;
}

function getOutputs(value: any) {
  const outputs: LayoutCommunication[] = [];
  if (value && value.panels) {
    const panelsParsed = JSON.parse(value.panels);
    if (panelsParsed.outputs) {
      panelsParsed.outputs.forEach((outputTmp: any) => {
        const output: LayoutCommunication = {
          ...outputTmp
        };
        outputs.push(output);
      });
    }
  }
  console.log('Layout outputs: ' + JSON.stringify(outputs));
  return outputs;
}

export function createLayoutDefinition(defaultLayout: any, customLayout: any, userLayout: any) {
  if (customLayout) {
    customLayout.forEach((panelComp: LayoutPanelComposition) => {
      defaultLayout.forEach((layoutPanel: any) => {
        if (panelComp.i == layoutPanel.i) {
          layoutPanel.h = panelComp.h ? panelComp.h : layoutPanel.h;
        }
      });
    });
  }
  if (userLayout) {
    userLayout.forEach((panelComp: LayoutPanelComposition) => {
      defaultLayout.forEach((layoutPanel: any) => {
        if (panelComp.i === layoutPanel.i) {
          layoutPanel.h = panelComp.h;
          layoutPanel.w = panelComp.w;
          layoutPanel.x = panelComp.x;
          layoutPanel.y = panelComp.y;
        }
      });
    });
  }
  return defaultLayout;
}

export default LayoutController;
