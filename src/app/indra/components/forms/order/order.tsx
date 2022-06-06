import DateFnsUtils from '@date-io/date-fns';
import {Box, Button, Grid, Input} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio, {RadioProps} from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import {makeStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date';
import {
  Comment,
  EnergyOrder,
  ErIdentification,
  Isotedata,
  ProfileData,
  QtyPrice,
  RowData,
  Trade
} from 'app/indra/components/forms/order/interfaces';
import {LoadingProps} from 'app/indra/components/forms/loader';
import {
  clipboardCopy,
  clipboardPaste,
  ClipboardProps,
  PasteClipboardProps
} from 'app/indra/components/forms/utils/clipboard';
import {PanelProp} from 'app/indra/components/panels/panelController';
import fetchService from 'app/indra/services/fetch';
import {
  BC,
  BP,
  BUTTON_FONT_SIZE,
  DARK_ORANGE,
  HEADER_HEIGHT,
  LIGHT_BLUE,
  LIGHT_ORANGE,
  ORDER_NUMBER_OF_ROWS,
  ORDER_NUMBER_OF_SEGMENTS,
  ROW_HEIGHT
} from 'app/indra/utils/const';
import {formatDateToISO, getActualStartOfDate} from 'app/indra/utils/dateTime';
import {
  addDecimals,
  convertFloatByLocale,
  formatPrice,
  formatQuantity,
  validateComment,
  validatePercentage,
  validatePrice,
  validateQuantity
} from 'app/indra/utils/format';
import {ote_ean, user_ean, user_id} from 'app/indra/utils/user';
import moment from 'moment';
import React, {FunctionComponent, useEffect, useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {useTranslation} from 'react-i18next';

interface HeaderProps {
  tradeType: string;
  tradeDay: Date | null;
  currency: string;
  comment: string;
  finance: number;
  orderId: number | null;
  version: number | null;
  category: string;
  selectionType: string;
  exclusiveGroup: string;
  exclusiveGroupId: string;
  onDateChange: (newDate: Date | null) => void;
  onCurrencyChange: (newCurrency: string) => void;
  onTradeTypeChange: (newTrade: string) => void;
  onCommentChange: (newComment: string) => void;
  onFinanceChange: (newFinance: number) => void;
  onCategoryChange: (newCategory: string) => void;
  onExclusiveGroupChange: (newExclusiveGroup: string) => void;
  onExclusiveGroupIdChange: (newExclusiveGroupId: string) => void;
  activeHours: ActiveHour[];
  setActiveHours: (activeHour: ActiveHour[]) => void;
  blockQtyPrice: string[][];
  setBlockQtyPrice: (blockQtyPrice: string[][]) => void;
}

interface HourOrderProperties extends ClipboardProps {
  comment: string;
  price: string;
  quantity: string;
  onCommentChange: (newComment: string) => void;
  onPriceChange: (newPrice: string) => void;
  onQuantityChange: (newQuantity: string) => void;
}

interface SelectionProps {
  selectionType: string;
  onSelectionChange: (newSelection: string) => void;
}

interface HeaderSelectionProps extends SelectionProps {
  tradeType: string;
}

interface CalendarProps {
  tradeDate: Date | null;
  onDateChange: (newDate: Date | null) => void;
  activeHours: ActiveHour[];
  setActiveHours: (activeHour: ActiveHour[]) => void;
  blockQtyPrice: string[][];
  setBlockQtyPrice: (blockQtyPrice: string[][]) => void;
}

interface CurrencyProps {
  currency: string;
  onCurrencyChange: (newCurrency: string) => void;
}

interface TradeTypeProps {
  tradeType: string;
  onTradeTypeChange: (newTrade: string) => void;
}

interface CommentProps {
  comment: string;
  onCommentChange: (newComment: string) => void;
}

interface FinanceProps {
  finance: number;
  onFinanceChange: (newFinance: number) => void;
  category: string;
}

interface CategoryProps {
  category: string;
  onCategoryChange: (newCategory: string) => void;
}

interface ExclusiveGroupProps {
  category: string;
  exclusiveGroup: string;
  onExclusiveGroupChange: (exclusiveGroup: string) => void;
}

interface ExclusiveGroupIdProps {
  exclusiveGroupId: string;
  onExclusiveGroupIdChange: (exclusiveGroup: string) => void;
  isActive: string;
  category: string;
}

export interface OrderProps {
  newOrder?: boolean;
  modifyOrder?: boolean;
}

const initData = () => {
  const hourData: QtyPrice[][] = [];
  for (let hour = 0; hour < ORDER_NUMBER_OF_ROWS; hour++) {
    const segData: QtyPrice[] = [];
    for (let seg = 0; seg < ORDER_NUMBER_OF_SEGMENTS; seg++) {
      segData.push({
        quantity: '',
        price: ''
      });
    }
    hourData.push(segData);
  }
  return hourData;
};

const initStringData = (value: string) => {
  let commentsData = [];
  for (let i = 0; i < ORDER_NUMBER_OF_SEGMENTS; i++) {
    commentsData.push(value);
  }
  return commentsData;
};

const initBlockMinData = (n: number | null) => {
  let minData: (number | null)[] = [];
  for (let i = 0; i < ORDER_NUMBER_OF_SEGMENTS; i++) {
    minData.push(n);
  }
  return minData;
};

const initBlockQtyData = () => {
  let qtyData: string[][] = [];
  for (let m = 0; m < ORDER_NUMBER_OF_ROWS; m++) {
    let row: string[] = [];
    for (let n = 0; n < ORDER_NUMBER_OF_SEGMENTS; n++) {
      row.push('');
    }
    qtyData.push(row);
  }
  return qtyData;
};

interface SnackBarNotificationI {
  message: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}
const SnackBarNotification: FunctionComponent<SnackBarNotificationI> = React.memo((props) => {
  const {t} = useTranslation();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={props.open}
      autoHideDuration={3000}
      onClose={() => props.setOpen(false)}
      message={props.message}
      action={
        <React.Fragment>
          <Button variant="outlined" color="primary" size="small" onClick={() => props.setOpen(false)}>
            {t('indra:order.button.ok')}
          </Button>
        </React.Fragment>
      }
    />
  );
});

interface ActiveHour {
  id: number;
  code: string;
  intervals: number[];
}

let activeHours: ActiveHour[] = [];

function readActiveHours(
  date: string,
  setHours: (activeHour: ActiveHour[]) => void,
  blockQtyPrice: string[][],
  setBlockQtyPrice: (block: string[][]) => void
) {
  try {
    fetch(process.env.REACT_APP_API_URL_INDRA + '/dm/productsDef/' + date)
      .then((res) => res.json())
      .then((out) => {
        console.log('Process active hour data');
        let json = out;
        activeHours = [];
        for (let i = 0; i < json.length; i++) {
          activeHours.push({
            id: json[i].id,
            code: json[i].code,
            intervals: json[i].intervals
          });
        }

        // rerender layout
        setHours(activeHours);
        setBlockQtyPrice(blockQtyPrice.splice(0));
      })
      .catch((err) => console.error(err));
  } catch (e) {
    console.log('Error when loading active hours: ' + e);
  }
}

let isFirst = true;

const Order: FunctionComponent<PanelProp & OrderProps & LoadingProps> = React.memo((props) => {
  const {t} = useTranslation();
  const [tradeDate, setTradeDate] = useState<Date | null>(new Date());
  const [currency, setCurrency] = useState('CZK');
  const [tradeType, setTradeType] = useState('N');
  const [comment, setComment] = useState<string>('');
  const [finance, setFinance] = useState(1);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [version, setVersion] = useState<number | null>(null);
  const [selection, setSelection] = useState('standard');
  const [category, setCategory] = useState('pbn');

  const [qtyPriceData, setQtyPriceData] = useState<QtyPrice[][]>(initData());

  const [hourComment, setHourComment] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  const [blockQtyPrice, setBlockQtyPrice] = useState<string[][]>(initBlockQtyData());
  const [blockMins, setBlockMins] = useState<(number | null)[]>(initBlockMinData(100));
  const [blockComments, setBlockComments] = useState<string[]>(initStringData(''));
  const [blockPrice, setBlockPrice] = useState<string[]>(initStringData(''));
  const [blockSelection, setBlockSelection] = useState<(number | null)[]>(initBlockMinData(1));
  const [activeHours, setActiveHours] = useState<ActiveHour[]>([]);

  const [exclusiveGroup, setExclusiveGroup] = useState('ne');
  const [exclusiveGroupId, setExclusiveGroupId] = useState('');

  // snackbar
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  // loader
  const {setLoading} = props;
  useEffect(() => {
    if (setLoading) {
      setLoading(false);
    }
  }, []);

  if (isFirst) {
    readActiveHours(new Date().toDateString(), setActiveHours, blockQtyPrice, setBlockQtyPrice);
    isFirst = false;
  }

  useEffect(() => {
    if (props.communication) {
      props.communication.forEach(async function (comm) {
        let orderIdTmp;
        let versionTmp;
        comm.data.forEach((element: any) => {
          if (element.key === 'orderId') {
            orderIdTmp = element.value;
            setOrderId(element.value);
          }
          if (element.key === 'version') {
            versionTmp = element.value;
            setVersion(element.value);
          }
          if (element.key == 'deliveryDate') {
            let dateChanged = false;
            // check if date is changed
            if (tradeDate) {
              let d = new Date(tradeDate);
              if (d.toJSON().slice(0, 10) != element.value) {
                dateChanged = true;
              }
            }

            if (dateChanged) {
              setTradeDate(element.value);
              // empty other fields
              // normal order
              setOrderId(null);
              setVersion(null);
              setCurrency('CZK');
              setTradeType('N');
              setComment('');
              setFinance(1);
              setQtyPriceData(initData());

              // block order
              setBlockQtyPrice(initBlockQtyData());
              setBlockMins(initBlockMinData(100));
              setBlockComments(initStringData(''));
              setBlockPrice(initStringData(''));
              setBlockSelection(initBlockMinData(1));
              setExclusiveGroup('ne');
              setExclusiveGroupId('');

              // hour block order
              setHourComment('');
              setPrice('');
              setQuantity('');
            }
          }
        });

        if (orderIdTmp && versionTmp) {
          if (setLoading) {
            setLoading(true);
          }
          console.log('Reading order: ' + orderIdTmp + ' / ' + versionTmp);
          try {
            const json: any = await fetchService.post(process.env.REACT_APP_API_URL_INDRA + '/orders/get_order/', {
              order_id: orderIdTmp,
              version: versionTmp
            });
            if (json) {
              console.log('Process order data: ' + JSON.stringify(json));
              processOrderHeader(json);
            }
          } catch (e) {
            console.log('Chyba pri nacteni nabídky: ' + e);
          } finally {
            if (setLoading) {
              setLoading(false);
            }
          }
        }
      });
    }
  }, [props.communication]);

  const processOrderHeader = (orderData: any) => {
    setTradeType(orderData.trade_type);
    setCurrency(orderData.curr_settl);
    setTradeDate(getActualStartOfDate(orderData.delivery_date));
    setFinance(orderData.util_flag);

    // set standard or block order
    if (orderData.block_category == '' || orderData.block_category == null) {
      setSelection('standard');
      setComment(orderData.note || '');
      processOrderDetail(orderData.dmOrderDetails);
    } else {
      setSelection('blok');
      // set category
      setCategory(orderData.block_category);
      // set exclusive group
      if (orderData.block_category == 'pbn') {
        if (orderData.excl_group != '' && orderData.excl_group != null) {
          setExclusiveGroup('ano');
          setExclusiveGroupId(orderData.excl_group);
        }
        // process detail
        processBlockOrder(orderData);
      } else if (orderData.block_category == 'fhn') {
        setExclusiveGroup('ne');
        setExclusiveGroupId('');
        // set comment box
        setHourComment(orderData.note || '');
        // set price box
        setPrice(addDecimals(String(orderData.dmOrderDetails[0].price), 2));
        // set quantity box
        setQuantity(addDecimals(String(orderData.dmOrderDetails[0].energy), 1));
      }
    }
  };

  const processBlockOrder = (orderData: any) => {
    // get order detail
    const orderDetail = orderData.dmOrderDetails;

    // set min price
    const blockMins: (number | null)[] = initBlockMinData(100);
    blockMins[0] = orderData.acc_ratio;
    setBlockMins(blockMins);
    // set comment
    const blockComments: string[] = initStringData('');
    blockComments[0] = orderData.note;
    setBlockComments(blockComments);

    // set 2d array
    const blockQtyPrice: string[][] = initBlockQtyData();
    orderDetail.forEach((blockHour: any, i: number) => {
      if (i == 0) {
        // set price for once
        const price = Number(blockHour.price);
        const blockPrice: string[] = initStringData('');
        blockPrice[0] = addDecimals(String(price), 2);
        setBlockPrice(blockPrice);
      }
      const hour = Number(blockHour.id.intrvl);
      const quantity = Number(blockHour.energy);
      blockQtyPrice[hour - 1][0] = addDecimals(String(quantity), 1);
    });

    // update 2d array
    setBlockQtyPrice(blockQtyPrice);
  };

  const processOrderDetail = (orderDetail: any) => {
    const qtyPriceData: QtyPrice[][] = initData();
    if (!orderDetail || orderDetail.length <= 0) {
      setQtyPriceData(qtyPriceData);
      return;
    }

    orderDetail.forEach((blockHour: any) => {
      const segment = Number(blockHour.id.blockId);
      const hour = Number(blockHour.id.intrvl);
      const price = Number(blockHour.price);
      const quantity = Number(blockHour.energy);

      if (qtyPriceData.length >= hour && qtyPriceData[hour - 1].length >= segment) {
        qtyPriceData[hour - 1][segment - 1] = {
          price: addDecimals(String(price), 2),
          quantity: addDecimals(String(quantity), 1)
        };
      }
    });

    setQtyPriceData(qtyPriceData);
  };

  const [copyClipboard, setCopyClipboard] = useState<boolean>(false);
  const [pasteClipboard, setPasteClipboard] = useState<boolean>(false);

  const makeClipboardCopy = () => {
    setCopyClipboard(!copyClipboard);
  };

  const handleClipboardCopy = (data: any[][]) => {
    clipboardCopy(data);
    setCopyClipboard(false);
  };

  const handleClipboardPaste = (e: any, data: any, setData: any, property?: string, posY?: number, posX?: number) => {
    clipboardPaste(e, data, setData, property, posY, posX);
    setPasteClipboard(true);
  };

  useEffect(() => {
    if (pasteClipboard) {
      setPasteClipboard(false);
    }
  }, [pasteClipboard]);

  let categoryFlag = '';

  if (selection == 'blok') {
    categoryFlag = category;
  } else {
    categoryFlag = '';
  }

  const rootClass = selection == 'blok' ? 'order-block' : 'order-standard';
  const style = tradeType === 'N' ? {backgroundColor: '#B1D9FF'} : {backgroundColor: '#D2FFD2'};
  const buttonIsDisabled = orderId == null || version == null ? true : false;

  return (
    <div
      className={rootClass}
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
          height: '100%'
        }}>
        <div style={{flex: 0}}>
          <SnackBarNotification open={open} setOpen={setOpen} message={message} />

          <HeaderSelection tradeType={tradeType} selectionType={selection} onSelectionChange={setSelection} />
          <div className="form-wrapper" style={style}>
            <HeaderTable
              orderId={orderId}
              version={version}
              onTradeTypeChange={setTradeType}
              tradeType={tradeType}
              onCurrencyChange={setCurrency}
              currency={currency}
              onDateChange={setTradeDate}
              tradeDay={tradeDate}
              activeHours={activeHours}
              setActiveHours={setActiveHours}
              onCommentChange={setComment}
              comment={comment}
              onFinanceChange={setFinance}
              finance={finance}
              category={category}
              onCategoryChange={setCategory}
              selectionType={selection}
              exclusiveGroup={exclusiveGroup}
              onExclusiveGroupChange={setExclusiveGroup}
              exclusiveGroupId={exclusiveGroupId}
              onExclusiveGroupIdChange={setExclusiveGroupId}
              blockQtyPrice={blockQtyPrice}
              setBlockQtyPrice={setBlockQtyPrice}
              {...props}
            />
          </div>
        </div>
        <div className="block-header">
          <span className="block-header-text">{t('indra:form.title.detail')}</span>
          {(navigator.clipboard || document.queryCommandSupported('copy')) && (
            <span style={{float: 'right', cursor: 'pointer'}} onClick={makeClipboardCopy}>
              Zkopírovat
            </span>
          )}
        </div>
        <div style={{flex: 1, overflow: 'auto'}} className="form-table">
          <Box>
            {selection == 'standard' && (
              <React.Fragment>
                <FormHeader qtyPriceData={qtyPriceData} />
                <FormDetail
                  qtyPriceData={qtyPriceData}
                  setQtyPriceData={setQtyPriceData}
                  copyClipboard={copyClipboard}
                  handleClipboardCopy={handleClipboardCopy}
                  pasteClipboard={pasteClipboard}
                  handleClipboardPaste={handleClipboardPaste}
                />
              </React.Fragment>
            )}
            {selection == 'blok' && category == 'pbn' && (
              <React.Fragment>
                <FormBlockHeader
                  blockSelection={blockSelection}
                  setBlockSelection={setBlockSelection}
                  blockMins={blockMins}
                  setBlockMins={setBlockMins}
                  comments={blockComments}
                  setComments={setBlockComments}
                  blockPrice={blockPrice}
                  setBlockPrice={setBlockPrice}
                  activeHours={activeHours}
                  setActiveHours={setActiveHours}
                  blockQtyPrice={blockQtyPrice}
                  setBlockQtyPrice={setBlockQtyPrice}
                  copyClipboard={copyClipboard}
                  handleClipboardCopy={handleClipboardCopy}
                  pasteClipboard={pasteClipboard}
                  handleClipboardPaste={handleClipboardPaste}
                />
                <FormBlockBody
                  blockQtyPrice={blockQtyPrice}
                  setBlockQtyPrice={setBlockQtyPrice}
                  activeHours={blockSelection}
                  pasteClipboard={pasteClipboard}
                  handleClipboardPaste={handleClipboardPaste}
                />
              </React.Fragment>
            )}
            {selection == 'blok' && category == 'fhn' && (
              <React.Fragment>
                <FormHourHeader />
                <FormHourBody
                  comment={hourComment}
                  price={price}
                  quantity={quantity}
                  onCommentChange={setHourComment}
                  onPriceChange={setPrice}
                  onQuantityChange={setQuantity}
                  copyClipboard={copyClipboard}
                  handleClipboardCopy={handleClipboardCopy}
                  pasteClipboard={pasteClipboard}
                  handleClipboardPaste={handleClipboardPaste}
                />
              </React.Fragment>
            )}
          </Box>
        </div>
        {props.newOrder && (
          <Box style={{flex: 0}}>
            <Button variant="outlined" color="primary" onClick={sendJson}>
              {t('indra:order.button.send')}
            </Button>
          </Box>
        )}

        {props.modifyOrder && (
          <Box style={{flex: 0}}>
            <Button disabled={buttonIsDisabled} variant="outlined" color="primary" onClick={sendJsonModOrder}>
              <EditIcon style={{fontSize: BUTTON_FONT_SIZE, marginRight: 4}} />
              {t('indra:order.button.modify')}
            </Button>
            <Button variant="outlined" color="primary" onClick={sendJsonCreateOrder}>
              <AddIcon style={{fontSize: BUTTON_FONT_SIZE, marginRight: 4}} />
              {t('indra:order.button.create')}
            </Button>
            <Button disabled={buttonIsDisabled} variant="outlined" color="primary" onClick={sendJsonDeleteOrder}>
              <DeleteIcon style={{fontSize: BUTTON_FONT_SIZE, marginRight: 4}} />
              {t('indra:order.button.delete')}
            </Button>
          </Box>
        )}
      </div>
    </div>
  );

  function getTradeList(modify: boolean, isDeleted: boolean): Trade[] {
    const commentar: Comment = {
      value: comment
    };

    const hCommentar: Comment = {
      value: hourComment
    };

    const tradeFlag = isDeleted ? 'C' : '';

    const profileDataMap: Map<string, ProfileData> = new Map();
    const tradeList: Trade[] = [];

    if (selection == 'standard') {
      // check the object
      let isWrong = false;

      qtyPriceData.forEach((hourObj, hourIndex) => {
        hourObj.forEach((segmObj, segIndex) => {
          if ((segmObj.price == '' && segmObj.quantity != '') || (segmObj.price != '' && segmObj.quantity == '')) {
            isWrong = true;
          }
        });
      });

      if (isWrong) return [];

      qtyPriceData.forEach((hourObj, hourIndex) => {
        hourObj.forEach((segmObj, segIndex) => {
          if (segmObj.price && segmObj.quantity) {
            const priceProfile = BP + (segIndex + 1 < 10 ? '0' : '') + (segIndex + 1);
            const qtyProfile = BC + (segIndex + 1 < 10 ? '0' : '') + (segIndex + 1);
            const profTemp = profileDataMap.get(priceProfile);
            if (profTemp) {
              profTemp?.data.push({period: hourIndex + 1, value: Number(segmObj.price)});
              profileDataMap.set(priceProfile, profTemp);
            } else {
              const rowData: RowData = {
                period: hourIndex + 1,
                value: Number(segmObj.price)
              };
              const rowDataList: RowData[] = [];
              rowDataList.push(rowData);
              const profTemp: ProfileData = {
                profileRole: priceProfile,
                unit: 'EUR/MWh',
                data: rowDataList
              };
              profileDataMap.set(priceProfile, profTemp);
            }

            const profTemp1 = profileDataMap.get(qtyProfile);
            if (profTemp1) {
              profTemp1?.data.push({period: hourIndex + 1, value: Number(segmObj.quantity)});
              profileDataMap.set(qtyProfile, profTemp1);
            } else {
              const rowData: RowData = {
                period: hourIndex + 1,
                value: Number(segmObj.quantity)
              };
              const rowDataList: RowData[] = [];
              rowDataList.push(rowData);
              const profTemp1: ProfileData = {
                profileRole: qtyProfile,
                unit: 'MAW',
                data: rowDataList
              };
              profileDataMap.set(qtyProfile, profTemp1);
            }
          }
        });
      });

      if (profileDataMap.size === 0) {
        console.log('NO data to send!!!');
        return [];
      }

      const trade: Trade = {
        acceptance: 'N',
        replacement: 'N',
        settCurr: currency,
        sourceSys: 'OTE',
        tradeDay: tradeDate ? formatDateToISO(tradeDate) : null,
        tradeStage: 'N',
        tradeType: tradeType,
        //finance: finance,
        resolution: 'PT15M',
        externalId: 'order_AX_001',
        profileData: Array.from(profileDataMap.values()),
        comment: commentar,
        category: categoryFlag,
        acceptRatio: '20',
        parentBlock: '1',
        exclsGroup: exclusiveGroupId,
        utilFlag: finance,
        tradeFlag: tradeFlag
      };

      if (modify || isDeleted) {
        trade.id = Number(orderId);
        trade.version = Number(version);
      }

      tradeList.push(trade);
    } else if (selection == 'blok' && category == 'pbn') {
      // check the values

      let priceIsSetArray = [];
      let quantityIsSetArray = [];
      let isWrongArray = [];
      let isEmptyArray = [];

      for (let i = 0; i < ORDER_NUMBER_OF_SEGMENTS; i++) {
        priceIsSetArray.push(blockPrice[i] != '');
        quantityIsSetArray.push(false);
        isWrongArray.push(false);
        isEmptyArray.push(false);
      }

      blockQtyPrice.forEach((hourObj, hourIndex) => {
        hourObj.forEach((segmObj, segIndex) => {
          if (segmObj != '') quantityIsSetArray[segIndex] = true;
        });
      });

      let isWrong = false;

      for (let i = 0; i < ORDER_NUMBER_OF_SEGMENTS; i++) {
        if (priceIsSetArray[i] && !quantityIsSetArray[i]) {
          isWrong = true;
          isWrongArray[i] = true;
        }
        if (!priceIsSetArray[i] && quantityIsSetArray[i]) {
          isWrong = true;
          isWrongArray[i] = true;
        }

        if (!priceIsSetArray[i] && !quantityIsSetArray[i]) {
          isEmptyArray[i] = true;
        }
      }

      if (isWrong) return [];

      blockQtyPrice.forEach((hourObj, hourIndex) => {
        hourObj.forEach((segmObj, segIndex) => {
          if (segmObj) {
            const priceProfile = BP + (segIndex + 1 < 10 ? '0' : '') + (segIndex + 1);
            const qtyProfile = BC + (segIndex + 1 < 10 ? '0' : '') + (segIndex + 1);
            const profTemp = profileDataMap.get(priceProfile);
            if (profTemp) {
              profTemp?.data.push({period: hourIndex + 1, value: Number(blockPrice[segIndex])});
              profileDataMap.set(priceProfile, profTemp);
            } else {
              const rowData: RowData = {
                period: hourIndex + 1,
                value: Number(blockPrice[segIndex])
              };
              const rowDataList: RowData[] = [];
              rowDataList.push(rowData);
              const profTemp: ProfileData = {
                profileRole: priceProfile,
                unit: 'EUR/MWh',
                data: rowDataList
              };
              profileDataMap.set(priceProfile, profTemp);
            }

            const profTemp1 = profileDataMap.get(qtyProfile);
            if (profTemp1) {
              profTemp1?.data.push({period: hourIndex + 1, value: Number(segmObj)});
              profileDataMap.set(qtyProfile, profTemp1);
            } else {
              const rowData: RowData = {
                period: hourIndex + 1,
                value: Number(segmObj)
              };
              const rowDataList: RowData[] = [];
              rowDataList.push(rowData);
              const profTemp1: ProfileData = {
                profileRole: qtyProfile,
                unit: 'MAW',
                data: rowDataList
              };
              profileDataMap.set(qtyProfile, profTemp1);
            }
          }
        });
      });

      const profileValues = Array.from(profileDataMap.values());

      for (let x = 0; x < profileValues.length; x += 2) {
        const segIndex = parseInt(profileValues[x].profileRole.slice(2)) - 1;

        if (isEmptyArray[segIndex]) {
          continue;
        }

        const comment: Comment = {
          value: blockComments[segIndex]
        };

        const trade: Trade = {
          acceptance: 'N',
          replacement: 'N',
          settCurr: currency,
          sourceSys: 'OTE',
          tradeDay: tradeDate ? formatDateToISO(tradeDate) : null,
          tradeStage: 'N',
          tradeType: tradeType,
          //finance: finance,
          resolution: 'PT15M',
          externalId: 'order_AX_001',
          profileData: profileValues.slice(x, x + 2),
          comment: comment,
          category: categoryFlag,
          acceptRatio: String(blockMins[segIndex]),
          parentBlock: '1',
          exclsGroup: exclusiveGroupId,
          utilFlag: finance,
          tradeFlag: tradeFlag
        };
        if (modify || isDeleted) {
          trade.id = Number(orderId);
          trade.version = Number(version);
        }
        tradeList.push(trade);
        if (modify || isDeleted) break;
      }
    } else if (selection == 'blok' && category == 'fhn') {
      // check conditions
      if (!price || !quantity) {
        return [];
      }

      const priceProfile = BP + '01';
      const qtyProfile = BC + '01';
      const profTemp = profileDataMap.get(priceProfile);
      if (profTemp) {
        profTemp?.data.push({period: 1, value: Number(price)});
        profileDataMap.set(priceProfile, profTemp);
      } else {
        const rowData: RowData = {
          period: 1,
          value: Number(price)
        };
        const rowDataList: RowData[] = [];
        rowDataList.push(rowData);
        const profTemp: ProfileData = {
          profileRole: priceProfile,
          unit: 'EUR/MWh',
          data: rowDataList
        };
        profileDataMap.set(priceProfile, profTemp);
      }

      const profTemp1 = profileDataMap.get(qtyProfile);
      if (profTemp1) {
        profTemp1?.data.push({period: 1, value: Number(quantity)});
        profileDataMap.set(qtyProfile, profTemp1);
      } else {
        const rowData: RowData = {
          period: 1,
          value: Number(quantity)
        };
        const rowDataList: RowData[] = [];
        rowDataList.push(rowData);
        const profTemp1: ProfileData = {
          profileRole: qtyProfile,
          unit: 'MAW',
          data: rowDataList
        };
        profileDataMap.set(qtyProfile, profTemp1);
      }

      if (profileDataMap.size === 0) {
        console.log('NO data to send!!!');
        return [];
      }

      const trade: Trade = {
        acceptance: 'N',
        replacement: 'N',
        settCurr: currency,
        sourceSys: 'OTE',
        tradeDay: tradeDate ? formatDateToISO(tradeDate) : null,
        tradeStage: 'N',
        tradeType: tradeType,
        //finance: finance,
        resolution: 'PT15M',
        externalId: 'order_AX_001',
        profileData: Array.from(profileDataMap.values()),
        comment: hCommentar,
        category: categoryFlag,
        acceptRatio: '20',
        parentBlock: '1',
        exclsGroup: '',
        utilFlag: finance,
        tradeFlag: tradeFlag
      };
      if (modify || isDeleted) {
        trade.id = Number(orderId);
        trade.version = Number(version);
      }
      tradeList.push(trade);
    }

    return tradeList;
  }

  async function sendJson() {
    const sender: ErIdentification = {
      codingScheme: '14',
      id: user_ean
    };

    const receiver: ErIdentification = {
      codingScheme: '14',
      id: ote_ean
    };

    let tradeList: Trade[] = getTradeList(false, false);

    if (tradeList.length == 0) {
      setMessage(t('indra:order.validation.qtyPrice'));
      setOpen(true);
      return;
    }

    const isotedata: Isotedata = {
      id: 'ISO2341657498',
      messageCode: '811',
      receiverIdentification: receiver,
      senderIdentification: sender,
      dateTime: new Date(),
      trade: tradeList
    };

    const order: EnergyOrder = {
      task_id: 1,
      user_id: user_id,
      ts: new Date().getTime(),
      isotedata: isotedata
    };

    try {
      await fetchService
        .post(process.env.REACT_APP_API_URL_INDRA + '/async_task/json_format', order)
        .then((json: any) => {
          console.log('Result: ' + JSON.stringify(json));
          if (Array.isArray(json)) {
            json.forEach((order) => {
              console.log('Uspesne zavedeni nabidky: ' + order.id.orderId + '/' + order.id.versionId);
              // show snackbar
              setMessage(t('indra:order.message.created'));
              setOpen(true);
            });
          }
        });
    } catch (e) {
      console.log('Chyba pri zavedení nabídky: ' + e);
    }
  }

  async function sendJsonModOrder() {
    if (!orderId || !version) {
      console.log('No order to modify!!!');
      return;
    }

    const sender: ErIdentification = {
      codingScheme: '14',
      id: user_ean
    };

    const receiver: ErIdentification = {
      codingScheme: '14',
      id: ote_ean
    };

    const tradeList: Trade[] = getTradeList(true, false);

    if (tradeList.length == 0) {
      setMessage(t('indra:order.validation.qtyPrice'));
      setOpen(true);
      return;
    }
    const isotedata: Isotedata = {
      id: 'ISO2341657498',
      messageCode: '811',
      receiverIdentification: receiver,
      senderIdentification: sender,
      dateTime: new Date(),
      trade: tradeList
    };

    const order: EnergyOrder = {
      task_id: 1,
      user_id: user_id,
      ts: new Date().getTime(),
      isotedata: isotedata
    };

    try {
      await fetchService
        .post(process.env.REACT_APP_API_URL_INDRA + '/async_task/json_format', order)
        .then((json: any) => {
          console.log('Result: ' + JSON.stringify(json));
          if (Array.isArray(json)) {
            json.forEach((order) => {
              console.log('Uspesna modifikace nabidky: ' + order.id.orderId + '/' + order.id.versionId);
              setMessage(t('indra:order.message.modified'));
              setOpen(true);
              setVersion(order.id.versionId);
            });
          }
        });
    } catch (e) {
      console.log('Chyba pri modifikaci nabídky: ' + e);
    }
  }

  async function sendJsonCreateOrder() {
    const sender: ErIdentification = {
      codingScheme: '14',
      id: user_ean
    };

    const receiver: ErIdentification = {
      codingScheme: '14',
      id: ote_ean
    };

    const tradeList: Trade[] = getTradeList(false, false);

    if (tradeList.length == 0) {
      setMessage(t('indra:order.validation.qtyPrice'));
      setOpen(true);
      return;
    }

    const isotedata: Isotedata = {
      id: 'ISO2341657498',
      messageCode: '811',
      receiverIdentification: receiver,
      senderIdentification: sender,
      dateTime: new Date(),
      trade: tradeList
    };

    const order: EnergyOrder = {
      task_id: 1,
      user_id: user_id,
      ts: new Date().getTime(),
      isotedata: isotedata
    };

    console.log('Order: ' + JSON.stringify(order));

    try {
      await fetchService
        .post(process.env.REACT_APP_API_URL_INDRA + '/async_task/json_format', order)
        .then((json: any) => {
          console.log('Result: ' + JSON.stringify(json));
          if (Array.isArray(json)) {
            json.forEach((order) => {
              console.log('Uspesne zavedeni nabidky: ' + order.id.orderId + '/' + order.id.versionId);
              // set snackbar
              setMessage(t('indra:order.message.created'));
              setOpen(true);
            });
          }
        });
    } catch (e) {
      console.log('Chyba pri zavedení nabídky: ' + e);
    }
  }

  async function sendJsonDeleteOrder() {
    const sender: ErIdentification = {
      codingScheme: '14',
      id: user_ean
    };

    const receiver: ErIdentification = {
      codingScheme: '14',
      id: ote_ean
    };

    let tradeList: Trade[] = getTradeList(false, true);

    if (tradeList.length == 0) {
      setMessage(t('indra:order.validation.qtyPrice'));
      setOpen(true);
      return;
    }

    const isotedata: Isotedata = {
      id: 'ISO2341657498',
      messageCode: '821',
      receiverIdentification: receiver,
      senderIdentification: sender,
      dateTime: new Date(),
      trade: tradeList
    };

    const order: EnergyOrder = {
      task_id: 1,
      user_id: user_id,
      ts: new Date().getTime(),
      isotedata: isotedata
    };

    try {
      await fetchService
        .post(process.env.REACT_APP_API_URL_INDRA + '/async_task/json_format', order)
        .then((json: any) => {
          console.log('Result: ' + JSON.stringify(json));
          if (Array.isArray(json)) {
            json.forEach((order) => {
              console.log('Uspesne smazani nabidky: ' + order.id.orderId + '/' + order.id.versionId);
              // show snackbar
              setMessage(t('indra:order.message.deleted'));
              setOpen(true);
            });
          }
        });
    } catch (e) {
      console.log('Chyba pri zavedení nabídky: ' + e);
    }
  }
});

