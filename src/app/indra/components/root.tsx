import {Button, createStyles, InputProps, makeStyles, TextField, withStyles, List, ListItem} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CreateOrder from 'app/indra/components/forms/order/createOrder';
import Grid from 'app/indra/components/grids/grid';
import ReportGrid from 'app/indra/components/grids/old_virtualized/ReportGrid';
import ReportGridVirtualized from 'app/indra/components/grids/old_virtualized/VirtualizedGrid';
import LayoutController from 'app/indra/components/layouts/layoutController';
import SplitPaneComponent from 'app/indra/components/layouts/splitComponentNew';
import WrappedResizer from 'app/indra/components/layouts/wrappedResizer';
import ReportData from 'app/indra/components/reports';
import {VirtualizedTable} from 'app/indra/components/root_old';
import App from 'app/indra/components/table/filtered/App';
import useKeyboardShortcut from 'app/indra/hooks/useKeyboardShortcut';
import {useStoreActions, useStoreState} from 'easy-peasy';
import React, {useCallback, useEffect, useState} from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import AppMenu from 'app/indra/navigation/appMenu';
import Time from 'app/indra/components/time';
import NewPanelModal from 'app/indra/components/panels/newPanelModal';
import {PanelOrderAndType, PanelTypeAndDefinition} from 'app/indra/components/panels/panelController';
import settingsService from 'app/indra/services/settings';
import i18n from 'app/i18n';
import {useTranslation} from 'react-i18next';
import storageService from 'app/indra/services/storage';
import {CZ, EN} from 'app/indra/utils/const';
import headerBackground from '../resources/images/header.png';
import logoImage from '../resources/images/logo.png';
import eleCsImage from '../resources/images/el_active_cs.png';
import eleEnImage from '../resources/images/el_active_en.png';
import bulletImage from '../resources/images/bullet02.png';
import vipImage from '../resources/images/status_offline.png';
import addPanelImage from '../resources/images/add_panel.png';
import flagCzImage from '../resources/images/flag_cz.png';
import flagEnImage from '../resources/images/flag_en.png';
import Login from 'app/indra/screens/loginPage/loginPage';

const styles = createStyles({
  box1: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    // borderWidth: 2,
    // borderColor: 'black',
    //maxWidth: 300,
    //minWidth: 300,
    // borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 86,
    //padding: 5,
    // margin: 1,
    boxSizing: 'border-box',
    flex: 0,
    // paddingTop: 30,
    // background: 'yellow',
    //width: 200,
    // display: 'block',
    // overflow: 'hidden',
    // borderRadius: 3,
    // boxShadow: '0 3px 5px 2px rgba(48, 38, 64, .3)',
    // minHeight: 48,
    //background: 'linear-gradient(to bottom, #334EA1, #152D74)' //'#334EA1',
    background: `#334EA1 url(${headerBackground}) no-repeat right center`
    /*color: 'white',
    height: 48,
    padding: '0 30px',*/
  },
  box2: {
    display: 'flex',
    flexDirection: 'column',
    //background: 'grey',
    minWidth: 10,
    //flexGrow: 1,
    // width: '100%',
    boxSizing: 'border-box',
    flex: 1
  }
});

