import DateFnsUtils from '@date-io/date-fns';
import {Box, Button, Grid, Input} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Radio, {RadioProps} from '@material-ui/core/Radio';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Checkbox, {CheckboxProps} from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date';
import {PanelProp} from '../../panels/panelController';
import {
  DARK_ORANGE,
  HEADER_HEIGHT,
  LIGHT_BLUE,
  LIGHT_ORANGE,
  ORDER_NUMBER_OF_ROWS,
  ORDER_NUMBER_OF_SEGMENTS,
  ROW_HEIGHT,
  TEXT_MAX_LENGTH
} from '../../../utils/const';
import moment from 'moment';
import React, {FunctionComponent, useEffect, useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {useTranslation} from 'react-i18next';
import fetchService from 'app/indra/services/fetch';

interface HeaderProps {
  tradeDate: Date | null;
  owner: string;
  ownerLabel: string;
  connectionType: string;
  sender: string;
  senderLabel: string;
  beginOfParring: string;
  counterparty: number;
  typeOfProcessing: string;
  pList: string[];
  onTradeDateChange: (newDate: Date | null) => void;
  onOwnerChange: (newOwner: string) => void;
  onConnectionTypeChange: (newConnection: string) => void;
  onSenderChange: (newSender: string) => void;
  onParringChange: (newParring: string) => void;
  onCounterpartyChange: (newCounterparty: number) => void;
  onProcessingChange: (newProcessing: string) => void;
  onPListChange: (newPList: string[]) => void;
}

interface CalendarProps {
  tradeDate: Date | null;
  onDateChange: (newDate: Date | null) => void;
}

interface OwnerProps {
  owner: string;
  onOwnerChange: (newOwner: string) => void;
  ownerLabel: string;
}

interface ConnectionProps {
  connection: string;
  onConnectionChange: (newConnection: string) => void;
}

interface SenderProps {
  sender: string;
  onSenderChange: (newSender: string) => void;
  senderLabel: string;
}

interface ParringProps {
  parring: string;
  onParringChange: (newParring: string) => void;
}

interface CounterpartProps {
  counterpart: number;
  pList: string[];
  onCounterpartChange: (newCouterPart: number) => void;
}

interface ProcessingProps {
  processing: string;
  onProcessingChange: (newProcessing: string) => void;
}

let participants: string[] = [];
let participantsEan: string[] = [];

const initData = () => {
  const hourData: string[][] = [];
  for (let hour = 0; hour < ORDER_NUMBER_OF_ROWS; hour++) {
    const segData: string[] = [];
    for (let seg = 0; seg < 2; seg++) {
      segData.push('');
    }
    hourData.push(segData);
  }
  return hourData;
};

function removeDecimals(n: string, numberOfDecimal: number): string {
  let sNumber = n;
  let pointIndex = sNumber.indexOf('.');
  if (pointIndex < 0) {
    return n;
  }
  if (numberOfDecimal <= 0) {
    return sNumber.slice(0, pointIndex);
  } else {
    return sNumber.slice(0, pointIndex + 1 + numberOfDecimal);
  }
}

function addDecimals(n: string, numberOfDecimal: number): string {
  if (n == '') return '';
  return String(parseFloat(n).toFixed(numberOfDecimal));
}

let isFirst = true;

const RRD: FunctionComponent<PanelProp> = React.memo((props) => {
  const {t} = useTranslation();

  const [tradeDate, setTradeDate] = useState<Date | null>(new Date());
  const [owner, setOwner] = useState('859 1824 0000 07');
  const [ownerLabel, setOwnerLabel] = useState('OTE, a.s.');
  const [connectionType, setConnectionType] = useState('Domácí RD');
  const [sender, setSender] = useState('859 1824 0000 07');
  const [senderLabel, setSenderLabel] = useState('OTE, a.s.');
  const [beginOfParring, setParring] = useState('1');
  const [counterparty, setCounterparty] = useState(0);
  const [typeOfProcessing, setProcessing] = useState('Denní RD');
  const [qtyData, setQtyData] = useState(initData());
  const [activeColumns, setActiveColumns] = useState([true, true]);
  const [participantsList, setParticipantsList] = useState(['']);

  if (isFirst) {
    try {
      fetch(process.env.REACT_APP_API_URL_INDRA + '/dm/getParticList')
        .then((res) => res.json())
        .then((out) => {
          let json = out;

          participants = [];
          participantsEan = [];

          for (let entry of json) {
            participants.push(entry['partic_desc']);
            participantsEan.push(entry['partic_ean']);
          }

          setParticipantsList(participants);
        })
        .catch((err) => console.error(err));
    } catch (e) {
      console.log('Error when loading counterparts: ' + e);
    }

    isFirst = false;
  }

  async function sendJson() {
    // main properties
    let messageIdentification = '';
    let senderString = sender.replaceAll(' ', '');
    let sysDate = new Date().toISOString();

    let utcTradeDateStart = '';
    let utcTradeDateEnd = '';

    if (tradeDate) {
      let d = new Date(tradeDate.toString());
      // add day to current date
      d.setDate(d.getDate() - 1);
      utcTradeDateStart = d.toISOString().slice(0, 10);
    } else {
      let d = new Date();
      // add day to current date
      d.setDate(d.getDate() - 1);
      utcTradeDateStart = d.toISOString().slice(0, 10);
    }

    if (tradeDate) {
      utcTradeDateEnd = new Date(tradeDate.toString()).toISOString().slice(0, 10);
    } else {
      utcTradeDateEnd = new Date().toISOString().slice(0, 10);
    }

    let timezone_offset_min = new Date().getTimezoneOffset();
    let offset_hrs = parseInt(String(Math.ceil(Math.abs(timezone_offset_min / 60))));
    let offset_min = Math.abs(timezone_offset_min % 60);

    if (timezone_offset_min < 0) {
      offset_hrs = (24 - offset_hrs) % 24;
      offset_min = (60 - offset_min) % 60;
    }

    let hourPart = String(offset_hrs);
    let minPart = String(offset_min);

    if (offset_hrs < 10) hourPart = '0' + String(offset_hrs);
    if (offset_min < 10) minPart = '0' + String(offset_min);

    let timezonePart = hourPart + ':' + minPart;

    let utcTradeDate = utcTradeDateStart + 'T' + timezonePart + 'Z/' + utcTradeDateEnd + 'T' + timezonePart + 'Z';

    let ownerString = owner.replaceAll(' ', '');

    let senderPart = senderString.slice(senderString.length - 5);

    let cPart = participantsEan[counterparty].replaceAll(' ', '');
    cPart = cPart.slice(cPart.length - 5);

    let date = '';
    if (tradeDate) {
      date = new Date(tradeDate.toString()).toISOString().slice(0, 10).replaceAll('-', '');
    } else {
      date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    }

    messageIdentification = senderPart + '_' + cPart + '_' + date + '_A01';

    let json = {
      ScheduleMessage: {
        MessageIdentification: messageIdentification,
        MessageVersion: '11',
        MessageType: 'A01',
        ProcessType: 'A02',
        ScheduleClassificationType: 'A01',
        SenderIdentification: {
          codingScheme: 'A10',
          v: senderString
        },
        SenderRole: 'A04',
        ReceiverIdentification: {
          codingScheme: 'A10',
          v: '8591824000007'
        },
        ReceiverRole: 'A05',
        MessageDateTime: sysDate,
        ScheduleTimeInterval: utcTradeDate,
        Domain: {
          codingScheme: 'A01',
          v: '10YCZ-CEPS-----N'
        },
        SubjectParty: {
          codingScheme: 'A10',
          v: ownerString
        },
        SubjectRole: 'A01',
        MatchingPeriod: utcTradeDate,
        ScheduleTimeSeries: [] as any
      }
    };

    // set field 0
    if (activeColumns[0]) {
      let interval: any[] = [];
      // fill interval from form
      qtyData.forEach(function (val, i) {
        if (val[0] != '') {
          interval.push({
            Pos: i + 1,
            Qty: val[0]
          });
        }
      });

      let c = {
        SendersTimeSeriesIdentification: 'TS_001',
        SendersTimeSeriesVersion: '1',
        BusinessType: 'I',
        ObjectAggregation: 'A03',
        InArea: {
          codingScheme: 'A01',
          v: '10YCZ-CEPS-----N'
        },
        OutArea: {
          codingScheme: 'A01',
          v: '10YCZ-CEPS-----N'
        },
        InParty: {
          codingScheme: 'A10',
          v: senderString
        },
        OutParty: {
          codingScheme: 'A10',
          v: participantsEan[counterparty]
        },
        MeasurementUnit: 'MAW',
        Period: {
          TimeInterval: utcTradeDate,
          Resolution: 'PT15M',
          Interval: interval
        }
      };

      json['ScheduleMessage']['ScheduleTimeSeries'].push(c);
    }

    // set field 1
    if (activeColumns[1]) {
      let interval: any[] = [];
      // fill interval from form
      qtyData.forEach(function (val, i) {
        if (val[1] != '') {
          interval.push({
            Pos: i + 1,
            Qty: val[1]
          });
        }
      });

      let c = {
        SendersTimeSeriesIdentification: 'TS_002',
        SendersTimeSeriesVersion: '1',
        BusinessType: 'I',
        ObjectAggregation: 'A03',
        InArea: {
          codingScheme: 'A01',
          v: '10YCZ-CEPS-----N'
        },
        OutArea: {
          codingScheme: 'A01',
          v: '10YCZ-CEPS-----N'
        },
        InParty: {
          codingScheme: 'A10',
          v: participantsEan[counterparty]
        },
        OutParty: {
          codingScheme: 'A10',
          v: senderString
        },
        MeasurementUnit: 'MAW',
        Period: {
          TimeInterval: utcTradeDate,
          Resolution: 'PT15M',
          Interval: interval
        }
      };

      json['ScheduleMessage']['ScheduleTimeSeries'].push(c);
    }

    // Write object to stdout
    console.log(json);

    // send json object
    try {
      await fetchService
        .post(process.env.REACT_APP_API_URL_INDRA + '/async_task/rrd', json)
        .then((res: any) => console.log(res))
        .then((out) => {
          console.log(out);
        })
        .catch((err) => console.error(err));
    } catch (e) {
      console.log('Error when sending rrd: ' + e);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'auto'
        }}>
        <div style={{flex: 0}}>
          <HeaderSelection />
          <div className="form-wrapper" style={{backgroundColor: '#B1D9FF'}}>
            <HeaderTable
              tradeDate={tradeDate}
              owner={owner}
              ownerLabel={ownerLabel}
              connectionType={connectionType}
              sender={sender}
              senderLabel={senderLabel}
              beginOfParring={beginOfParring}
              counterparty={counterparty}
              typeOfProcessing={typeOfProcessing}
              pList={participantsList}
              onTradeDateChange={setTradeDate}
              onOwnerChange={setOwner}
              onConnectionTypeChange={setConnectionType}
              onSenderChange={setSender}
              onParringChange={setParring}
              onCounterpartyChange={setCounterparty}
              onProcessingChange={setProcessing}
              onPListChange={setParticipantsList}
              {...props}
            />
          </div>
        </div>
        <div className="block-header">
          <span className="block-header-text">{t('indra:form.title.detail')}</span>
        </div>
        <div style={{flex: 1, overflow: 'auto'}} className="form-table">
          <Box>
            <React.Fragment>
              <FormHeader activeColumns={activeColumns} setActiveColumns={setActiveColumns} />
              <FormDetail
                setQtyData={setQtyData}
                qtyData={qtyData}
                activeColumns={activeColumns}
                setActiveColumns={setActiveColumns}
              />
            </React.Fragment>
          </Box>
        </div>
      </div>
      <Box style={{flex: 0}}>
        <Button variant="outlined" color="primary" onClick={sendJson}>
          {t('indra:rrd.button.new')}
        </Button>
      </Box>
    </div>
  );
});