interface FormBlockHeaderI extends ClipboardProps {
  blockSelection: (number | null)[];
  setBlockSelection: (selection: number[]) => void;
  comments: string[];
  setComments: (comment: string[]) => void;
  blockMins: (number | null)[];
  setBlockMins: (blockMin: (number | null)[]) => void;
  blockPrice: string[];
  setBlockPrice: (price: string[]) => void;
  activeHours: ActiveHour[];
  setActiveHours: (activeHour: ActiveHour[]) => void;
  blockQtyPrice: string[][];
  setBlockQtyPrice: (blockQtyPrice: string[][]) => void;
}

const FormBlockHeader: FunctionComponent<FormBlockHeaderI> = React.memo((props) => {
  const {t} = useTranslation();

  const selectBoxes: JSX.Element[] = [];
  const hoursBoxes: JSX.Element[] = [];
  const minBoxes: JSX.Element[] = [];
  const commentBoxes: JSX.Element[] = [];
  const priceBoxes: JSX.Element[] = [];

  const handleBlockSelectionChange = (value: any, index: number) => {
    // set comments on index
    props.blockSelection[index] = Number(value);
    let c = Object.assign([], props.blockSelection);
    // update comments
    props.setBlockSelection(c);
  };

  const handleBlockMinsChange = (value: any, index: number) => {
    const validated = validatePercentage(value);
    if (validated == null) {
      return;
    }

    let newArray = props.blockMins.slice(0);
    newArray[index] = Number(validated);
    props.setBlockMins(newArray);
  };

  const handleCommentsChange = (value: string, index: number) => {
    if (validateComment(value) == null) {
      return;
    }

    // set comments on index
    props.comments[index] = value;
    let c = Object.assign([], props.comments);
    // update comments
    props.setComments(c);
  };

  const handleBlockPriceChange = (value: string, index: number) => {
    const validated = validatePrice(value);
    if (validated == null) {
      return;
    }

    let newArray = props.blockPrice.slice(0);
    newArray[index] = validated;
    props.setBlockPrice(newArray);
  };

  const handleBlockPriceChangeFixed = (value: string, index: number) => {
    value = formatPrice(value);

    let newArray = props.blockPrice.slice(0);
    newArray[index] = value;
    props.setBlockPrice(newArray);
  };

  useEffect(() => {
    if (props.pasteClipboard) {
      for (let i = 0; i < props.blockMins.length; i++) {
        let blockMin = validatePercentage(props.blockMins[i]);
        blockMin = blockMin == null ? '' : blockMin;
        props.blockMins[i] = blockMin;
      }
    }
  }, [props.blockMins]);

  useEffect(() => {
    if (props.pasteClipboard) {
      for (let i = 0; i < props.comments.length; i++) {
        let comment = validateComment(props.comments[i]);
        comment = comment == null ? '' : comment;
        props.comments[i] = comment;
      }
    }
  }, [props.comments]);

  useEffect(() => {
    if (props.pasteClipboard) {
      for (let i = 0; i < props.blockPrice.length; i++) {
        let price = convertFloatByLocale(props.blockPrice[i]);
        price = formatPrice(price);
        props.blockPrice[i] = price;
      }
    }
  }, [props.blockPrice]);

  /* start of clipboard stuff */
  const getData = () => {
    return [props.blockMins, props.comments, props.blockPrice, ...props.blockQtyPrice];
  };

  let data = getData();
  const setData = (data: any) => {
    if (data) {
      props.setBlockMins(data[0].slice());
      props.setComments(data[1].slice());
      props.setBlockPrice(data[2].slice());

      props.setBlockQtyPrice(data.slice(3)); // different!
    }
  };

  useEffect(() => {
    if (props.copyClipboard) {
      props.handleClipboardCopy(getData());
    }
  }, [props.copyClipboard]);
  /* end of clipboard stuff */

  for (let i = 0; i < props.activeHours.length; i++) {
    let isSelected = i == 0 ? true : false;
    hoursBoxes.push(
      <MenuItem selected={isSelected} key={'ActiveHour_' + i} value={props.activeHours[i].id}>
        {' '}
        {props.activeHours[i].code}{' '}
      </MenuItem>
    );
  }

  for (let i = 0; i < ORDER_NUMBER_OF_SEGMENTS; i++) {
    selectBoxes.push(
      <Box
        key={'SelectBox_' + i}
        display="flex"
        style={{
          backgroundColor: '#f4b084',
          border: 0,
          borderTop: '2px solid',
          borderRight: '2px solid',
          minWidth: 78,
          maxWidth: 78,
          minHeight: HEADER_HEIGHT,
          height: HEADER_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1
        }}>
        <Select
          value={props.blockSelection[i]}
          onChange={(e) => handleBlockSelectionChange(e.target.value, i)}
          disableUnderline>
          {hoursBoxes}
        </Select>
      </Box>
    );
  }

  for (let i = 0; i < ORDER_NUMBER_OF_SEGMENTS; i++) {
    minBoxes.push(
      <Box
        display="flex"
        key={'MinBox_' + i}
        style={{
          backgroundColor: '#FFF',
          border: 0,
          borderTop: '1px solid',
          borderRight: '2px solid',
          minWidth: 78,
          maxWidth: 78,
          minHeight: ROW_HEIGHT,
          height: ROW_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1,
          width: '100%'
        }}>
        <Input
          type="text"
          value={props.blockMins[i]}
          inputProps={{
            style: {textAlign: 'right'},
            max: 100,
            min: 0
          }}
          color="secondary"
          disableUnderline={true}
          className="blockMinsInput"
          onChange={(e) => handleBlockMinsChange(e.target.value, i)}
          onPaste={(e) => {
            props.handleClipboardPaste(e, data, setData, '', 0, i);
          }}
        />
        <span className="blockMinsPercentage">%</span>
      </Box>
    );
  }

  for (let i = 0; i < ORDER_NUMBER_OF_SEGMENTS; i++) {
    commentBoxes.push(
      <Box
        display="flex"
        key={'CommentBox_' + i}
        style={{
          backgroundColor: '#FFF',
          border: 0,
          borderTop: '1px solid',
          borderRight: '2px solid',
          minWidth: 78,
          maxWidth: 78,
          minHeight: ROW_HEIGHT,
          height: ROW_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1,
          paddingLeft: '5px'
        }}>
        <Input
          type="text"
          value={props.comments[i]}
          inputProps={{
            maxLength: 250
          }}
          color="secondary"
          disableUnderline={true}
          onChange={(e) => handleCommentsChange(e.target.value, i)}
          onPaste={(e) => {
            props.handleClipboardPaste(e, data, setData, '', 1, i);
          }}
        />
      </Box>
    );
  }

  for (let i = 0; i < ORDER_NUMBER_OF_SEGMENTS; i++) {
    priceBoxes.push(
      <Box
        display="flex"
        key={'PriceBox_' + i}
        style={{
          backgroundColor: '#FFF',
          border: 0,
          borderTop: '1px solid',
          borderRight: '2px solid',
          minWidth: 78,
          maxWidth: 78,
          minHeight: ROW_HEIGHT,
          height: ROW_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1
        }}>
        <Input
          type="number"
          value={props.blockPrice[i] || ''}
          inputProps={{
            style: {textAlign: 'right'}
          }}
          color="secondary"
          disableUnderline={true}
          onChange={(e) => handleBlockPriceChange(e.target.value, i)}
          onBlur={(e) => handleBlockPriceChangeFixed(e.target.value, i)}
          onPaste={(e) => {
            props.handleClipboardPaste(e, data, setData, '', 2, i);
          }}
        />
      </Box>
    );
  }

  return (
    <React.Fragment>
      <Grid style={{display: 'flex', minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT}}>
        <Box
          display="flex"
          style={{
            backgroundColor: '#f8cbad',
            border: 0,
            borderTop: '2px solid',
            borderRight: '2px solid',
            borderLeft: '2px solid',
            minWidth: 137,
            maxWidth: 137,
            minHeight: HEADER_HEIGHT,
            height: HEADER_HEIGHT,
            justifyContent: 'left',
            alignItems: 'center',
            boxSizing: 'border-box',
            flex: 1,
            paddingLeft: '5px'
          }}>
          {t('indra:order.detail.product')}
        </Box>

        {selectBoxes}
      </Grid>
      <Grid style={{display: 'flex', minHeight: ROW_HEIGHT, height: ROW_HEIGHT}}>
        <Box
          display="flex"
          style={{
            backgroundColor: '#FFF',
            border: 0,
            borderTop: '1px solid',
            borderRight: '2px solid',
            borderLeft: '2px solid',
            minWidth: 137,
            maxWidth: 137,
            minHeight: ROW_HEIGHT,
            height: ROW_HEIGHT,
            justifyContent: 'left',
            alignItems: 'center',
            boxSizing: 'border-box',
            flex: 1,
            paddingLeft: '5px'
          }}>
          {t('indra:order.detail.minPercent')}
        </Box>

        {minBoxes}
      </Grid>
      <Grid style={{display: 'flex', minHeight: ROW_HEIGHT, height: ROW_HEIGHT}}>
        <Box
          display="flex"
          style={{
            backgroundColor: '#FFF',
            border: 0,
            borderTop: '1px solid',
            borderRight: '2px solid',
            borderLeft: '2px solid',
            minWidth: 137,
            maxWidth: 137,
            minHeight: ROW_HEIGHT,
            height: ROW_HEIGHT,
            justifyContent: 'left',
            alignItems: 'center',
            boxSizing: 'border-box',
            flex: 1,
            paddingLeft: '5px'
          }}>
          {t('indra:order.detail.comment')}
        </Box>

        {commentBoxes}
      </Grid>
      <Grid style={{display: 'flex', minHeight: ROW_HEIGHT, height: ROW_HEIGHT}}>
        <Box
          display="flex"
          style={{
            backgroundColor: '#FFF',
            border: 0,
            borderTop: '1px solid',
            borderRight: '2px solid',
            borderLeft: '2px solid',
            minWidth: 137,
            maxWidth: 137,
            minHeight: ROW_HEIGHT,
            height: ROW_HEIGHT,
            justifyContent: 'left',
            alignItems: 'center',
            boxSizing: 'border-box',
            flex: 1,
            paddingLeft: '5px'
          }}>
          {t('indra:order.detail.priceQty')}
        </Box>

        {priceBoxes}
      </Grid>
    </React.Fragment>
  );
});

