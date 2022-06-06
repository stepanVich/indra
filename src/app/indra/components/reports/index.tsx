import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
//import SaveIcon from '@material-ui/icons/Save';
import SendIcon from '@material-ui/icons/Send';
import React, { FunctionComponent } from 'react';
//import './../../root.css';
import fetchService from '../../services/fetch';
import {
  /*BrowserRouter as Router,
  Switch,
  Route,
  Link,*/
  useParams
} from "react-router-dom";
import { RouteMatchProps } from '../root';

function getReportData(reportName: string) {

  alert('Get Data for ' + reportName);

  const parameters = {
    "p-ddate":"2019-10-01",
    "p-bs-type":"ALL",
    "p-order-status":["ALL"],
    "p-partic":null,
    "p-logged-rut":null

    /*'p-ddate': formatDateToISO(reportParams.deliveryDate),
    'p-bs-type': reportParams.buySellType,
    'p-order-status': reportParams.orderStatus,
    'p-partic': partic ? partic : null,
    'p-logged-rut': currentUser ? currentUser.participant.participantId : null,*/
  };

  const reportData = {
    reportName: 'orders-overview',
    startRow: 1,
    maxRows: 10,
    parameters: parameters,
  };
  try
  {
    fetchService.post('http://172.17.107.46:8630/mb-gas/client-api/report/getData', reportData);
  } catch (e) {
    console.log('-----------error: ' + e.getMessage())
  }
  
}

async function getGridDefinition(gridId: number) {

  //alert('Get grid definition ' + gridId);

  // const parameters = {
  //   "p-ddate":"2019-10-01",
  //   "p-bs-type":"ALL",
  //   "p-order-status":["ALL"],
  //   "p-partic":null,
  //   "p-logged-rut":null

  //   /*'p-ddate': formatDateToISO(reportParams.deliveryDate),
  //   'p-bs-type': reportParams.buySellType,
  //   'p-order-status': reportParams.orderStatus,
  //   'p-partic': partic ? partic : null,
  //   'p-logged-rut': currentUser ? currentUser.participant.participantId : null,*/
  // };

  // const reportData = {
  //   reportName: 'orders-overview',
  //   startRow: 1,
  //   maxRows: 10,
  //   parameters: parameters,
  // };
  try
  {
    const jsonObject: any = await fetchService.get(process.env.REACT_APP_API_URL_INDRA + '/grid/getGrid/1000');
    //console.log('----------jsonObject: ' + JSON.stringify(jsonObject));

    //const columns = jsonObject.columns;//.toArray();

    const columns = JSON.parse(jsonObject.columns);

    //let newJson = columns.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
    //newJson = newJson.replace(/'/g, '"');

    //const columnsParased = JSON.parse(newJson);

    console.log('----------gridId: ' + jsonObject.gridId);

    console.log('----------columns: ' +  columns);

    const actions = jsonObject.actions;

    const actionsParsed = JSON.parse(actions);

    console.log('----------actions: ' +  actionsParsed);

   // const columns = JSON.parse(jsonObject.columns);

    //console.log('----------columns: ' + columns.length);
    

  } catch (e) {
    console.log('-----------error: ' + e/*.getMessage()*/)
  }
  
}


const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function Report() {
  let { id } = useParams();

  const classes = useStyles();

  return <><Button
  variant="contained"
  color="primary"
  size="small"
  className={classes.button}
  startIcon={<SendIcon />}
  onClick={() => {
    //let { id } = useParams();
    //alert('Get Report data: ' + id);
    getReportData(id);
  }}

>
  Read reports data
</Button>
<Button
  variant="contained"
  color="primary"
  size="small"
  className={classes.button}
  startIcon={<SendIcon />}
  onClick={() => {
    //let { id } = useParams();
    //alert('Get Report data: ' + id);
    getGridDefinition(1000);
  }}

>
  Read Grid ID
</Button></>
}

const ReportData: FunctionComponent<RouteMatchProps> = React.memo(() => {

  /*constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }*/

 // render() {
    
    
    return (
      <>
      {/* <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form> */}
      {/* <ReactVirtualizedTable /> */}
      <Report />
    </>
    );
 // }
});

export default ReportData;