interface FormHeaderProps {
  activeColumns: boolean[];
  setActiveColumns: (newActiveColumns: boolean[]) => void;
}

const FormHeader: FunctionComponent<FormHeaderProps> = React.memo((props) => {
  const {t} = useTranslation();
  const segmentCells = [];
  const segmentPriceAndAmountCells = [];

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, i: number) => {
    // set comments on index
    props.activeColumns[i] = event.target.checked;
    let c = Object.assign([], props.activeColumns);
    // update comments
    props.setActiveColumns(c);
  };

  for (let seg = 0; seg < 2; seg++) {
    let bgColor = '#ccecff';
    if (seg == 0) {
      bgColor = '#ccecff';
    } else {
      bgColor = '#ccff99';
    }
    segmentCells.push(
      <Box
        display="flex"
        key={'SegHead_' + seg}
        style={{
          backgroundColor: DARK_ORANGE,
          border: 0,
          borderTop: '2px solid',
          borderRight: '2px solid',
          minWidth: 98,
          maxWidth: 98,
          minHeight: HEADER_HEIGHT,
          height: HEADER_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1
        }}>
        <StyledCheckbox checked={props.activeColumns[seg]} onChange={(e) => handleCheckboxChange(e, seg)} />
      </Box>
    );
    segmentPriceAndAmountCells.push(
      <Box
        display="flex"
        key={'SegDet_' + seg}
        style={{
          backgroundColor: bgColor,
          borderTop: '2px solid',
          borderBottom: '2px solid',
          borderRight: '2px solid',
          textAlign: 'center',
          minWidth: 98,
          maxWidth: 98,
          justifyContent: 'center',
          alignItems: 'stretch',
          boxSizing: 'border-box',
          flex: 1,
          fontWeight: 700
        }}>
        <span style={{position: 'relative', top: 1}}>{t('indra:rrd.detail.quantity')}</span>
      </Box>
    );
  }

  return (
    <>
      <Grid style={{border: 0, display: 'flex', minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT}}>
        <Box
          display="flex"
          style={{
            backgroundColor: LIGHT_ORANGE,
            minWidth: 137,
            maxWidth: 137,
            height: HEADER_HEIGHT,
            borderLeft: '2px solid',
            borderTop: '2px solid',
            borderRight: '2px solid',
            boxSizing: 'border-box',
            fontWeight: 700,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {t('indra:rrd.detail.realize')}
        </Box>
        {segmentCells}
      </Grid>

      <Grid style={{border: 0, display: 'flex', minHeight: 32, height: 32}}>
        <Box
          display="flex"
          style={{
            backgroundColor: 'white',
            minWidth: 137,
            maxWidth: 137,
            height: 32,
            borderLeft: '2px solid',
            borderTop: '1px solid',
            borderRight: '2px solid',
            boxSizing: 'border-box',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {t('indra:rrd.detail.direction')}
        </Box>
        <Box
          display="flex"
          key={'Direction_1'}
          style={{
            backgroundColor: '#ccecff',
            border: 0,
            borderTop: '1px solid',
            borderRight: '2px solid',
            minWidth: 98,
            maxWidth: 98,
            minHeight: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            fontWeight: 700,
            flex: 1
          }}>
          {t('indra:rrd.detail.direction.buy')}
        </Box>
        <Box
          display="flex"
          key={'Direction_2'}
          style={{
            backgroundColor: '#ccff99',
            border: 0,
            borderTop: '1px solid',
            borderRight: '2px solid',
            minWidth: 98,
            maxWidth: 98,
            minHeight: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            fontWeight: 700,
            flex: 1
          }}>
          {t('indra:rrd.detail.direction.sell')}
        </Box>
      </Grid>

      <Grid style={{border: 0, display: 'flex', minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT}}>
        <Box
          display="flex"
          style={{
            backgroundColor: 'white',
            minWidth: 137,
            maxWidth: 137,
            height: HEADER_HEIGHT,
            borderLeft: '2px solid',
            borderTop: '1px solid',
            borderRight: '2px solid',
            boxSizing: 'border-box',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {t('indra:rrd.detail.diagram.id')}
        </Box>
        <Box
          display="flex"
          key={'Direction_1'}
          style={{
            backgroundColor: '#ccecff',
            border: 0,
            borderTop: '1px solid',
            borderRight: '2px solid',
            minWidth: 98,
            maxWidth: 98,
            minHeight: HEADER_HEIGHT,
            height: HEADER_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            fontWeight: 700,
            flex: 1
          }}>
          TS_001
        </Box>
        <Box
          display="flex"
          key={'Direction_2'}
          style={{
            backgroundColor: '#ccff99',
            border: 0,
            borderTop: '1px solid',
            borderRight: '2px solid',
            minWidth: 98,
            maxWidth: 98,
            minHeight: HEADER_HEIGHT,
            height: HEADER_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            fontWeight: 700,
            flex: 1
          }}>
          TS_002
        </Box>
      </Grid>

      <Grid style={{border: 0, display: 'flex', minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT}}>
        <Box
          display="flex"
          style={{
            backgroundColor: 'white',
            minWidth: 137,
            maxWidth: 137,
            height: HEADER_HEIGHT,
            borderLeft: '2px solid',
            borderTop: '1px solid',
            borderRight: '2px solid',
            boxSizing: 'border-box',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {t('indra:rrd.detail.diagram.version')}
        </Box>
        <Box
          display="flex"
          key={'Direction_1'}
          style={{
            backgroundColor: '#ccecff',
            border: 0,
            borderTop: '1px solid',
            borderRight: '2px solid',
            minWidth: 98,
            maxWidth: 98,
            minHeight: HEADER_HEIGHT,
            height: HEADER_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            fontWeight: 700,
            flex: 1
          }}>
          1
        </Box>
        <Box
          display="flex"
          key={'Direction_2'}
          style={{
            backgroundColor: '#ccff99',
            border: 0,
            borderTop: '1px solid',
            borderRight: '2px solid',
            minWidth: 98,
            maxWidth: 98,
            minHeight: HEADER_HEIGHT,
            height: HEADER_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            fontWeight: 700,
            flex: 1
          }}>
          1
        </Box>
      </Grid>

      <Grid style={{display: 'flex', minHeight: ROW_HEIGHT, height: ROW_HEIGHT}}>
        <Box
          display="flex"
          style={{
            fontWeight: 'bold',
            backgroundColor: LIGHT_BLUE,
            maxWidth: 50,
            minWidth: 50,
            border: '2px solid',
            borderRight: '1px solid',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
          {t('indra:rrd.detail.index')}
        </Box>
        <Box
          display="flex"
          style={{
            fontWeight: 'bold',
            backgroundColor: LIGHT_BLUE,
            maxWidth: 87,
            minWidth: 87,
            border: 0,
            borderBottom: '2px solid',
            borderTop: '2px solid',
            borderRight: '2px solid',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
          {t('indra:rrd.detail.time')}
        </Box>
        {segmentPriceAndAmountCells}
      </Grid>
    </>
  );
});

const CalendarCell: FunctionComponent<CalendarProps> = React.memo((props: CalendarProps) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  const handleDateChange = (date: MaterialUiPickersDate) => {
    let dateValue = date ? new Date(date.getTime()) : null;
    let dateString = date ? date.toDateString() : new Date().toDateString();
    props.onDateChange(dateValue);
  };

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '2 1 0px',
        width: 0,
        minWidth: 276
      }}>
      <Grid
        item
        className={classes.textCellStyle}
        style={{
          minWidth: 144
        }}>
        {t('indra:rrd.deliveryDay')}
      </Grid>
      <Grid
        item
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableToolbar
            autoOk
            variant="inline"
            format={t('indra:format.date')}
            id="date-picker-inline"
            value={props.tradeDate}
            onChange={handleDateChange}
            InputProps={{
              disableUnderline: true
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>
    </Box>
  );
});

const OwnerCell: FunctionComponent<OwnerProps> = React.memo((props) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '3 1 0px',
        width: 0,
        minWidth: 269
      }}>
      <div
        style={{
          display: 'flex',
          flex: '1 1 0px'
        }}>
        <Grid
          className={classes.textCellStyle}
          style={{
            minWidth: 78
          }}>
          {t('indra:rrd.owner')}
        </Grid>
      </div>
      <div
        style={{
          display: 'flex',
          flex: '2 1 0px'
        }}>
        <Grid
          className={classes.compCellStyle}
          style={{
            minWidth: 132
          }}>
          <Input
            disabled={true}
            disableUnderline={true}
            defaultValue={props.owner}
            inputProps={{
              style: {
                textAlign: 'right'
              }
            }}
          />
        </Grid>
        <Grid
          className={classes.textCellStyle}
          style={{
            minWidth: 59
          }}>
          <span className="label">{props.ownerLabel}</span>
        </Grid>
      </div>
    </Box>
  );
});

const ConnectionCell: FunctionComponent<ConnectionProps> = React.memo((props) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '2 1 0px',
        width: 0,
        minWidth: 276
      }}>
      <Grid
        item
        className={classes.textCellStyle}
        style={{
          minWidth: 144
        }}>
        {t('indra:rrd.transportType')}
      </Grid>
      <Grid
        item
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <Input disabled={true} disableUnderline={true} defaultValue={props.connection} />
      </Grid>
    </Box>
  );
});

const SenderCell: FunctionComponent<SenderProps> = React.memo((props) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '3 1 0px',
        width: 0,
        minWidth: 269
      }}>
      <div
        style={{
          display: 'flex',
          flex: '1 1 0px'
        }}>
        <Grid
          className={classes.textCellStyle}
          style={{
            minWidth: 78
          }}>
          {t('indra:rrd.sender')}
        </Grid>
      </div>
      <div
        style={{
          display: 'flex',
          flex: '2 1 0px'
        }}>
        <Grid
          className={classes.compCellStyle}
          style={{
            minWidth: 132
          }}>
          <Input
            disabled={true}
            disableUnderline={true}
            defaultValue={props.sender}
            inputProps={{
              style: {
                textAlign: 'right'
              }
            }}
          />
        </Grid>
        <Grid
          className={classes.textCellStyle}
          style={{
            minWidth: 59
          }}>
          <span className="label">{props.senderLabel}</span>
        </Grid>
      </div>
    </Box>
  );
});