interface FormBlockBodyI extends PasteClipboardProps {
  blockQtyPrice: string[][];
  setBlockQtyPrice: (price: string[][]) => void;
  activeHours: (number | null)[];
}

const FormBlockBody: FunctionComponent<FormBlockBodyI> = React.memo((props) => {
  const {t} = useTranslation();
  const segments: JSX.Element[] = [];
  const times: JSX.Element[] = [];

  for (let i = 0; i < ORDER_NUMBER_OF_SEGMENTS; i++) {
    segments.push(
      <Box
        display="flex"
        key={'BlockSegment_' + i}
        style={{
          backgroundColor: LIGHT_BLUE,
          fontWeight: 700,
          border: 0,
          borderTop: '2px solid',
          borderRight: '2px solid',
          borderBottom: '2px solid',
          minWidth: 78,
          maxWidth: 78,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1
        }}>
        {t('indra:order.detail.quantity')}
      </Box>
    );
  }

  for (let i = 0; i < ORDER_NUMBER_OF_ROWS; i++) {
    const startTime = moment('00:00', 'HH:mm').add(15 * i, 'minutes');
    const endTime = startTime.clone().add(15, 'minutes');

    const quantityBoxes: JSX.Element[] = [];
    for (let m = 0; m < ORDER_NUMBER_OF_SEGMENTS; m++) {
      quantityBoxes.push(
        <QtyBlockQuantityCell
          m={m}
          i={i}
          blockQtyPrice={props.blockQtyPrice}
          setBlockQtyPrice={props.setBlockQtyPrice}
          activeHours={props.activeHours[m]}
          key={'BlockQuantityCell_' + m + '_' + i}
          pasteClipboard={props.pasteClipboard}
          handleClipboardPaste={props.handleClipboardPaste}
        />
      );
    }

    times.push(
      <Grid key={'timeRow' + i} style={{display: 'flex', minHeight: ROW_HEIGHT, height: ROW_HEIGHT}}>
        <Box
          display="flex"
          style={{
            backgroundColor: LIGHT_BLUE,
            maxWidth: 50,
            minWidth: 50,
            border: '1px solid',
            borderLeft: '2px solid',
            borderTop: '0px',
            alignItems: 'center',
            boxSizing: 'border-box',
            paddingRight: '3px',
            justifyContent: 'flex-end',
            borderBottomWidth: (i + 1) % 4 == 0 ? '2px' : '1px'
          }}>
          {i + 1}
        </Box>
        <Box
          display="flex"
          style={{
            backgroundColor: LIGHT_BLUE,
            maxWidth: 87,
            minWidth: 87,
            border: 0,
            borderBottom: '1px solid',
            borderTop: '0px solid',
            borderRight: '2px solid',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            borderBottomWidth: (i + 1) % 4 == 0 ? '2px' : '1px'
          }}>
          {startTime.format(t('indra:format.time.hourMinutes')) +
            ' - ' +
            endTime.format(t('indra:format.time.hourMinutes'))}
        </Box>
        {quantityBoxes}
      </Grid>
    );
  }

  return (
    <React.Fragment>
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
          {t('indra:order.detail.index')}
        </Box>
        <Box
          display="flex"
          style={{
            fontWeight: 'bold',
            backgroundColor: LIGHT_BLUE,
            maxWidth: 87,
            minWidth: 87,
            border: 0,
            borderTop: '2px solid',
            borderRight: '2px solid',
            borderBottom: '2px solid',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
          {t('indra:order.detail.time')}
        </Box>
        {segments}
      </Grid>

      {times}
    </React.Fragment>
  );
});

const FormHeader: FunctionComponent<FormHeaderProps> = React.memo((props) => {
  const {t} = useTranslation();
  const segmentCells = [];
  const segmentPriceAndAmountCells = [];

  for (let seg = 0; seg < props.qtyPriceData[0].length; seg++) {
    segmentCells.push(
      <Box
        display="flex"
        key={'SegHead_' + seg}
        style={{
          backgroundColor: DARK_ORANGE,
          border: 0,
          borderTop: '2px solid',
          borderRight: '2px solid',
          minWidth: 123,
          maxWidth: 123,
          minHeight: HEADER_HEIGHT,
          height: HEADER_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1
        }}>
        {t('indra:order.detail.segment').replace('%p1%', (seg + 1).toString())}
      </Box>
    );
    segmentPriceAndAmountCells.push(
      <Box
        display="flex"
        key={'SegDet_' + seg}
        style={{
          backgroundColor: 'white',
          borderTop: '2px solid',
          borderBottom: '2px solid',
          minWidth: 123,
          maxWidth: 123,
          justifyContent: 'stretch',
          alignItems: 'stretch',
          boxSizing: 'border-box',
          flex: 1,
          fontWeight: 700
        }}>
        <Box
          style={{
            boxSizing: 'border-box',
            textAlign: 'center',
            width: '63px',
            height: '101%',
            justifyContent: 'center',
            borderRight: '1px solid',
            alignItems: 'center'
          }}>
          <span style={{position: 'relative', top: 1}}>{t('indra:order.detail.quantity')}</span>
        </Box>
        <Box
          display="flex"
          style={{height: '101%', flex: 1, justifyContent: 'center', borderRight: '2px solid', alignItems: 'center'}}>
          {t('indra:order.detail.price')}
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Grid style={{border: 0, display: 'flex', minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT}}>
        <Grid
          style={{
            backgroundColor: LIGHT_ORANGE,
            minWidth: 137,
            maxWidth: 137,
            height: HEADER_HEIGHT,
            borderLeft: '2px solid',
            borderTop: '2px solid',
            borderRight: '2px solid',
            boxSizing: 'border-box'
          }}
        />
        {segmentCells}
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
          {t('indra:order.detail.index')}
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
          {t('indra:order.detail.time')}
        </Box>
        {segmentPriceAndAmountCells}
      </Grid>
    </>
  );
});

const FormHourHeader: FunctionComponent<any> = React.memo((props) => {
  const {t} = useTranslation();

  return (
    <Grid style={{display: 'flex', fontWeight: 700}}>
      <Box
        display="flex"
        key="Comment"
        style={{
          backgroundColor: LIGHT_BLUE,
          border: 0,
          borderTop: '2px solid',
          borderRight: '2px solid',
          borderLeft: '2px solid',
          minWidth: 220,
          maxWidth: 220,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1
        }}>
        {t('indra:order.detail.fhn.comment')}
      </Box>
      <Box
        display="flex"
        key="Price"
        style={{
          backgroundColor: LIGHT_BLUE,
          border: 0,
          borderTop: '2px solid',
          borderRight: '2px solid',
          minWidth: 105,
          maxWidth: 105,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1,
          textAlign: 'center'
        }}>
        {t('indra:order.detail.fhn.price')}
        <br />
        {t('indra:order.detail.fhn.priceUnit')}
      </Box>
      <Box
        display="flex"
        key="Value"
        style={{
          backgroundColor: LIGHT_BLUE,
          border: 0,
          borderTop: '2px solid',
          borderRight: '2px solid',
          minWidth: 105,
          maxWidth: 105,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1,
          textAlign: 'center'
        }}>
        {t('indra:order.detail.fhn.quantity')}
        <br />
        {t('indra:order.detail.fhn.quantityUnit')}
      </Box>
    </Grid>
  );
});

const FormHourBody: FunctionComponent<HourOrderProperties> = React.memo((props) => {
  const handleCommentChange = (value: string) => {
    if (validateComment(value) == null) {
      return;
    }
    props.onCommentChange(value);
  };

  const handlePriceChange = (value: string) => {
    const validated = validatePrice(value);
    if (validated == null) {
      return;
    }

    props.onPriceChange(validated);
  };

  const handleQuantityChange = (value: string) => {
    const validated = validateQuantity(value);
    if (validated == null) {
      return;
    }

    props.onQuantityChange(validated);
  };

  const handleQuantityChangeFixed = (value: string) => {
    value = formatQuantity(value);
    props.onQuantityChange(value);
  };

  const handlePriceChangeFixed = (value: string) => {
    value = formatPrice(value);
    props.onPriceChange(value);
  };

  /* start of clipboard stuff */
  useEffect(() => {
    if (props.pasteClipboard) {
      handleCommentChange(props.comment);
    }
  }, [props.comment]);

  useEffect(() => {
    if (props.pasteClipboard) {
      let price = convertFloatByLocale(props.price);
      handlePriceChangeFixed(price);
    }
  }, [props.price]);

  useEffect(() => {
    if (props.pasteClipboard) {
      let amount = convertFloatByLocale(props.quantity);
      handleQuantityChangeFixed(amount);
    }
  }, [props.quantity]);

  const getData = () => {
    return [
      [
        {
          comment: props.comment,
          price: props.price,
          quantity: props.quantity
        }
      ]
    ];
  };

  let data = getData();
  const setData = (data: any) => {
    if (data) {
      props.onCommentChange(data[0][0].comment);
      props.onPriceChange(data[0][0].price);
      props.onQuantityChange(data[0][0].quantity);
    }
  };

  useEffect(() => {
    if (props.copyClipboard) {
      props.handleClipboardCopy(getData());
    }
  }, [props.copyClipboard]);
  /* end of clipboard stuff */

  return (
    <Grid style={{display: 'flex', minHeight: ROW_HEIGHT, height: ROW_HEIGHT}}>
      <Box
        display="flex"
        key="Comment"
        style={{
          backgroundColor: '#FFF',
          border: 0,
          borderTop: '2px solid',
          borderRight: '1px solid',
          borderBottom: '2px solid',
          borderLeft: '2px solid',
          minWidth: 220,
          maxWidth: 220,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1,
          width: '100%',
          paddingLeft: '5px'
        }}>
        <Input
          type="text"
          color="secondary"
          style={{
            width: '100%'
          }}
          inputProps={{
            style: {textAlign: 'left', width: '100%'},
            maxLength: 250
          }}
          disableUnderline={true}
          value={props.comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          onPaste={(e) => {
            props.handleClipboardPaste(e, data, setData, 'comment');
          }}
        />
      </Box>
      <Box
        display="flex"
        key="Price"
        style={{
          backgroundColor: '#FFF',
          border: 0,
          borderTop: '2px solid',
          borderRight: '1px solid',
          borderBottom: '2px solid',
          minWidth: 105,
          maxWidth: 105,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1
        }}>
        <Input
          type="number"
          color="secondary"
          inputProps={{
            style: {textAlign: 'right', width: '100%'}
          }}
          disableUnderline={true}
          value={props.price || ''}
          onChange={(e) => handlePriceChange(e.target.value)}
          onBlur={(e) => handlePriceChangeFixed(e.target.value)}
          onPaste={(e) => {
            props.handleClipboardPaste(e, data, setData, 'price');
          }}
        />
      </Box>
      <Box
        display="flex"
        key="Value"
        style={{
          backgroundColor: '#FFF',
          border: 0,
          borderTop: '2px solid',
          borderRight: '2px solid',
          borderBottom: '2px solid',
          minWidth: 105,
          maxWidth: 105,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1
        }}>
        <Input
          type="number"
          color="secondary"
          inputProps={{
            style: {textAlign: 'right', width: '100%'}
          }}
          disableUnderline={true}
          value={props.quantity || ''}
          onChange={(e) => handleQuantityChange(e.target.value)}
          onBlur={(e) => handleQuantityChangeFixed(e.target.value)}
          onPaste={(e) => {
            props.handleClipboardPaste(e, data, setData, 'quantity');
          }}
        />
      </Box>
    </Grid>
  );
});

const OrderIdCell: FunctionComponent<any> = React.memo((props) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '1 1 0',
        width: 0,
        minWidth: 266
      }}>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: 134
        }}>
        {t('indra:order.id')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <Input disabled={true} disableUnderline={true} value={props.orderId ? props.orderId : ''} />
      </Grid>
    </Box>
  );
});

