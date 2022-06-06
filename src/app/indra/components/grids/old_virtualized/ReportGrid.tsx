import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { RouteMatchProps } from '../../root';

const json = {
  "Grid": {
    "id": 1001,
    "label": "Sesouhlasení DT",
    "procName": "DM_GRID.GRID_1001",
    "params": [
      {
        "order": 1,
        "label": "Den dodavky",
        "datatype": "DateTime",
        "db_param_name": "pi_qm_id",
      }
    ],
    "columns": [
      {
        "order": 1,
        "width": 50,
        "label": "Index",
        "datatype": "Number",
      },
      {
        "order": 2,
        "width": 150,
        "label": "Cas",
        "datatype": "DateTime",
      },
      {
        "order": 3,
        "width": 150,
        "label": "Nákup - Množství (MWh)",
        "datatype": "Number",
      },
      {
        "order": 4,
        "width": 150,
        "label": "Prodej - Množství (MWh)",
        "datatype": "Number",
      },
      {
        "order": 5,
        "width": 150,
        "label": "Množství (MWh)",
        "datatype": "Number",
      },
      {
        "order": 6,
        "width": 150,
        "label": "Cena (€/MWh)",
        "datatype": "Number",
      }
    ],
  }
};

class ReportGrid extends React.Component<RouteMatchProps> {

  renderParam(datatype: string) {
    switch (datatype) {
      case 'DateTime':
        return <input type="text" value={""} />;
      default:
        return 'string';
    }
  }

  render() {
    const columns: { width: number; label: string; dataKey: string; }[] = [];
    json["Grid"]["columns"].forEach((column) => {
      columns.push({
        width: column["width"],
        label: column["label"],
        dataKey: column["order"].toString(),
      });
    });

    //const useStyles = makeStyles({
    //  table: {
    //    minWidth: 650,
    //  },
    //});

    function createData(index: number, time: string, buyAmount: number, sellAmount: number, amount: number, price: number) {
      return { index, time, buyAmount, sellAmount, amount, price };
    }
    
    const rows = [
      createData( 1, '00:00 - 00:15', 455.0, 455.0, 455.0, 49.97),
      createData( 2, '00:15 - 00:30', 180.0, 180.0, 180.0, 46.22),
      createData( 3, '00:30 - 00:45', 109.8, 109.8, 109.8, -4.54),
      createData( 4, '00:45 - 01:00', 960.9, 960.9, 960.9, 22.51),
      createData( 5, '01:00 - 01:15', 680.0, 680.0, 680.0, -0.06),
      createData( 6, '01:15 - 01:30', 948.6, 948.6, 948.6, -2.50),
      createData( 7, '01:30 - 01:45', 270.4, 270.4, 270.4, 58.80),
      createData( 8, '01:45 - 02:00', 375.9, 375.9, 375.9, 79.23),
      createData( 9, '02:00 - 02:15', 918.4, 918.4, 918.4, 32.19),
      createData(10, '02:15 - 02:30', 537.0, 537.0, 537.0, 74.34),
      createData(11, '02:30 - 02:45', 814.4, 814.4, 814.4, 9.86),
      createData(12, '02:45 - 03:00', 980.7, 980.7, 980.7, 39.33),
      createData(13, '03:00 - 03:15', 890.3, 890.3, 890.3, 15.60),
      createData(14, '03:15 - 03:30', 39.8, 39.8, 39.8, -16.39),
      createData(15, '03:30 - 03:45', 370.4, 370.4, 370.4, 68.75),
      createData(16, '03:45 - 04:00', 359.4, 359.4, 359.4, 67.40),
    ];

    //const classes = useStyles();

    return (
      <div>
        <div>id: {json["Grid"]["id"]}</div>
        <div>procName: {json["Grid"]["procName"]}</div>
        <br />

        <div>{json["Grid"]["label"]}</div>
        <br />

        <div>Parametry</div>

        {json["Grid"]["params"].map((param, key) => {
           return (
             <div key={key}>
               <div>{param["label"]}</div>
               <div>{this.renderParam(param["datatype"])}</div>
             </div>
           );
        })}
        <br />

        <div>Tabulka</div>

        <TableContainer component={Paper}>
          <Table /*className={classes.table}*/ aria-label="simple table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#ddebf7' }}>
                {json["Grid"]["columns"].map((column, key) => {
                  return (
                    /*
                    <div>
                      <div>{column["label"]}</div>
                      <div style={{ width: column["width"] }}>{column["datatype"]}</div>
                    </div>
                    */
                    <TableCell key={key} align="right">{column["label"]}</TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.index} style={(row.index-1) % 8 >= 4 ? { backgroundColor: '#ffefd5' } : {}}>
                  <TableCell component="th" scope="row">
                    {row.index}
                  </TableCell>
                  <TableCell align="right">{row.time}</TableCell>
                  <TableCell align="right">{row.buyAmount}</TableCell>
                  <TableCell align="right">{row.sellAmount}</TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default ReportGrid;