const ParringCell: FunctionComponent<ParringProps> = React.memo((props) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '2 1 0px',
        width: 0,
        minWidth: 276
      }}>
      <Grid
        item
        className={classes.textCellStyle}
        style={{
          minWidth: 144
        }}>
        {t('indra:rrd.matchingPeriodStart')}
      </Grid>
      <Grid
        item
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <Input
          disabled={true}
          disableUnderline={true}
          defaultValue={props.parring}
          inputProps={{
            style: {
              textAlign: 'right'
            }
          }}
        />
      </Grid>
    </Box>
  );
});

const CounterpartCell: FunctionComponent<CounterpartProps> = React.memo((props) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  const handlePListChange = (event: React.ChangeEvent<{name?: string | undefined; value: unknown}>) => {
    props.onCounterpartChange(Number(event.target.value));
  };

  const items: JSX.Element[] = [];

  for (let i = 0; i < props.pList.length; i++) {
    let isSelected = i == 0 ? true : false;
    items.push(
      <MenuItem selected={isSelected} key={'PList_' + i} value={i}>
        {' '}
        {props.pList[i]}{' '}
      </MenuItem>
    );
  }

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '3 1 0px',
        width: 0,
        minWidth: 269
      }}>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: 78
        }}>
        {t('indra:rrd.counterparty')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 191,
          flex: 2
        }}>
        <Select
          value={props.counterpart}
          onChange={handlePListChange}
          disableUnderline
          style={{
            width: '100%'
          }}>
          {items}
        </Select>
      </Grid>
    </Box>
  );
});