const VersionCell: FunctionComponent<any> = React.memo((props) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '1 1 0',
        width: 0,
        minWidth: 316
      }}>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: 184
        }}>
        {t('indra:order.version')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <Input disabled={true} disableUnderline={true} value={props.version ? props.version : ''} />
      </Grid>
    </Box>
  );
});

const CalendarCell: FunctionComponent<CalendarProps> = React.memo((props: CalendarProps) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  const handleDateChange = (date: MaterialUiPickersDate) => {
    let dateValue = date ? new Date(date.getTime()) : null;
    let dateString = date ? date.toDateString() : new Date().toDateString();
    readActiveHours(dateString, props.setActiveHours, props.blockQtyPrice, props.setBlockQtyPrice);
    props.onDateChange(dateValue);
  };

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '1 1 0px',
        width: 0,
        minWidth: 266
      }}>
      <Grid
        item
        className={classes.textCellStyle}
        style={{
          minWidth: 134
        }}>
        {t('indra:order.deliveryDay')}
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

const SenderCell: FunctionComponent = React.memo(() => {
  const {t} = useTranslation();
  const classes = gridStyles();

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '1 1 0px',
        width: 0,
        minWidth: 316
      }}>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: 184
        }}>
        {t('indra:order.participant')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <Input disabled={true} disableUnderline={true} defaultValue={user_ean} />
      </Grid>
    </Box>
  );
});

