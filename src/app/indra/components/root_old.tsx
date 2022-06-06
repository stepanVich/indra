/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import React from 'react';
import { useParams } from "react-router-dom";
import fetchService from '../services/fetch';
import './root.css';
import ReactVirtualizedTable from './table';
import { RouteMatchProps } from './root';
//import fetchService from './services/fetch';

/*class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}*/

type SquareProps = {
  value: string,
  onClick: (square: any) => void,
}

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

type BoardProps = {}

type BoardState = {
  xIsNext: boolean,
  squares: any[],
}

class Board extends React.Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i: number) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i: number) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}{this.renderSquare(1)}{this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}{this.renderSquare(4)}{this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}{this.renderSquare(7)}{this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: any[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function sendOrder() {
  /*alert('Send Order');*/

  let order =
  {
    "task_id": 1,
    "user_id": 486,
    "ts": 1554123000000,
    "isotedata": {
      "id": "ISOTCZ20200527_N",
      "messageCode": "811",
      "senderIdentification": {
        "codingScheme": "14",
        "id": "8591824522009" // účastník
      },
      "receiverIdentification": {
        "codingScheme": "14",
        "id": "8591824000007"
      },
    "dateTime": "2020-05-25T16:49:28.123Z",
      "trade": [
        {
          "acceptance": "N",
          "replacement": "N",
          "settCurr": "EUR",  //kod meny vypo
          "sourceSys": "OTE", //default
          "tradeDay": "2020-05-27",  // den dodávky
          "tradeStage": "N",
          "tradeType": "N", //nakup/prodej
          "resolution": "PT15M", //default
          "externalId": "order_AX_001", 
          "profileData": [
            {
              "profileRole": "BC01", //BC Množství  01 Segment
              "unit": "MAW",
              "data": [
                {
                  "period": "1", //index
                  "value": "110" // Množství
                },
                {
                  "period": "2",
                  "value": "120"
                },
                {
                  "period": "3",
                  "value": "130"
                },
                {
                  "period": "4",
                  "value": "140"
                },
                {
                  "period": "5",
                  "value": "150"
                },
                {
                  "period": "6",
                  "value": "160"
                },
                {
                  "period": "7",
                  "value": "170"
                },
                {
                  "period": "8",
                  "value": "180"
                },
                {
                  "period": "9",
                  "value": "190"
                },
                {
                  "period": "10",
                  "value": "200"
                },
                {
                  "period": "11",
                  "value": "210"
                },
                {
                  "period": "12",
                  "value": "220"
                },
                {
                  "period": "13",
                  "value": "230"
                },
                {
                  "period": "14",
                  "value": "240"
                },
                {
                  "period": "15",
                  "value": "250"
                },
                {
                  "period": "16",
                  "value": "260"
                },
                {
                  "period": "17",
                  "value": "270"
                },
                {
                  "period": "18",
                  "value": "280"
                },
                {
                  "period": "19",
                  "value": "290"
                },
                {
                  "period": "20",
                  "value": "300"
                },
                {
                  "period": "21",
                  "value": "310"
                },
                {
                  "period": "22",
                  "value": "320"
                },
                {
                  "period": "23",
                  "value": "330"
                },
                {
                  "period": "24",
                  "value": "340"
                },
                {
                  "period": "25",
                  "value": "350"
                },
                {
                  "period": "26",
                  "value": "360"
                },
                {
                  "period": "27",
                  "value": "370"
                },
                {
                  "period": "28",
                  "value": "380"
                },
                {
                  "period": "29",
                  "value": "390"
                },
                {
                  "period": "30",
                  "value": "400"
                },
                {
                  "period": "31",
                  "value": "410"
                },
                {
                  "period": "32",
                  "value": "420"
                },
                {
                  "period": "33",
                  "value": "430"
                },
                {
                  "period": "34",
                  "value": "440"
                },
                {
                  "period": "35",
                  "value": "450"
                },
                {
                  "period": "36",
                  "value": "460"
                },
                {
                  "period": "37",
                  "value": "470"
                },
                {
                  "period": "38",
                  "value": "480"
                },
                {
                  "period": "39",
                  "value": "490"
                },
                {
                  "period": "40",
                  "value": "500"
                },
                {
                  "period": "41",
                  "value": "510"
                },
                {
                  "period": "42",
                  "value": "520"
                },
                {
                  "period": "43",
                  "value": "530"
                },
                {
                  "period": "44",
                  "value": "540"
                },
                {
                  "period": "45",
                  "value": "550"
                },
                {
                  "period": "46",
                  "value": "560"
                },
                {
                  "period": "47",
                  "value": "570"
                },
                {
                  "period": "48",
                  "value": "580"
                },
                {
                  "period": "49",
                  "value": "590"
                },
                {
                  "period": "50",
                  "value": "600"
                },
                {
                  "period": "51",
                  "value": "610"
                },
                {
                  "period": "52",
                  "value": "620"
                },
                {
                  "period": "53",
                  "value": "630"
                },
                {
                  "period": "54",
                  "value": "640"
                },
                {
                  "period": "55",
                  "value": "650"
                },
                {
                  "period": "56",
                  "value": "660"
                },
                {
                  "period": "57",
                  "value": "670"
                },
                {
                  "period": "58",
                  "value": "680"
                },
                {
                  "period": "59",
                  "value": "690"
                },
                {
                  "period": "60",
                  "value": "700"
                },
                {
                  "period": "61",
                  "value": "710"
                },
                {
                  "period": "62",
                  "value": "720"
                },
                {
                  "period": "63",
                  "value": "730"
                },
                {
                  "period": "64",
                  "value": "740"
                },
                {
                  "period": "65",
                  "value": "750"
                },
                {
                  "period": "66",
                  "value": "760"
                },
                {
                  "period": "67",
                  "value": "770"
                },
                {
                  "period": "68",
                  "value": "780"
                },
                {
                  "period": "69",
                  "value": "790"
                },
                {
                  "period": "70",
                  "value": "800"
                },
                {
                  "period": "71",
                  "value": "810"
                },
                {
                  "period": "72",
                  "value": "820"
                },
                {
                  "period": "73",
                  "value": "830"
                },
                {
                  "period": "74",
                  "value": "840"
                },
                {
                  "period": "75",
                  "value": "850"
                },
                {
                  "period": "76",
                  "value": "860"
                },
                {
                  "period": "77",
                  "value": "870"
                },
                {
                  "period": "78",
                  "value": "880"
                },
                {
                  "period": "79",
                  "value": "890"
                },
                {
                  "period": "80",
                  "value": "900"
                },
                {
                  "period": "81",
                  "value": "910"
                },
                {
                  "period": "82",
                  "value": "920"
                },
                {
                  "period": "83",
                  "value": "930"
                },
                {
                  "period": "84",
                  "value": "940"
                },
                {
                  "period": "85",
                  "value": "950"
                },
                {
                  "period": "86",
                  "value": "960"
                },
                {
                  "period": "87",
                  "value": "970"
                },
                {
                  "period": "88",
                  "value": "980"
                },
                {
                  "period": "89",
                  "value": "990"
                },
                {
                  "period": "90",
                  "value": "1000"
                },
                {
                  "period": "91",
                  "value": "1010"
                },
                {
                  "period": "92",
                  "value": "1020"
                },
                {
                  "period": "93",
                  "value": "1030"
                },
                {
                  "period": "94",
                  "value": "1040"
                },
                {
                  "period": "95",
                  "value": "1050"
                },
                {
                  "period": "96",
                  "value": "1060"
                }
              ]
            },
            {
              "profileRole": "BP01", // BP Cena 01 Segment
              "unit": "EUR/MWh",
              "data": [
                {
                  "period": "1",
                  "value": "111"
                },
                {
                  "period": "2",
                  "value": "121"
                },
                {
                  "period": "3",
                  "value": "131"
                },
                {
                  "period": "4",
                  "value": "141"
                },
                {
                  "period": "5",
                  "value": "151"
                },
                {
                  "period": "6",
                  "value": "161"
                },
                {
                  "period": "7",
                  "value": "171"
                },
                {
                  "period": "8",
                  "value": "181"
                },
                {
                  "period": "9",
                  "value": "191"
                },
                {
                  "period": "10",
                  "value": "201"
                },
                {
                  "period": "11",
                  "value": "211"
                },
                {
                  "period": "12",
                  "value": "221"
                },
                {
                  "period": "13",
                  "value": "231"
                },
                {
                  "period": "14",
                  "value": "241"
                },
                {
                  "period": "15",
                  "value": "251"
                },
                {
                  "period": "16",
                  "value": "261"
                },
                {
                  "period": "17",
                  "value": "271"
                },
                {
                  "period": "18",
                  "value": "281"
                },
                {
                  "period": "19",
                  "value": "291"
                },
                {
                  "period": "20",
                  "value": "301"
                },
                {
                  "period": "21",
                  "value": "311"
                },
                {
                  "period": "22",
                  "value": "321"
                },
                {
                  "period": "23",
                  "value": "331"
                },
                {
                  "period": "24",
                  "value": "341"
                },
                {
                  "period": "25",
                  "value": "351"
                },
                {
                  "period": "26",
                  "value": "361"
                },
                {
                  "period": "27",
                  "value": "371"
                },
                {
                  "period": "28",
                  "value": "381"
                },
                {
                  "period": "29",
                  "value": "391"
                },
                {
                  "period": "30",
                  "value": "401"
                },
                {
                  "period": "31",
                  "value": "411"
                },
                {
                  "period": "32",
                  "value": "421"
                },
                {
                  "period": "33",
                  "value": "431"
                },
                {
                  "period": "34",
                  "value": "441"
                },
                {
                  "period": "35",
                  "value": "451"
                },
                {
                  "period": "36",
                  "value": "461"
                },
                {
                  "period": "37",
                  "value": "471"
                },
                {
                  "period": "38",
                  "value": "481"
                },
                {
                  "period": "39",
                  "value": "491"
                },
                {
                  "period": "40",
                  "value": "501"
                },
                {
                  "period": "41",
                  "value": "511"
                },
                {
                  "period": "42",
                  "value": "521"
                },
                {
                  "period": "43",
                  "value": "531"
                },
                {
                  "period": "44",
                  "value": "541"
                },
                {
                  "period": "45",
                  "value": "551"
                },
                {
                  "period": "46",
                  "value": "561"
                },
                {
                  "period": "47",
                  "value": "571"
                },
                {
                  "period": "48",
                  "value": "581"
                },
                {
                  "period": "49",
                  "value": "591"
                },
                {
                  "period": "50",
                  "value": "601"
                },
                {
                  "period": "51",
                  "value": "611"
                },
                {
                  "period": "52",
                  "value": "621"
                },
                {
                  "period": "53",
                  "value": "631"
                },
                {
                  "period": "54",
                  "value": "641"
                },
                {
                  "period": "55",
                  "value": "651"
                },
                {
                  "period": "56",
                  "value": "661"
                },
                {
                  "period": "57",
                  "value": "671"
                },
                {
                  "period": "58",
                  "value": "681"
                },
                {
                  "period": "59",
                  "value": "691"
                },
                {
                  "period": "60",
                  "value": "701"
                },
                {
                  "period": "61",
                  "value": "711"
                },
                {
                  "period": "62",
                  "value": "721"
                },
                {
                  "period": "63",
                  "value": "731"
                },
                {
                  "period": "64",
                  "value": "741"
                },
                {
                  "period": "65",
                  "value": "751"
                },
                {
                  "period": "66",
                  "value": "761"
                },
                {
                  "period": "67",
                  "value": "771"
                },
                {
                  "period": "68",
                  "value": "781"
                },
                {
                  "period": "69",
                  "value": "791"
                },
                {
                  "period": "70",
                  "value": "801"
                },
                {
                  "period": "71",
                  "value": "811"
                },
                {
                  "period": "72",
                  "value": "821"
                },
                {
                  "period": "73",
                  "value": "831"
                },
                {
                  "period": "74",
                  "value": "841"
                },
                {
                  "period": "75",
                  "value": "851"
                },
                {
                  "period": "76",
                  "value": "861"
                },
                {
                  "period": "77",
                  "value": "871"
                },
                {
                  "period": "78",
                  "value": "881"
                },
                {
                  "period": "79",
                  "value": "891"
                },
                {
                  "period": "80",
                  "value": "901"
                },
                {
                  "period": "81",
                  "value": "911"
                },
                {
                  "period": "82",
                  "value": "921"
                },
                {
                  "period": "83",
                  "value": "931"
                },
                {
                  "period": "84",
                  "value": "941"
                },
                {
                  "period": "85",
                  "value": "951"
                },
                {
                  "period": "86",
                  "value": "961"
                },
                {
                  "period": "87",
                  "value": "971"
                },
                {
                  "period": "88",
                  "value": "981"
                },
                {
                  "period": "89",
                  "value": "991"
                },
                {
                  "period": "90",
                  "value": "1001"
                },
                {
                  "period": "91",
                  "value": "1011"
                },
                {
                  "period": "92",
                  "value": "1021"
                },
                {
                  "period": "93",
                  "value": "1031"
                },
                {
                  "period": "94",
                  "value": "1041"
                },
                {
                  "period": "95",
                  "value": "1051"
                },
                {
                  "period": "96",
                  "value": "1061"
                }
              ]
            }
          ],
          "party": [{
            "id": "8591824522009",
            "role": "TO"
          }]
        }
      ]
    }
  };
    //try{
      fetchService.post(process.env.REACT_APP_API_URL_INDRA + '/async_task/json_format', order).catch(function (error) {
        console.log(error);
      });
    /*} catch (e) {
      console.log('-----------error: ' + e.getMessage())
    }*/
  
}

type ShoppingListProps = {
  name: StringConstructor;
};

class ShoppingList extends React.Component<ShoppingListProps> {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

function MyButton() {
  return <button onClick={sendOrder}>
  Send Order
  </button>
}

class NameForm extends React.Component<RouteMatchProps, VirtualizedTableState> {
  constructor(props: RouteMatchProps) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event: any) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function UIButton() {
  const classes = useStyles();

  return <Button
  variant="contained"
  color="primary"
  size="small"
  className={classes.button}
  startIcon={<SaveIcon />}
  onClick={() => alert('Clicked')}
>
  Save
</Button>
}

class Root extends React.Component<RouteMatchProps, VirtualizedTableState> {

  constructor(props: RouteMatchProps) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event: any) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    
    
    return (
      <>
      {/* <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form> */}
      <ReactVirtualizedTable />
      <UIButton />
    </>
    );
  }
}

export type VirtualizedTableState = {
  value: any;
};

export class VirtualizedTable extends React.Component<RouteMatchProps, VirtualizedTableState> {

  constructor(props: RouteMatchProps) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    //alert('Props:' + JSON.stringify(this.props.match));
  }

  handleChange(event: any) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event: any) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    

    
    return (
      <>
      {/* <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form> */}
      <h3>ID: {this.props.match.params.id}</h3>
      <ReactVirtualizedTable />
      <UIButton />
    </>
    );
  }
}

export function VirtualizedTable1() {
  let { id } = useParams();

  return(
    <>
    <h3>ID: {id}</h3>
      <ReactVirtualizedTable />
      <UIButton />
      </>
  );
}

/*export function VirtualizedTable1 (props) => (
  <VirtualizedTable
      {...props}
      params={useParams()}
  />
);*/

export default Root;