const ProcessingCell: FunctionComponent<ProcessingProps> = React.memo((props) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  return (
    <React.Fragment>
      <Box
        className={classes.boxStyle}
        style={{
          flex: '2 1 0px',
          width: 0,
          minWidth: 276
        }}>
        <Grid
          item
          className={classes.textCellStyle}
          style={{
            minWidth: 144
          }}>
          {t('indra:rrd.processingType')}
        </Grid>
        <Grid
          item
          className={classes.compCellStyle}
          style={{
            minWidth: 132
          }}>
          <Input disabled={true} disableUnderline={true} defaultValue={props.processing} />
        </Grid>
      </Box>
      <Box
        className={classes.boxStyle}
        style={{
          flex: '3 1 0px',
          width: 0,
          minWidth: 316
        }}>
        <Grid
          className={classes.textCellStyle}
          style={{
            minWidth: 184
          }}></Grid>
        <Grid
          className={classes.compCellStyle}
          style={{
            minWidth: 132,
            flex: 2
          }}></Grid>
      </Box>
    </React.Fragment>
  );
});

const HeaderSelection: FunctionComponent = React.memo((props) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  return (
    <Box className={[classes.gridOuter, 'block-header'].join(' ')}>
      <Grid className={classes.grid}>
        <span className="block-header-text">{t('indra:form.title.header')}</span>
      </Grid>
    </Box>
  );
});