const CurrencyCell: FunctionComponent<CurrencyProps> = React.memo((props: CurrencyProps) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  const handleSelectChange = (event: any) => {
    props.onCurrencyChange(event.target.value);
  };

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '1 1 0px',
        width: 0,
        minWidth: 266
      }}>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: 134
        }}>
        {t('indra:order.currency')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <Select value={props.currency} onChange={handleSelectChange} disableUnderline>
          <MenuItem value={'CZK'}>{t('indra:currency.czk')}</MenuItem>
          <MenuItem value={'EUR'}>{t('indra:currency.eur')}</MenuItem>
        </Select>
      </Grid>
    </Box>
  );
});

const CategoryCell: FunctionComponent<CategoryProps> = React.memo((props: CategoryProps) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  const handleSelectChange = (event: any) => {
    props.onCategoryChange(event.target.value);
  };

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '1 1 0px',
        width: 0,
        minWidth: 316
      }}>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: 184
        }}>
        {t('indra:order.category')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <Select value={props.category} onChange={handleSelectChange} disableUnderline>
          <MenuItem value={'pbn'}>{t('indra:order.category.PBN')}</MenuItem>
          <MenuItem value={'fhn'}>{t('indra:order.category.FHN')}</MenuItem>
        </Select>
      </Grid>
    </Box>
  );
});

