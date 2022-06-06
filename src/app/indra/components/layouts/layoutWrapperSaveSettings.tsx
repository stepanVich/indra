import {Button, Grow, Snackbar} from '@material-ui/core';
import {TransitionProps} from '@material-ui/core/transitions/transition';
import useKeyboardShortcut from 'app/indra/hooks/useKeyboardShortcut';
import fetchService from 'app/indra/services/fetch';
import React, {FunctionComponent, useCallback, useState} from 'react';
import {WAITING} from 'app/indra/components/layouts/layoutController';
import {useTranslation} from 'react-i18next';

function GrowTransition(props: TransitionProps) {
  return <Grow {...props} />;
}

type SnackBarProps = {
  open: boolean;
  message: string;
};

export const LayoutWrapperSaveSettings: FunctionComponent<any> = (props) => {
  const {t} = useTranslation();
  const keysSave = ['Alt', 'Shift', 'S'];
  const keysDelete = ['Alt', 'Shift', 'R'];
  const [open, setOpen] = useState<SnackBarProps>({open: false, message: ''});

  const saveSettings = useCallback(
    (keys) => {
      if (props.layoutId && props.settings) {
        const saveSettings = async () => {
          try {
            const settingsString: string[] = [];
            props.settings.forEach((setting: any) => {
              settingsString.push(JSON.stringify(setting));
            });

            const data = {
              layout_id: props.layoutId,
              panels: settingsString
            };

            console.log('Saving layout composition: ' + JSON.stringify(data));

            await fetchService.post(process.env.REACT_APP_API_URL_INDRA + '/layout/saveSettings', data);

            setOpen({open: true, message: 'Layout Composition Saved'});
          } catch (e) {
            console.log('Chyba pri ulozeni kompozice layoutu: ' + e);
            setOpen({open: true, message: 'Chyba pri ulozeni layoutu'});
          }
        };

        saveSettings();
      }
    },
    [props.layoutId, props.settings]
  );

  const deleteSettings = useCallback(
    (keys) => {
      if (props.layoutId && props.settings) {
        const deleteSettings = async () => {
          try {
            console.log('Deleting layout composition: ' + props.layoutId);

            await fetchService.post(
              process.env.REACT_APP_API_URL_INDRA + '/layout/deleteSettings/' + props.layoutId,
              null
            );

            setOpen({open: true, message: 'Layout Composition Deleted'});
            props.setState(WAITING);
          } catch (e) {
            console.log('Chyba pri smazani kompozice layoutu: ' + e);
            setOpen({open: true, message: 'Chyba pri smazani layoutu'});
          }
        };

        deleteSettings();
      }
    },
    [props.layoutId, props.settings]
  );

  useKeyboardShortcut(keysSave, saveSettings);
  useKeyboardShortcut(keysDelete, deleteSettings);

  return (
    <>
      {props.children}
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        open={open.open}
        autoHideDuration={5000}
        onClose={() => setOpen({open: false, message: ''})}
        message={open.message}
        TransitionComponent={GrowTransition}
        action={
          <React.Fragment>
            <Button variant="outlined" color="primary" size="small" onClick={() => setOpen({open: false, message: ''})}>
              {t('indra:layout.settings.button.ok')}
            </Button>
          </React.Fragment>
        }
      />
    </>
  );
};

export default LayoutWrapperSaveSettings;