const HeaderTable: FunctionComponent<HeaderProps> = React.memo((props) => {
  const classes = gridStyles();

  return (
    <Box className={[classes.gridOuter, 'form-block'].join(' ')}>
      <Grid className={classes.grid}>
        <CalendarCell tradeDate={props.tradeDate} onDateChange={props.onTradeDateChange} />
        <OwnerCell owner={props.owner} onOwnerChange={props.onOwnerChange} ownerLabel={props.ownerLabel} />
      </Grid>

      <Grid className={classes.grid}>
        <ConnectionCell connection={props.connectionType} onConnectionChange={props.onConnectionTypeChange} />
        <SenderCell sender={props.sender} onSenderChange={props.onSenderChange} senderLabel={props.senderLabel} />
      </Grid>
      <Grid className={classes.grid}>
        <ParringCell parring={props.beginOfParring} onParringChange={props.onParringChange} />
        <CounterpartCell
          counterpart={props.counterparty}
          onCounterpartChange={props.onCounterpartyChange}
          pList={props.pList}
        />
      </Grid>

      <Grid className={classes.grid}>
        <ProcessingCell processing={props.typeOfProcessing} onProcessingChange={props.onProcessingChange} />
      </Grid>
    </Box>
  );
});

interface FormDetailProps {
  qtyData: string[][];
  setQtyData: (qtyData: string[][]) => void;
  activeColumns: boolean[];
  setActiveColumns: (newActiveColumns: boolean[]) => void;
}

