import {Icon} from '@material-ui/core';
import {IconStyle} from 'app/indra/components/grids/gridStyles';
import {PanelTypeAndDefinition} from 'app/indra/components/panels/panelController';
import React, {useState} from 'react';
import {FunctionComponent} from 'react';
import {useTranslation} from 'react-i18next';

class NewPanelFolder {
  name: string;
  children: any[];
  isExpanded: boolean | undefined;

  constructor(name: string, children: any[]) {
    this.name = name;
    this.children = children;
    this.isExpanded = undefined;
  }
}

class NewPanel {
  name: string;
  iconType: string;
  newPanelData?: PanelTypeAndDefinition;

  constructor(name: string, iconType: string, newPanelData?: PanelTypeAndDefinition) {
    this.name = name;
    this.iconType = iconType;
    this.newPanelData = newPanelData;
  }
}

interface NewPanelModalProps {
  setShowNewPanelModal: any;
  setNewPanelDataByModal: any;
}

const NewPanelModal: FunctionComponent<NewPanelModalProps> = React.memo(
  ({setShowNewPanelModal, setNewPanelDataByModal}: any) => {
    const {t} = useTranslation();

    const [structure, setStructure] = useState<any>([
      new NewPanelFolder(t('indra:newPanel.folder.BM'), [
        new NewPanel(t('indra:newPanel.newBM'), 'general', {type: 'CreateOrderBT'}),
        new NewPanelFolder(t('indra:newPanel.folder.reports'), [])
      ]),
      new NewPanelFolder(t('indra:newPanel.folder.DM'), [
        new NewPanel(t('indra:newPanel.newDM'), 'general', {type: 'CreateOrder'}),
        new NewPanelFolder(t('indra:newPanel.folder.reports'), [
          new NewPanel(t('indra:newPanel.ownOrders'), 'search', {type: 'PanelGrid', definition: {gridId: 1004}}),
          new NewPanel(t('indra:newPanel.bidsByDeliveryDay'), 'search', {type: 'PanelGrid', definition: {gridId: 1002}})
        ]),
        new NewPanelFolder(t('indra:newPanel.folder.graphs'), [
          new NewPanel(t('indra:newPanel.DMPosition'), 'graph', {type: 'BusinessPositionPanel'}),
          new NewPanel(t('indra:newPanel.DMResults'), 'graph', {type: 'ResultsDTInGraphPanel'})
        ])
      ]),
      new NewPanelFolder(t('indra:newPanel.folder.RRD'), [
        new NewPanel(t('indra:newPanel.overview'), 'general', {type: 'PanelXXX1'}),
        new NewPanelFolder(t('indra:newPanel.folder.reports'), [
          new NewPanel(t('indra:newPanel.RRDByDelivery'), 'search', {type: 'PanelXXX1'})
        ])
      ])
    ]);

    const getIconByType = (type: string) => {
      switch (type) {
        case 'general':
          return 'general';
          break;
        case 'search':
          return 'search';
          break;
        case 'graph':
          return 'graph';
          break;
        default:
          return null;
          break;
      }
    };

    const createItem = (
      depth: number,
      icon: string | null,
      panelFolderOrPanel: NewPanelFolder | NewPanel,
      isExpandable?: boolean
    ) => {
      return (
        <div style={{paddingLeft: depth * 32}}>
          <span>
            {isExpandable && panelFolderOrPanel instanceof NewPanelFolder && (
              <Icon
                onClick={() => {
                  panelFolderOrPanel.isExpanded = !panelFolderOrPanel.isExpanded;
                  setStructure(structure.slice());
                }}
                style={{
                  ...IconStyle, // TODO move styles
                  ...{
                    color: 'rgba(0, 0, 0, 0.26)',
                    cursor: 'pointer'
                  }
                }}>
                {panelFolderOrPanel.isExpanded ? 'expand_less' : 'expand_more'}
              </Icon>
            )}
            {icon != null && (
              <img
                src={'/icons/' + icon + '.png'}
                width="20"
                style={{marginLeft: 2, marginRight: 6, verticalAlign: 'middle'}}
              />
            )}
            {panelFolderOrPanel instanceof NewPanel && panelFolderOrPanel.newPanelData ? (
              <span
                onClick={() => {
                  setNewPanelDataByModal(panelFolderOrPanel.newPanelData);
                  setShowNewPanelModal(false);
                }}
                style={{
                  verticalAlign: 'middle',
                  cursor: 'pointer'
                }}>
                {panelFolderOrPanel.name}
              </span>
            ) : (
              <span
                style={{
                  verticalAlign: 'middle'
                }}>
                {panelFolderOrPanel.name}
              </span>
            )}
          </span>
        </div>
      );
    };

    const getChildren = (childOrChildren: any, depth?: any): any => {
      if (Array.isArray(childOrChildren)) {
        return childOrChildren.map((child: any, key: any) => {
          return getChildren(child, depth);
        });
      }

      if (childOrChildren instanceof NewPanelFolder) {
        const isExpandable = Array.isArray(childOrChildren.children) && childOrChildren.children.length > 0;

        if (depth === 0 && childOrChildren.isExpanded === undefined) {
          childOrChildren.isExpanded = true;
        }

        return (
          <>
            {createItem(depth, 'folder', childOrChildren, isExpandable)}
            <div style={{...(isExpandable && !childOrChildren.isExpanded ? {display: 'none'} : {})}}>
              {getChildren(childOrChildren.children, depth + 1)}
            </div>
          </>
        );
      }

      if (childOrChildren instanceof NewPanel) {
        return createItem(depth, getIconByType(childOrChildren.iconType), childOrChildren);
      }

      /*
      if (typeof childOrChildren === 'string') {
        return createItem(depth, '', childOrChildren);
      }

      return Object.keys(childOrChildren).map((key: any) => {
        const children: any[] = childOrChildren[key];
        const isExpandable = Array.isArray(children) && children.length > 0;

        return (
          <>
            {createItem(depth, 'folder', key, isExpandable)}
            {getChildren(children, depth + 1)}
          </>
        );
      });
      */
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: 2
        }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            padding: 16,
            boxSizing: 'border-box',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'center',
            overflow: 'auto'
          }}
          onClick={() => {
            setShowNewPanelModal(false);
          }}>
          <div
            style={{
              boxSizing: 'border-box',
              textAlign: 'left',
              display: 'contents'
            }}
            onClick={(e: any) => {
              e.stopPropagation();
            }}>
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                minWidth: 300,
                maxWidth: '100%',
                maxHeight: '100%',
                border: '1px solid rgba(0, 0, 0, 0.13)',
                borderRadius: 3,
                boxSizing: 'border-box',
                overflow: 'hidden',
                position: 'relative'
              }}>
              <div
                style={{
                  flex: 0,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  padding: '6px 16px',
                  border: '0px solid rgba(0, 0, 0, 0.13)',
                  borderWidth: '3px 0px 0px',
                  backgroundColor: '#eaeaea'
                }}>
                <div style={{flex: 1}}>
                  <span>{t('indra:newPanel.title')}</span>
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: 'right'
                  }}>
                  <Icon
                    style={{verticalAlign: 'middle', color: '#3d3d3d', cursor: 'pointer'}}
                    onClick={() => {
                      setShowNewPanelModal(false);
                    }}>
                    {'close'}
                  </Icon>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  padding: 16,
                  border: '0px solid rgba(0, 0, 0, 0.13)',
                  borderWidth: '0px 0px 3px',
                  backgroundColor: 'rgb(177, 217, 255)',
                  overflowY: 'auto',

                  borderRightWidth: 3, // fix scrollbar
                  borderRightColor: 'transparent', // fix scrollbar
                  paddingRight: 13 // fix scrollbar
                }}>
                <div
                  style={{
                    height: '100%',
                    boxSizing: 'border-box',
                    overflowY: 'auto'
                  }}>
                  {getChildren(structure, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default NewPanelModal;