const DefaultCurrencyCell: FunctionComponent = React.memo(() => {
  const {t} = useTranslation();
  const classes = gridStyles();

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '1 1 0px',
        width: 0,
        minWidth: 316
      }}>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: 184
        }}>
        {t('indra:order.implicitCurrency')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <Input
          disabled={true}
          defaultValue={t('indra:currency.czk')} //translated - TODO?
          disableUnderline={true}
        />
      </Grid>
    </Box>
  );
});

const TradeTypeCell: FunctionComponent<TradeTypeProps> = React.memo((props: TradeTypeProps) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onTradeTypeChange(event.target.value);
  };

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '1 1 0px',
        width: 0,
        minWidth: 266
      }}>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: 134
        }}>
        {t('indra:order.type')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 132,
          width: 132
        }}>
        <RadioGroup
          value={props.tradeType}
          onChange={handleRadioChange}
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          }}>
          <FormControlLabel value="N" control={<StyledRadio />} label={t('indra:order.type.buy')} />
          <FormControlLabel value="P" control={<StyledRadio />} label={t('indra:order.type.sell')} />
        </RadioGroup>
      </Grid>
    </Box>
  );
});

const ExclusiveGroupCell: FunctionComponent<ExclusiveGroupProps> = React.memo((props: ExclusiveGroupProps) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onExclusiveGroupChange(event.target.value);
  };

  let isDisabled = props.category == 'fhn' ? true : false;

  return (
    <Box
      className={[classes.boxStyle, 'exclusive-group-border-box'].join(' ')}
      style={{
        flex: '1 1 0px',
        width: 0,
        minWidth: 301
      }}>
      <div className="exclusive-group-border"></div>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: 169
        }}>
        {t('indra:order.exclusiveGroup')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <RadioGroup
          value={props.exclusiveGroup}
          onChange={handleRadioChange}
          style={{display: 'flex', flexDirection: 'row'}}>
          <FormControlLabel value="ano" control={<StyledRadio />} label={t('indra:yes')} disabled={isDisabled} />
          <FormControlLabel value="ne" control={<StyledRadio />} label={t('indra:no')} disabled={isDisabled} />
        </RadioGroup>
      </Grid>
    </Box>
  );
});