function Root(props: any) {
  const [lang, setLang] = useState<string>();

  const [showNewPanelModal, setShowNewPanelModal] = useState<boolean>(false);
  const [newPanelDataByModal, setNewPanelDataByModal] = useState<PanelTypeAndDefinition>();

  const token = useStoreState((state) => state.token);

  useEffect(() => {
    async function init() {
      await settingsService.init();
      async function getLanguage() {
        const newLanguage = await storageService.getLanguage();
        setLang(newLanguage);
      }
      getLanguage();
    }
    init();
  }, []);

  const {classes} = props;

  if (!token) {
    return <Login />;
  }

  return (
    token && (
      <Router>
        <Box display="flex" flexDirection="column" style={{flex: 1, boxSizing: 'border-box'}}>
          <Box className={classes.box1}>
            <Box style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
              <Box style={{flex: 1, minWidth: 200, paddingLeft: 15}}>
                <img src={logoImage} />
              </Box>
              <Box
                style={{
                  width: 700,
                  minWidth: 700,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                <Box style={{maxHeight: 50}}>
                  <img src={lang == CZ ? eleCsImage : eleEnImage} />
                </Box>
                <Box style={{width: 80, textAlign: 'center'}}>
                  <img src={bulletImage} style={{marginTop: 6, marginLeft: 6}} />
                </Box>
                <Box style={{flex: 0}}>
                  <Logged />
                </Box>
                <Box style={{flex: 1, textAlign: 'center'}}>
                  <img src={bulletImage} style={{verticalAlign: 'middle', marginTop: 6}} /> <Time />
                </Box>
                <Box style={{paddingTop: 10, paddingRight: 10}}>
                  <img src={vipImage} />
                </Box>
              </Box>
            </Box>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'end',
                paddingLeft: 15,
                paddingRight: 15,
                paddingBottom: 10
              }}>
              <AppMenu />
              <AddPanelButton setShowNewPanelModal={setShowNewPanelModal} />
              <LanguageButtons lang={lang} setLang={setLang} />
              <LogoutButton />
            </Box>
          </Box>
          <Box className={classes.box2}>
            {showNewPanelModal && (
              <NewPanelModal
                setShowNewPanelModal={setShowNewPanelModal}
                setNewPanelDataByModal={setNewPanelDataByModal}
              />
            )}
            <MenuSwitch newPanelDataByModal={newPanelDataByModal} />
          </Box>
        </Box>
      </Router>
    )
  );
}

export default withStyles(styles)(Root);

const useStyles = makeStyles({
  button: {
    background: 'linear-gradient(45deg, #3F51B5 30%, #5F6589 90%)',
    '&:hover': {
      background: 'linear-gradient(180deg, #3F51B5 30%, #5F6589 90%)'
    }
  }
});

const Logged = (props: any) => {
  const {t} = useTranslation();

  const token = useStoreState((state) => state.token);

  return (
    <Box style={{/*flex: 1, display: 'flex', flexDirection: 'row',*/ textAlign: 'center'}}>
      <span style={{/*flex: 0,*/ fontWeight: 'bold', paddingRight: 10, whiteSpace: 'nowrap', color: 'white'}}>
        {t('indra:account.loggedIn')}
      </span>
      <span style={{/*flex: 1, textAlign: 'right',*/ whiteSpace: 'nowrap', color: '#9cd1e0'}}>
        {token.firstName + ' ' + token.surname + ', ' + token.particId}
      </span>
    </Box>
  );
};

const AddPanelButton = ({setShowNewPanelModal}: any) => {
  return (
    <Box flexDirection="row" style={{marginLeft: 20}}>
      <img
        src={addPanelImage}
        width="24"
        onClick={() => {
          setShowNewPanelModal(true);
        }}
        style={{marginRight: 2, cursor: 'pointer', filter: 'invert(100%)', opacity: 0.5}}
      />
    </Box>
  );
};

const LanguageButtons = (props: any) => {
  const {t} = useTranslation();
  const setLanguage = useStoreActions((actions: any) => settingsService.setLanguage);

  useEffect(() => {
    async function getLanguage() {
      const newLanguage = await storageService.getLanguage();
    }
    getLanguage();
  }, []);

  async function onSetLang(lang: string) {
    props.setLang(lang);
    await setLanguage(lang);
  }

  return (
    <Box flexDirection="row" style={{marginLeft: 10, whiteSpace: 'nowrap'}}>
      <img
        src={flagCzImage}
        title={t('indra:lang.button.cz')}
        onClick={() => onSetLang(CZ)}
        style={{cursor: 'pointer', marginLeft: 5}}
      />
      <img
        src={flagEnImage}
        title={t('indra:lang.button.en')}
        onClick={() => onSetLang(EN)}
        style={{cursor: 'pointer', marginLeft: 5}}
      />
    </Box>
  );
};

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const LogoutButton = (props: any) => {
  const {t} = useTranslation();

  const setToken = useStoreActions((actions: any) => actions.setToken);

  return (
    <Box flexDirection="row" style={{marginLeft: 10}}>
      <ExitToAppIcon
        color="secondary"
        onClick={() => setToken(null)}
        style={{cursor: 'pointer', marginLeft: 5, color: 'white'}}
      />
    </Box>
  );
};

export type RouteMatchProps = {
  match: any;
};

