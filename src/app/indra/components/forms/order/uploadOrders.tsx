import {Button, Grow, InputProps, Snackbar, TextField} from '@material-ui/core';
import {TransitionProps} from '@material-ui/core/transitions/transition';
import {PanelProp} from 'app/indra/components/panels/panelController';
import fetchService from 'app/indra/services/fetch';
import {user_id} from 'app/indra/utils/user';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

function GrowTransition(props: TransitionProps) {
  return <Grow {...props} />;
}

const UploadOrder: FunctionComponent<PanelProp> = React.memo(() => {
  const [content, setContent] = useState<string>('');

  async function sendOrder() {
    if (content.length <= 0) {
      return;
    } else {
      const order: any = {
        task_id: 1,
        user_id: user_id,
        ts: new Date().getTime(),
        xml_data: content
      };

      console.log('----------sending order: ' + JSON.stringify(order));

      try {
        await fetchService.post(process.env.REACT_APP_API_URL_INDRA + '/async_task', order).then((json: any) => {
          console.log('Result: ' + JSON.stringify(json));
          if (Array.isArray(json)) {
            json.forEach((order) => {
              console.log('Uspesne zavedeni nabidky: ' + order.id.orderId + '/' + order.id.versionId);
            });
          }
        });
      } catch (e) {
        console.log('Chyba pri zavedení nabídky: ' + e);
      }
    }
  }

  return (
    <div style={{margin: 10, flexDirection: 'column', flex: 1}}>
      <UploadTextField content={content} setContent={setContent} />
      <UploadOrderInner setContent={setContent} />
      <UploadButton sendOrder={sendOrder} />
    </div>
  );
});

interface UploadOrderInnerProps extends InputProps {
  setContent: (newText: any) => void;
}

const UploadOrderInner: FunctionComponent<UploadOrderInnerProps> = React.memo((props) => {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>();

  function upload(event: any) {
    if (!event) {
      return;
    }
    const file = event.target.files[0];
    if (!file) {
      setFileName('');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        console.log(('-----content: ' + reader.result) as string);
        props.setContent(reader.result as string);
      }
    };

    reader.readAsText(file, 'UTF-8');
    setFileName(file ? file.name : '');
    setOpen(true);

    event.target.value = '';
    // event.target.files = [];
  }

  return (
    <>
      {fileName ? 'File uploaded: ' + fileName : ''}
      <br />
      <input
        accept="all/*"
        id="outlined-button-file"
        multiple
        type="file"
        style={{display: 'none'}}
        onChange={upload}
      />
      <label htmlFor="outlined-button-file">
        <Button variant="outlined" color="primary" size="small" component="span">
          {t('indra:order.button.upload')}
        </Button>
      </label>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        open={open}
        autoHideDuration={1000}
        onClose={() => setOpen(false)}
        message="File was uploaded"
        TransitionComponent={GrowTransition}
        action={
          <React.Fragment>
            <Button variant="outlined" color="primary" size="small" onClick={() => setOpen(false)}>
              {t('indra:order.button.ok')}
            </Button>
          </React.Fragment>
        }
      />
    </>
  );
});

interface UploadButtonProps extends InputProps {
  sendOrder: (newText: any) => void;
}

const UploadButton: FunctionComponent<UploadButtonProps> = React.memo((props) => {
  const {t} = useTranslation();

  return (
    <Button variant="outlined" color="primary" size="small" onClick={props.sendOrder}>
      {t('indra:order.button.send')}
    </Button>
  );
});

interface UploadTextFieldProps extends InputProps {
  content: string;
  setContent: (newText: any) => void;
}

const UploadTextField: FunctionComponent<UploadTextFieldProps> = React.memo((props) => {
  const [content, setContent] = useState<string>(props.content);

  useEffect(() => {
    setContent(props.content);
  }, [props.content]);

  return (
    <>
      <br />
      <TextField
        label="Content of uploaded file"
        variant="outlined"
        onBlur={() => props.setContent(content)}
        onChange={(e: any) => setContent(e.target.value)}
        multiline
        value={content}
        InputLabelProps={{
          shrink: true
        }}
        rowsMax={25}
        rows={25}
        style={{width: '100%'}}
      />
      <br />{' '}
    </>
  );
});

export default UploadOrder;
