import {Button, Grid, Icon} from '@material-ui/core';
import {LayoutData, LayoutName, LayoutProps, SettingsType} from 'app/indra/components/layouts/layoutController';
import Panel, {
  PanelOrderAndType,
  panelStyles,
  PanelTypeAndDefinition
} from 'app/indra/components/panels/panelController';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import {useTranslation} from 'react-i18next';
import './reactGridLayout.css';

const DynamicReactGridLayout = WidthProvider(Responsive);

const defaultRowHeight = 50;
const defaultNumberOfColumns = 12;

export enum LayoutActionType {
  INIT,
  ADD_PANEL
}

const DynamicLayout: FunctionComponent<LayoutProps> = React.memo((props) => {
  console.log('--------DynamicLayout');

  const {t} = useTranslation();
  const [panelData, setPanelData] = useState<PanelOrderAndType[]>([]);
  const classes = panelStyles();

  useEffect(() => {
    if (props.newPanelDataByModal) {
      addNewPanelByModal(props.newPanelDataByModal);
    }
  }, [props.newPanelDataByModal]);

  const getDefaultLayoutComposition = (panels: Map<number, PanelOrderAndType>): PanelOrderAndType[] => {
    const defaultLayoutComposition: PanelOrderAndType[] = [];

    const sortedPanels = [...panels.values()].sort((a: PanelOrderAndType, b: PanelOrderAndType) => {
      if (a.composition && !b.composition) {
        return 1;
      }
      if (!a.composition && b.composition) {
        return -1;
      }

      const aComp = a.composition;
      const bComp = b.composition;

      if (aComp && bComp) {
        if (aComp.x < bComp.x) {
          return -1;
        }
        if (aComp.x > bComp.x) {
          return 1;
        }
        return aComp.x - bComp.x;
      }

      return 0;
    });

    sortedPanels.forEach((panel) => {
      defaultLayoutComposition.push(panel);
    });

    return defaultLayoutComposition;
  };

  useEffect(() => {
    const newPanelData = getDefaultLayoutComposition(props.panels);

    setPanelData(newPanelData);
  }, [props.panels]);

  const renderLayoutName = (layoutData: LayoutData) => {
    if (layoutData.renderLayoutName) {
      return (
        <div
          key={'LayoutName'}
          className={classes.def}
          data-grid={{x: 0, y: 0, w: defaultNumberOfColumns, h: 1, i: 'LayoutName', static: true, bounded: true}}>
          <LayoutName layoutName={layoutData.layoutName} />
        </div>
      );
    } else {
      // Every element directly in component DynamicReactGridLayout must have attribute KEY defined
      // and empty element must have width, height, min max width and height set to ZERO
      return (
        <div
          key={'LayoutName'}
          data-grid={{
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            minW: 0,
            maxW: 0,
            minH: 0,
            maxH: 0,
            i: 'LayoutName',
            static: true,
            bounded: true
          }}
        />
      );
    }
  };

  const addNewPanel = () => {
    const newPanelData = panelData.splice(0);
    const newIndex = newPanelData.length + 1;
    const newPanel: PanelOrderAndType = {
      order: newIndex,
      type: 'PanelXXX1',
      definition: {},
      header: '',
      composition: {h: 4, w: 4, x: 0, y: Infinity}
    };
    newPanelData.push(newPanel);
    setPanelData(newPanelData);
  };

  const addNewPanelByModal = (newPanelDataByModal: PanelTypeAndDefinition) => {
    const newPanelData = panelData.splice(0);
    const newIndex = newPanelData.length + 1;
    const newPanel: PanelOrderAndType = {
      order: newIndex,
      type: newPanelDataByModal.type,
      definition: newPanelDataByModal.definition,
      header: '',
      composition: {h: 4, w: 4, x: 0, y: Infinity}
    };
    newPanelData.push(newPanel);
    setPanelData(newPanelData);
  };

  const [layoutChanged, setLayoutChanged] = useState<boolean>(false);

  function renderOnePanel(panel: PanelOrderAndType, props: any) {
    const key = panel.order ? panel.order.toString() : '1';

    return (
      <div key={key} className={classes.def} data-grid={panel.composition}>
        {panel.header && panel.type !== 'PanelGrid' && <PanelName header={panel.header} {...props} />}
        <Panel panel={panel} {...props} {...(panel.type === 'PanelGrid' ? {layoutChanged: layoutChanged} : {})} />
      </div>
    );
  }

  if (panelData.length === 0) {
    return null;
  }

  const applySettings = (data: any, panelData: PanelOrderAndType[]) => {
    const clonedPanelData = panelData.slice(0);

    data.forEach((row: any) => {
      clonedPanelData.forEach((panel: PanelOrderAndType) => {
        if (row.i === panel.order.toString()) {
          panel.composition = row;
        }
      });
    });

    props.writeSettings({type: SettingsType.ALL_DATA, data: clonedPanelData});
  };

  return (
    <div>
      <DynamicReactGridLayout
        onLayoutChange={(data: any) => {
          applySettings(data, panelData);
          setLayoutChanged(!layoutChanged);
        }}
        style={{display: 'flex', flex: 1}}
        cols={{
          lg: defaultNumberOfColumns,
          md: defaultNumberOfColumns,
          sm: defaultNumberOfColumns,
          xs: defaultNumberOfColumns,
          xxs: defaultNumberOfColumns
        }}
        compactType={'vertical'}
        rowHeight={defaultRowHeight}
        verticalCompact
        containerPadding={[5, 5]}
        draggableHandle=".MyDraggableHandleClassName"
        useCSSTransforms>
        {renderLayoutName(props.layoutData)}
        {panelData.map((panel) => renderOnePanel(panel, {...props}))}
      </DynamicReactGridLayout>
      <Button onClick={addNewPanel}> {t('indra:dynamicLayout.button.add')} </Button>
    </div>
  );
});