const FormDetail: FunctionComponent<FormDetailProps> = React.memo((props) => {
  const rows = [];
  for (let r = 0; r < props.qtyData.length; r++) {
    rows.push(<AllRows key={'ARP' + r} hour={r} {...props} />);
  }
  return <>{rows}</>;
});

interface FormRowsProps extends FormDetailProps {
  hour: number;
}

const AllRows: FunctionComponent<FormRowsProps> = React.memo((props) => {
  const {t} = useTranslation();
  const startTime = moment('00:00', 'HH:mm').add(15 * props.hour, 'minutes');
  const endTime = startTime.clone().add(15, 'minutes');

  return (
    <Box display="flex" style={{flex: 1}} key={'AR' + props.hour}>
      <Box
        display="flex"
        style={{
          backgroundColor: LIGHT_BLUE,
          borderRight: '1px solid',
          borderLeft: '2px solid',
          borderBottom: '1px solid',
          minWidth: 50,
          maxWidth: 50,
          minHeight: ROW_HEIGHT,
          height: ROW_HEIGHT,
          boxSizing: 'border-box',
          paddingRight: '3px',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flex: 1,
          borderBottomWidth: (props.hour + 1) % 4 == 0 ? '2px' : '1px'
        }}>
        {props.hour + 1}
      </Box>
      <Box
        display="flex"
        style={{
          backgroundColor: LIGHT_BLUE,
          border: 0,
          borderRight: '1px solid',
          borderBottom: '1px solid',
          minWidth: 87,
          maxWidth: 87,
          boxSizing: 'border-box',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          minHeight: ROW_HEIGHT,
          height: ROW_HEIGHT,
          borderBottomWidth: (props.hour + 1) % 4 == 0 ? '2px' : '1px'
        }}>
        {startTime.format(t('indra:format.time.hourMinutes')) +
          ' - ' +
          endTime.format(t('indra:format.time.hourMinutes'))}
      </Box>
      <QtyPriceCellRow {...props} />
    </Box>
  );
});