const ExclusiveGroupIdCell: FunctionComponent<ExclusiveGroupIdProps> = React.memo((props: ExclusiveGroupIdProps) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onExclusiveGroupIdChange(event.target.value);
  };

  const isDisabled = props.isActive == 'ne' || props.category == 'fhn';
  const backgroundColor = isDisabled ? '#D3D3D3' : '#FFF';

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '1 1 0px',
        width: 0,
        minWidth: 301
      }}>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: 169
        }}>
        {t('indra:order.exclusiveGroupId')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <Input
          multiline={false}
          fullWidth={true}
          disabled={isDisabled}
          disableUnderline={true}
          value={props.exclusiveGroupId}
          onChange={handleTextChange}
        />
      </Grid>
    </Box>
  );
});

const CommentCell: FunctionComponent<CommentProps> = React.memo((props: CommentProps) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  const handleStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (validateComment(value) == null) {
      return;
    }
    props.onCommentChange(value);
  };

  return (
    <Box className={classes.boxStyle}>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: 134
        }}>
        {t('indra:order.comment')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <Input
          multiline={false}
          disableUnderline={true}
          style={{
            width: 'calc(100% - 10px)'
          }}
          value={props.comment}
          onChange={handleStringChange}
        />
      </Grid>
    </Box>
  );
});

const FinanceCell: FunctionComponent<FinanceProps> = React.memo((props: FinanceProps) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  const handleSelectChange = (event: any) => {
    props.onFinanceChange(event.target.value);
  };

  const minWidth = props.category == 'blok' ? 169 : 184;

  return (
    <Box
      className={classes.boxStyle}
      style={{
        flex: '1 1 0px',
        width: 0,
        minWidth: 316
      }}>
      <Grid
        className={classes.textCellStyle}
        style={{
          minWidth: minWidth
        }}>
        {t('indra:order.financeChange')}
      </Grid>
      <Grid
        className={classes.compCellStyle}
        style={{
          minWidth: 132
        }}>
        <Select value={props.finance} onChange={handleSelectChange} disableUnderline>
          <MenuItem value={1}>{' ' + t('indra:order.financeChange.immediately') + ' '}</MenuItem>
          <MenuItem value={2}>{' ' + t('indra:order.financeChange.anotherTime') + ' '}</MenuItem>
        </Select>
      </Grid>
    </Box>
  );
});

const HeaderSelection: FunctionComponent<HeaderSelectionProps> = React.memo((props) => {
  const classes = gridStyles();

  return (
    <Box className={'block-header'}>
      <Grid>
        <SelectionCell onSelectionChange={props.onSelectionChange} selectionType={props.selectionType} />
      </Grid>
    </Box>
  );
});

const SelectionCell: FunctionComponent<SelectionProps> = React.memo((props: SelectionProps) => {
  const {t} = useTranslation();
  const classes = gridStyles();

  const handleSelectChange = (event: any) => {
    props.onSelectionChange(event.target.value);
  };

  return (
    <React.Fragment>
      <Box className={['selection-wrapper', classes.boxStyle].join(' ')}>
        <Grid
          className={classes.textCellStyle}
          style={{
            flex: '1 1 0px',
            width: 0,
            minWidth: 266
          }}>
          <Grid
            className={classes.textCellStyle}
            style={{
              minWidth: 134
            }}>
            <span className="block-header-text">{t('indra:form.title.header')}</span>
          </Grid>
          <Grid className={classes.compCellStyle}>
            <Select value={props.selectionType} onChange={handleSelectChange} disableUnderline>
              <MenuItem value={'standard'}>{' ' + t('indra:order.type.standard') + ' '}</MenuItem>
              <MenuItem value={'blok'}>{' ' + t('indra:order.type.block') + ' '}</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid
          className={classes.compCellStyle}
          style={{
            flex: '1 1 0px',
            width: 0,
            minWidth: 316
          }}></Grid>
        {props.selectionType == 'blok' && (
          <Grid
            className={classes.compCellStyle}
            style={{
              flex: '1 1 0px',
              width: 0,
              minWidth: 301
            }}></Grid>
        )}
      </Box>
    </React.Fragment>
  );
});

const HeaderTable: FunctionComponent<HeaderProps & OrderProps> = React.memo((props) => {
  const classes = gridStyles();

  const blockType = props.selectionType == 'blok' ? 'form-block-blok' : 'form-block-standard';

  return (
    <Box className={[classes.gridOuter, 'form-block', blockType].join(' ')}>
      {props.modifyOrder && (
        <Grid className={classes.grid}>
          <OrderIdCell orderId={props.orderId} />
          <VersionCell version={props.version} />
          {props.selectionType == 'blok' && (
            <Box
              className={classes.boxStyle}
              style={{
                flex: '1 1 0',
                width: 0,
                minWidth: 301
              }}>
              {/* TO PREVENT BREAK LAYOUT */}
              <Grid className={classes.textCellStyle} />
              <Grid className={classes.compCellStyle} />
            </Box>
          )}
        </Grid>
      )}
      <Grid className={classes.grid}>
        <CalendarCell
          tradeDate={props.tradeDay}
          onDateChange={props.onDateChange}
          activeHours={props.activeHours}
          setActiveHours={props.setActiveHours}
          blockQtyPrice={props.blockQtyPrice}
          setBlockQtyPrice={props.setBlockQtyPrice}
        />
        <SenderCell />
        {props.selectionType == 'blok' && (
          <ExclusiveGroupCell
            exclusiveGroup={props.exclusiveGroup}
            onExclusiveGroupChange={props.onExclusiveGroupChange}
            category={props.category}
          />
        )}
      </Grid>
      <Grid className={[classes.grid, 'border-row'].join(' ')}>
        <CurrencyCell currency={props.currency} onCurrencyChange={props.onCurrencyChange} />
        <DefaultCurrencyCell />
        {props.selectionType == 'blok' && (
          <ExclusiveGroupIdCell
            exclusiveGroupId={props.exclusiveGroupId}
            onExclusiveGroupIdChange={props.onExclusiveGroupIdChange}
            isActive={props.exclusiveGroup}
            category={props.category}
          />
        )}
      </Grid>
      <Grid className={classes.grid}>
        <TradeTypeCell tradeType={props.tradeType} onTradeTypeChange={props.onTradeTypeChange} />

        {props.selectionType == 'blok' && (
          <React.Fragment>
            <CategoryCell category={props.category} onCategoryChange={props.onCategoryChange} />
            <FinanceCell
              finance={props.finance}
              onFinanceChange={props.onFinanceChange}
              category={props.selectionType}
            />
          </React.Fragment>
        )}

        {props.selectionType == 'standard' && (
          <Box style={{minWidth: 316}} className={classes.boxStyle}>
            {/* TO PREVENT BREAK LAYOUT */}
            <Grid className={classes.textCellStyle} />
            <Grid className={classes.compCellStyle} />
          </Box>
        )}
      </Grid>
      <Grid className={classes.grid}>
        {props.selectionType == 'standard' && (
          <React.Fragment>
            <CommentCell comment={props.comment} onCommentChange={props.onCommentChange} />
            <FinanceCell
              finance={props.finance}
              onFinanceChange={props.onFinanceChange}
              category={props.selectionType}
            />
          </React.Fragment>
        )}
      </Grid>
    </Box>
  );
});

