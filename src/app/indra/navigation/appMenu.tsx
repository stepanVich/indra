import {Button, Menu, MenuItem, MenuProps, Theme, withStyles} from '@material-ui/core';
import NestedMenuItem, {Item} from 'app/indra/navigation/nestedMenuItem';
import {DEFAULT_FONT_SIZE} from 'app/indra/utils/const';
import React, {Fragment, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

type AnchorElement = {
  anchorElement: null | HTMLElement;
  menuClicked: string;
};

export default function AppMenu() {
  const {t} = useTranslation();
  const history = useHistory();

  const [newAnchorElement, setNewAnchorElement] = useState<null | AnchorElement>(null);

  const newHandleClick = (event: React.MouseEvent<HTMLButtonElement>, menuClicked: string) => {
    setNewAnchorElement({anchorElement: event.currentTarget, menuClicked: menuClicked});
  };

  const newHandleClose = () => {
    setNewAnchorElement(null);
  };

  const menuItemClick = (item: Item, openInNewTab: boolean) => {
    if (item.onClick) {
      item.onClick();
      newHandleClose();
      return;
    }

    if (item.path) {
      if (openInNewTab) {
        const newTab: any = window.open(item.path, '_blank');
        newTab.focus();
      } else {
        history.push(item.path);
      }
    }

    newHandleClose();
  };

  const isOpen = (name: string) => {
    return newAnchorElement?.menuClicked == name && Boolean(newAnchorElement.anchorElement);
  };

  const renderMenuItems = () => {
    return menuItems.map((menuItem: Item) => {
      if (menuItem.children) {
        return (
          <Fragment key={'Div' + menuItem.id}>
            <ColorButton key={'Button_' + menuItem.id} onClick={(event) => newHandleClick(event, menuItem.name)}>
              {menuItem.name}
            </ColorButton>
            <StyledMenu
              key={'Menu_' + menuItem.id}
              anchorEl={newAnchorElement?.anchorElement}
              open={isOpen(menuItem.name)}
              onClose={newHandleClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              MenuListProps={{
                onMouseLeave: newHandleClose
              }}
              PaperProps={{
                elevation: 4
              }}>
              {menuItem.children.map((item: Item) => {
                const {id, name, children} = item;
                return (
                  <NestedMenuItem
                    key={id}
                    id={id}
                    name={name}
                    childrenItems={children}
                    onClick={(event: any, onNewTab: boolean) => menuItemClick(item, onNewTab)}
                  />
                );
              })}
            </StyledMenu>
          </Fragment>
        );
      }

      return (
        <ColorButton
          key={menuItem.id}
          onMouseDown={(event: any) => {
            if (event.button === 1) {
              menuItemClick(menuItem, true);
            }
          }}
          onClick={(event: any) => {
            if (event.button !== 1) {
              menuItemClick(menuItem, false);
            }
          }}>
          {menuItem.name}
        </ColorButton>
      );
    });
  };

  const menuItems: Item[] = [
    {
      id: 'Home1',
      name: t('indra:menu.home'),
      path: '/'
    },
    {
      id: 'BT1',
      name: 'RRD',
      path: '/layout/100'
    },
    {
      id: 'DT1',
      name: t('indra:menu.DM'),
      path: '/layout/12'
    },
    {
      id: 'Sestavy1',
      name: t('indra:menu.reports'),
      children: [
        {
          id: 'Sestavy2',
          name: 'Item 1.1',
          onClick: () => {
            alert('-------test Item 1.1');
          }
        }
      ]
    },
    {
      id: 'System1',
      name: t('indra:menu.system'),
      children: [
        {
          id: 'System2',
          name: 'Item 1.1'
        },
        {
          id: 'System3',
          name: 'Item 1.2',
          children: [
            {
              id: 'System4',
              name: 'Item 1.2.1'
            },
            {
              id: 'System5',
              name: 'Item 1.2.2'
            }
          ]
        }
      ]
    },
    {
      id: 'Others1',
      name: t('indra:menu.others'),
      children: [
        {
          id: 'Others2',
          name: 'Nová nabídka',
          path: '/layout/8'
        },
        {
          id: 'Others3',
          name: 'Modifikace nabídky',
          path: '/layout/9'
        },
        {
          id: 'Others4',
          name: 'Upload nabídek',
          path: '/layout/10'
        },
        {
          id: 'Others5',
          name: 'Dashboard',
          path: '/dashboard'
        },
        {
          id: 'Others6',
          name: 'Virtualized Table',
          path: '/virtualizedtable/TABLE'
        },
        {
          id: 'Others7',
          name: 'Orders Overview',
          path: '/reportData/orders-overview'
        },
        {
          id: 'Others8',
          name: 'Filtered Table',
          path: '/filteredTable/filtered-table'
        },
        {
          id: 'Others9',
          name: 'Grid - Simple Table',
          path: '/reports/approved-dm'
        },
        {
          id: 'Others10',
          name: 'Grid - Virtualized Table',
          path: '/reports2/approved-dm'
        },
        {
          id: 'Others11',
          name: 'Grid - React Table',
          path: '/grid/1'
        },
        {
          id: 'Others12',
          name: 'Layout 6 - Single Layout',
          path: '/layout/6'
        },
        {
          id: 'Others13',
          name: 'Layout 7 - Single Layout (new)',
          path: '/layout/7'
        },
        {
          id: 'Others14',
          name: 'Layout 1 - 3V',
          path: '/layout/1'
        },
        {
          id: 'Others15',
          name: 'Layout 2 - 2V',
          path: '/layout/2'
        },
        {
          id: 'Others16',
          name: 'Layout 3 - 2H',
          path: '/layout/3'
        },
        {
          id: 'Others17',
          name: 'Layout 4',
          path: '/layout/4'
        },
        {
          id: 'Others18',
          name: 'Virtualized Grid Layout',
          path: '/layout/5'
        }
      ]
    }
  ];

  return <div style={{flex: 1, display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>{renderMenuItems()}</div>;
}

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText('#C2E2EB'),
    //background: 'linear-gradient(to bottom, #C2E2EB, #81C3D5)',
    background: 'linear-gradient(180deg, rgba(194,226,235,1) 47%, rgba(156,209,236,1) 53%)',
    '&:hover': {
      // backgroundColor: '#81C3D5'
      //background: 'linear-gradient(to bottom, #C2E2EB, #50B3CE)'
    },
    fontSize: DEFAULT_FONT_SIZE,
    textTransform: 'none',
    width: 100,
    margin: 0,
    marginRight: 1,
    padding: '2px 0px',
    lineHeight: 1.8,
    borderRadius: 0,
    border: '1px #a9c9e1 solid'
  }
}))(Button);

const ColorMenuItem = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText('#C2E2EB'),
    //backgroundColor: '#C2E2EB',
    background: 'linear-gradient(to bottom, #C2E2EB, #81C3D5)',
    '&:hover': {
      // backgroundColor: '#51C6E7'
      background: 'linear-gradient(to bottom, #C2E2EB, #50B3CE)'
    },
    width: 250
  }
}))(MenuItem);

export const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    // backgroundColor: '#C2E2EB',
    background: 'linear-gradient(to bottom, #C2E2EB, #81C3D5)'
  }
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    {...props}
  />
));