// import AddIcon from '@material-ui/icons/Add';

// const AddPanelButton: FunctionComponent<any> = React.memo((props) => {

//   const useStyles = makeStyles((_theme: Theme) =>
//   createStyles({
//     myDiv: {
//       position: 'absolute',
//       bottom: 2,
//       left: 2,
//       width: 30,
//       height: 30,
//       zIndex: 3,
//     }
//   })
// );

// const classes = useStyles();

//   const [visible, setVisible] = React.useState(false);

//   return (
//     <div className={classes.myDiv} onMouseOver={() => {setVisible(true)}} onMouseOut={() => {setVisible(false)}} onClick={() => props.addNewPanel({type: LayoutActionType.ADD_PANEL})}>
//         {/*visible && */<AddIcon style={{pointerEvents: "none"}} />}
//     </div>
//   );

// });

export const PanelName: FunctionComponent<any> = React.memo((props) => {
  const translation: any = useTranslation();
  const {t} = translation;

  const dbTranslate = (header: any) => {
    if (header && header.includes('%')) {
      const n = header.indexOf('%');
      const m = header.indexOf('%', n + 1);

      const translation = header.substring(n + 1, m);
      return header.replace('%' + translation + '%', t('indra:' + translation));
    }

    return header;
  };

  const [header, setHeader] = useState<string>(dbTranslate(props.header));

  useEffect(() => {
    const header = dbTranslate(props.header);

    let replaced = false;
    if (header && header.includes('@')) {
      const n = header.indexOf('@');
      const m = header.indexOf('@', n + 1);

      const replacedString = header.substring(n + 1, m);

      if (props.communication) {
        if (n > 0 && m > 0 && replacedString.length > 0) {
          props.communication.forEach((com: any) => {
            com.data.forEach((data: any) => {
              if (data.key === replacedString) {
                setHeader(header.replace('@' + replacedString + '@', ' - ' + data.value));
                replaced = true;
              }
            });
          });
        }
      }
      if (!replaced) {
        setHeader(header.replace('@' + replacedString + '@', ''));
      }
    } else {
      setHeader(header);
    }
  }, [props.communication, translation.i18n.language]);

  return (
    <Grid
      container
      alignItems="center"
      style={{
        flex: 0,
        display: 'flex',
        background: 'linear-gradient(45deg, rgb(16 189 224 / 30%), rgb(16 189 224 / 70%))',
        fontWeight: 'bold',
        fontSize: 13,
        minHeight: 25,
        paddingLeft: 40,
        paddingRight: 10
      }}>
      {header}
    </Grid>
  );
});

export function CreateOrderBT() {
  const {t} = useTranslation();

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <Grid
        container
        alignItems="center"
        style={{
          flex: 0,
          display: 'flex',
          background: 'linear-gradient(45deg, rgb(16 189 224 / 30%), rgb(16 189 224 / 70%))',
          fontWeight: 'bold',
          fontSize: 13,
          minHeight: 25,
          paddingRight: 10,
          paddingLeft: 40
        }}>
        {t('indra:newPanel.newBM')}
      </Grid>
      Nová nabídka
    </div>
  );
}

export default DynamicLayout;