interface FormHeaderProps {
  qtyPriceData: QtyPrice[][];
}

interface FormDetailProps extends ClipboardProps {
  qtyPriceData: QtyPrice[][];
  setQtyPriceData: (qtyPriceData: QtyPrice[][]) => void;
}

const FormDetail: FunctionComponent<FormDetailProps> = React.memo((props) => {
  /* start of clipboard stuff */
  useEffect(() => {
    if (props.copyClipboard) {
      props.handleClipboardCopy(props.qtyPriceData);
    }
  }, [props.copyClipboard]);
  /* end of clipboard stuff */

  const rows = [];
  for (let r = 0; r < props.qtyPriceData.length; r++) {
    rows.push(<AllRows key={'ARP' + r} hour={r} {...props} />);
  }
  return <> {rows} </>;
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

interface QtyBlockQuantityCellI extends PasteClipboardProps {
  i: number;
  m: number;
  blockQtyPrice: string[][];
  setBlockQtyPrice: (block: string[][]) => void;
  activeHours: number | null;
}

export const QtyBlockQuantityCell: FunctionComponent<QtyBlockQuantityCellI> = React.memo((props) => {
  const [quantity, setQuantity] = useState<string>(props.blockQtyPrice[props.i][props.m]);

  // calculate active hours
  let isDisabled = false;
  let hour = props.i + 1;

  if (activeHours) {
    for (let i = 0; i < activeHours.length; i++) {
      if (props.activeHours == activeHours[i].id) {
        if (!activeHours[i].intervals.includes(hour)) {
          isDisabled = true;
        }
      }
    }
  }

  // calculate background color
  let backgroundColor = '#fff';
  if (props.i % 8 < 4) {
    backgroundColor = '#fff';
  } else {
    backgroundColor = '#ededed';
  }
  if (isDisabled) {
    backgroundColor = '#b5b5b5';
  }

  function handleQuantityChange(value: string) {
    const validated = validateQuantity(value);
    if (validated == null) {
      return;
    }

    setQuantity(validated);
    props.blockQtyPrice[props.i][props.m] = validated;
  }

  function handleQuantityChangeFixed(value: string) {
    value = formatQuantity(value);

    setQuantity(value);
    props.blockQtyPrice[props.i][props.m] = value;
  }

  useEffect(() => {
    if (props.pasteClipboard) {
      let quantity = props.blockQtyPrice[props.i][props.m];
      quantity = convertFloatByLocale(quantity);
      handleQuantityChangeFixed(quantity);
    } else {
      setQuantity(props.blockQtyPrice[props.i][props.m]);
    }
  }, [props.blockQtyPrice[props.i][props.m]]);

  return (
    <Box
      display="flex"
      key={'QuantityBox_' + props.i + '_' + props.m}
      style={{
        backgroundColor: '#FFF',
        border: 0,
        borderBottom: '1px solid',
        borderRight: '2px solid',
        minWidth: 78,
        maxWidth: 78,
        minHeight: ROW_HEIGHT,
        height: ROW_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        flex: 1,
        background: backgroundColor,
        borderBottomWidth: (props.i + 1) % 4 == 0 ? '2px' : '1px'
      }}>
      <Input
        type="number"
        color="secondary"
        key={'QuantityBoxInput_' + props.i + '_' + props.m}
        value={isDisabled ? '' : quantity}
        onChange={(e) => handleQuantityChange(e.target.value)}
        onBlur={(e) => handleQuantityChangeFixed(e.target.value)}
        onPaste={(e) => {
          props.handleClipboardPaste(e, props.blockQtyPrice, props.setBlockQtyPrice, '', props.i, props.m);
        }}
        inputProps={{
          disabledUnderline: true,
          style: {
            width: '100%',
            textAlign: 'right'
          }
        }}
        disableUnderline={true}
        disabled={isDisabled}
      />
    </Box>
  );
});

interface QtyPriceCellRowProps extends FormRowsProps {
  segment: number;
}

export const QtyPriceCellRow: FunctionComponent<FormRowsProps> = React.memo((props) => {
  const cells = [];
  for (let i = 0; i < props.qtyPriceData[0].length; i++) {
    cells.push(<QtyPriceCell key={'QPCR' + i + '_' + props.hour} segment={i} {...props} />);
  }
  return <>{cells}</>;
});

export const QtyPriceCell: FunctionComponent<QtyPriceCellRowProps> = React.memo((props) => {
  const [price, setPrice] = useState<string>(props.qtyPriceData[props.hour][props.segment].price);
  const [quantity, setQuantity] = useState<string>(props.qtyPriceData[props.hour][props.segment].quantity);

  const handlePriceChange = (value: string) => {
    const validated = validatePrice(value);
    if (validated == null) {
      return;
    }

    setPrice(validated);
    props.qtyPriceData[props.hour][props.segment].price = validated;
  };

  const handleQuantityChange = (value: string) => {
    const validated = validateQuantity(value);
    if (validated == null) {
      return;
    }

    setQuantity(validated);
    props.qtyPriceData[props.hour][props.segment].quantity = validated;
  };

  const handlePriceChangeFixed = (value: string) => {
    value = formatPrice(value);

    setPrice(value);
    props.qtyPriceData[props.hour][props.segment].price = value;
  };

  const handleQuantityChangeFixed = (value: string) => {
    value = formatQuantity(value);

    setQuantity(value);
    props.qtyPriceData[props.hour][props.segment].quantity = value;
  };

  useEffect(() => {
    if (props.pasteClipboard) {
      let price = props.qtyPriceData[props.hour][props.segment].price;
      price = convertFloatByLocale(price);
      handlePriceChangeFixed(price);
    } else {
      setPrice(props.qtyPriceData[props.hour][props.segment].price);
    }
  }, [props.qtyPriceData[props.hour][props.segment].price]);

  useEffect(() => {
    if (props.pasteClipboard) {
      let quantity = props.qtyPriceData[props.hour][props.segment].quantity;
      quantity = convertFloatByLocale(quantity);
      handleQuantityChangeFixed(quantity);
    } else {
      setQuantity(props.qtyPriceData[props.hour][props.segment].quantity);
    }
  }, [props.qtyPriceData[props.hour][props.segment].quantity]);

  return (
    <React.Fragment key={'QP' + props.segment + '_' + props.hour}>
      <Box
        display="flex"
        style={{
          border: 0,
          borderRight: '1px solid',
          borderBottom: '1px solid',
          minWidth: 63,
          maxWidth: 63,
          boxSizing: 'border-box',
          flex: 1,
          background: props.hour % 8 < 4 ? 'white' : '#ededed',
          borderBottomWidth: (props.hour + 1) % 4 == 0 ? '2px' : '1px',
          height: ROW_HEIGHT
        }}>
        <Input
          type="number"
          color="secondary"
          inputProps={{
            style: {textAlign: 'right', width: '100%', position: 'relative', top: '1px'}
          }}
          disableUnderline={true}
          value={quantity || ''}
          onChange={(e) => handleQuantityChange(e.target.value)}
          onBlur={(e) => handleQuantityChangeFixed(e.target.value)}
          onPaste={(e) => {
            props.handleClipboardPaste(
              e,
              props.qtyPriceData,
              props.setQtyPriceData,
              'quantity',
              props.hour,
              props.segment
            );
          }}
        />
      </Box>
      <Box
        display="flex"
        style={{
          border: 0,
          borderRight: '1px solid',
          borderBottom: '1px solid',
          minWidth: 60,
          maxWidth: 60,
          height: ROW_HEIGHT,
          boxSizing: 'border-box',
          flex: 1,
          background: props.hour % 8 < 4 ? 'white' : '#ededed',
          borderBottomWidth: (props.hour + 1) % 4 == 0 ? '2px' : '1px',
          borderRightWidth: '2px'
        }}>
        <Input
          type="number"
          color="secondary"
          inputProps={{
            style: {textAlign: 'right', width: '100%', position: 'relative', top: '1px'}
          }}
          disableUnderline={true}
          value={price || ''}
          onChange={(e) => handlePriceChange(e.target.value)}
          onBlur={(e) => handlePriceChangeFixed(e.target.value)}
          onPaste={(e) => {
            props.handleClipboardPaste(
              e,
              props.qtyPriceData,
              props.setQtyPriceData,
              'price',
              props.hour,
              props.segment
            );
          }}
          style={{flex: 1}}
        />
      </Box>
    </React.Fragment>
  );
});

function StyledRadio(props: RadioProps) {
  const classes = radioStyle();

  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<span className={[classes.icon, classes.checkedIcon].join(' ')} />}
      icon={<span className={classes.icon} />}
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

const radioStyle = makeStyles({
  label: {
    marginRight: 6
  },
  icon: {
    margin: '4px -7px 4px 2px',
    borderRadius: '50%',
    border: '1px solid #e2e0de',
    width: 13,
    height: 13,
    backgroundColor: '#f5f8fa',
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    backgroundColor: '#f5f8fa',
    '&:before': {
      display: 'block',
      width: 6,
      height: 6,
      background: '#000',
      position: 'relative',
      top: 3,
      left: 3,
      borderRadius: '50%',
      content: '""'
    },
    'input:disabled ~ &:before': {
      boxShadow: 'none',
      background: 'rgb(211, 211, 211)'
    }
  }
});

export default Order;
