import {makeStyles, MenuItem, Theme} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {StyledMenu} from 'app/indra/navigation/appMenu';
import * as React from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  menuItem: {
    backgroundColor: ({isSubMenuOpen}: {isSubMenuOpen: boolean}) =>
      isSubMenuOpen ? theme.palette.action.hover : 'transparent',
    minWidth: '12rem',
    minHeight: 30
  },
  contentContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    paddingRight: 6
  },
  expandIcon: {
    fontSize: 12
  }
}));

export type Item = {
  id: string;
  name: string;
  path?: string;
  children?: Item[];
  onClick?: () => void;
};

interface NestedMenuItemProps {
  id: string;
  name: string;
  childrenItems?: Item[];
  onClick: (event: any, onNewTab: boolean) => void;
}

const NestedMenuItem = React.forwardRef<any, NestedMenuItemProps>(
  ({id: parentId, name: parentName, childrenItems: parentChildrenItems = [], onClick}, ref) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isSubMenuOpen = Boolean(anchorEl);
    const classes = useStyles({isSubMenuOpen});
    const hasChildrenItems = parentChildrenItems?.length || false;
    const isLeafNode = !hasChildrenItems;

    const handleMouseEnter = (event: React.MouseEvent<any>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const onMenuItemClick = (event: React.MouseEvent<any>) => {
      if (event.button !== 1) {
        event.stopPropagation();
        if (isLeafNode) {
          onClick(event, false);
        }
      }
    };

    const onMenuItemMiddleClick = (event: React.MouseEvent<any>) => {
      if (event.button === 1) {
        event.stopPropagation();
        if (isLeafNode) {
          onClick(event, true);
        }
      }
    };

    return (
      <MenuItem
        ref={ref}
        disableRipple
        className={classes.menuItem}
        onClick={onMenuItemClick}
        onMouseDown={onMenuItemMiddleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleClose}>
        <div className={classes.contentContainer}>
          <span className={classes.name}>{parentName}</span>
          {hasChildrenItems && <ArrowForwardIosIcon className={classes.expandIcon} />}
        </div>
        {hasChildrenItems && (
          <>
            <StyledMenu
              // "pointerEvents: none" to prevent invisible Popover wrapper div to capture mouse events
              style={{pointerEvents: 'none'}}
              anchorEl={anchorEl}
              open={isSubMenuOpen}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              PaperProps={{
                elevation: 4
              }}>
              {/* reset pointer event here so that the menu items could receive mouse events */}
              <div style={{pointerEvents: 'auto'}}>
                {parentChildrenItems.map((item) => {
                  const {id, name, children} = item;
                  return <NestedMenuItem key={id} id={id} name={name} childrenItems={children} onClick={onClick} />;
                })}
              </div>
            </StyledMenu>
          </>
        )}
      </MenuItem>
    );
  }
);

export default NestedMenuItem;