interface QtyPriceCellRowProps extends FormRowsProps {
  segment: number;
}

export const QtyPriceCellRow: FunctionComponent<FormRowsProps> = React.memo((props) => {
  const cells = [];
  for (let i = 0; i < props.qtyData[0].length; i++) {
    cells.push(<QtyPriceCell key={'QPCR' + i + '_' + props.hour} segment={i} {...props} />);
  }
  return <>{cells}</>;
});

export const QtyPriceCell: FunctionComponent<QtyPriceCellRowProps> = React.memo((props) => {
  const [quantity, setQuantity] = useState<string>(props.qtyData[props.hour][props.segment]);

  let isDisabled = !props.activeColumns[props.segment];

  // calculate background color
  let backgroundColor = '#fff';
  if (props.hour % 8 < 4) {
    backgroundColor = '#fff';
  } else {
    backgroundColor = '#ededed';
  }
  if (isDisabled) {
    backgroundColor = '#b5b5b5';
  }

  let inputValue: string = props.qtyData[props.hour][props.segment];
  if (isDisabled) inputValue = '';

  const setLocalQuantity = (value: string) => {
    let nValue = Number(value);

    if (value == '') {
      setQuantity('');
      const newPriceQtyData = props.qtyData;
      newPriceQtyData[props.hour][props.segment] = '';
      props.setQtyData(newPriceQtyData);
      return;
    }

    // validate price max and min value
    if (nValue < 0.1) {
      setQuantity('0.1');
      const newPriceQtyData = props.qtyData;
      newPriceQtyData[props.hour][props.segment] = '0.1';
      props.setQtyData(newPriceQtyData);
      return;
    }

    if (nValue > 9999) {
      return;
    }

    // set the mask of a number
    value = String(removeDecimals(value, 1));

    setQuantity(value);
    const newPriceQtyData = props.qtyData;
    newPriceQtyData[props.hour][props.segment] = value;
    props.setQtyData(newPriceQtyData);
  };

  const setLocalQuantityFixed = (value: string) => {
    let newValue = addDecimals(value, 1);
    setQuantity(newValue);
    const newPriceQtyData = props.qtyData;
    newPriceQtyData[props.hour][props.segment] = newValue;
    props.setQtyData(newPriceQtyData);
  };

  useEffect(() => {
    setQuantity(props.qtyData[props.hour][props.segment]);
  }, [props.qtyData[props.hour][props.segment]]);

  let borderWidth = 1;
  if (props.segment == 1) {
    borderWidth = 2;
  }

  return (
    <React.Fragment key={'QP' + props.segment + '_' + props.hour}>
      <Box
        display="flex"
        style={{
          border: 0,
          borderRight: '1px solid',
          borderBottom: '1px solid',
          borderRightWidth: borderWidth,
          minWidth: 98,
          maxWidth: 98,
          boxSizing: 'border-box',
          flex: 1,
          borderBottomWidth: (props.hour + 1) % 4 == 0 ? '2px' : '1px',
          height: ROW_HEIGHT,
          background: backgroundColor
        }}>
        <Input
          type="number"
          color="secondary"
          inputProps={{
            style: {textAlign: 'right', width: '100%', position: 'relative', top: '1px'}
          }}
          disableUnderline={true}
          disabled={isDisabled}
          value={inputValue || ''}
          onChange={(e) => setLocalQuantity(e.target.value)}
          onBlur={(e) => setLocalQuantityFixed(e.target.value)}
        />
      </Box>
    </React.Fragment>
  );
});

function StyledCheckbox(props: CheckboxProps) {
  const classes = checkboxStyle();

  return (
    <Checkbox
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      inputProps={{'aria-label': 'decorative checkbox'}}
      {...props}
    />
  );
}

const gridStyles = makeStyles({
  gridOuter: {
    padding: 10,
    paddingBottom: 0
  },
  grid: {
    paddingBottom: 5,
    display: 'flex',
    flex: 1
  },
  boxStyle: {
    alignItems: 'center',
    display: 'flex',
    flex: 1
  },
  textCellStyle: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    borderBottom: 0
  },
  compCellStyle: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    borderBottom: 0
  }
});

const checkboxStyle = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  icon: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    border: '1px solid #000',
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    '&:before': {
      display: 'block',
      width: 12,
      height: 12,
      position: 'relative',
      top: -1,
      left: -1,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23000'/%3E%3C/svg%3E\")",
      content: '""'
    }
  }
});

export default RRD;