const MenuSwitch = ({newPanelDataByModal}: any) => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/table">
        <Table />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/virtualizedtable/:id" render={({match}) => <VirtualizedTable match={match} />} />
      <Route
        path="/layout/:id"
        render={({match}) => <LayoutController match={match} newPanelDataByModal={newPanelDataByModal} />}
      />
      <Route path="/reportData/:id" render={({match}) => <ReportData match={match} />} />
      <Route path="/filteredTable/:id" render={({match}) => <App match={match} />} />
      <Route path="/reports/:id" render={({match}) => <ReportGrid match={match} />} />
      <Route
        path="/reports2/:id"
        render={() => (
          <div style={{height: 800}}>
            <ReportGridVirtualized gridId={1001} />
          </div>
        )}
      />
      <Route
        path="/grid/:id"
        render={() => (
          <div style={{display: 'flex', flexDirection: 'column', padding: 20}}>
            {/* <Grid gridId={1001} outputs={[]} userSettings={null} writeSettings={()=>{}}/> */}
          </div>
        )}
      />
    </Switch>
  );
};

const useStyles1 = makeStyles((theme) => ({
  textField: {
    //border: '1px solid green',
    padding: 2
  },
  outlinedRoot: {
    '&:hover': {
      border: '1px solid red'
    }
  },
  focused: {
    '&$focused': {
      border: '1px solid yellow'
    }
  }
}));

function MyTextField() {
  const classes = useStyles1();

  const InputProps = {
    classes: {
      //root: classes.outlinedRoot,
      //focused: classes.focused
    },
    autoFocus: true
  };

  const InputLabelProps = {
    shrink: true,
    required: true
  };

  return (
    <TextField
      id="outlined-name"
      label="Name"
      className={classes.textField}
      margin="normal"
      variant="outlined"
      InputProps={InputProps}
      InputLabelProps={InputLabelProps}
    />
  );
}

function Home() {
  {
    /* YOU CAN CHANGE IT in .env file*/
  }
  return (
    <div
      style={{
        flex: 1,
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <div style={{fontSize: 25}}>{'Welcome to ReactJS created by INDRA'}</div>
      <br />
      <div style={{fontSize: 14}}>{'Connected to: ' + process.env.REACT_APP_API_URL_INDRA}</div>
      {/* <List>
    <Subheader>Nested List Items</Subheader>
    <ListItem primaryText="Sent mail" leftIcon={<ContentSend />} />
    <ListItem primaryText="Drafts" leftIcon={<ContentDrafts />} />
    <ListItem
      primaryText="Inbox"
      leftIcon={<ContentInbox />}
      initiallyOpen={true}
      primaryTogglesNestedList={true}
      nestedItems={[
        <ListItem
          key={1}
          primaryText="Starred"
          leftIcon={<ActionGrade />}
        />,
        <ListItem
          key={2}
          primaryText="Sent Mail"
          leftIcon={<ContentSend />}
          disabled={true}
          nestedItems={[
            <ListItem key={1} primaryText="Drafts" leftIcon={<ContentDrafts />} />,
          ]}
        />,
        <ListItem
          key={3}
          primaryText="Inbox"
          leftIcon={<ContentInbox />}
          open={this.state.open}
          onNestedListToggle={this.handleNestedListToggle}
          nestedItems={[
            <ListItem key={1} primaryText="Drafts" leftIcon={<ContentDrafts />} />,
          ]}
        />,
      ]}
    />
  </List> */}
    </div>
  );
}

function Table() {
  return <WrappedResizer>{/* <CreateOrder outputs={[]} userSettings={} writeSettings={()=>{}} /> */}</WrappedResizer>;
}

interface UpdateComponentProps extends InputProps {
  setNewValue: (value: any) => void;
}

const UpdateComponent = React.memo((props: UpdateComponentProps) => {
  console.log('-------------Rerender UpdateComponent');
  return (
    <Button
      onClick={() => {
        props.setNewValue('XXXXX');
      }}>
      {' '}
      {'Set Value'}{' '}
    </Button>
  );
});

function Dashboard() {
  const [value, setValue] = useState<string>('');

  const keys = ['Control', 'Shift', 'S'];

  const handleKeyboardShortcut = useCallback((keys) => {
    console.log('---------pressed CTRL S -> SAVE LAYOUT DEFINITION');
  }, []);

  useKeyboardShortcut(keys, handleKeyboardShortcut);

  return (
    <div>
      <h2>Dashboard</h2>
      {value}
      <UpdateComponent setNewValue={setValue} />
    </div>
  );
}
