/* eslint-disable react/prop-types */
import React from "react";
/*import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";*/
import EditIcon from "@material-ui/icons/Edit";
import TrashIcon from "@material-ui/icons/Delete";
//import DownArrow from "material-ui/svg-icons/navigation/arrow-drop-down";
//import UpArrow from "material-ui/svg-icons/navigation/arrow-drop-up";
//import TextField from "material-ui/TextField";

import InlineForm from "./InlineForm";
import { TableRow, TableCell, TableHead, Table, TextField, TableBody, Button } from "@material-ui/core";
// import {
// import { TextField } from '@material-ui/core/TextField';
//   Table,
//   TableBody,
//   TableHead,
//   /*TableHeaderColumn,*/
//   TableRow,
//   TableCell
//   /*TableRowColumn*/
// } from '@material-ui/core';

const row = (
  x: { [x: string]: React.ReactNode; },
  i: number,
  header: any[],
  handleRemove: (arg0: any) => void,
  startEditing: (arg0: any) => void,
  editIdx: any,
  handleSave: any,
  stopEditing: any
) => {
  const currentlyEditing = editIdx === i;
  return currentlyEditing ? (
    <TableRow key={`inline-form-${i}`} /*selectable={false}*/>
      <InlineForm
        handleSave={handleSave}
        header={header}
        x={x}
        i={i}
        stopEditing={stopEditing}
      />
    </TableRow>
  ) : (
    <TableRow key={`tr-${i}`} /*selectable={false}*/>
      {header.map((y, k) => (
        <TableCell key={`trc-${k}`}>{x[y.prop]}</TableCell>
      ))}
      <TableCell>
        <EditIcon onClick={() => startEditing(i)} />
        <TrashIcon onClick={() => handleRemove(i)} />
      </TableCell>
    </TableRow>
  );
};


/*function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}*/

/*const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];*/

//const myData = [{"firstName":"Tann","lastName":"Gounin","username":"tgounin0","email":"tgounin0@wordpress.com","passsword":"yJG2MuL5piY"},{"firstName":"Elana","lastName":"Ricioppo","username":"ericioppo1","email":"ericioppo1@timesonline.co.uk","passsword":"S7p9ReUoQe"},{"firstName":"Bentlee","lastName":"Decourt","username":"bdecourt2","email":"bdecourt2@about.me","passsword":"MWU9hc"},{"firstName":"Hyacintha","lastName":"Choudhury","username":"hchoudhury3","email":"hchoudhury3@va.gov","passsword":"kRtWP1"},{"firstName":"Ari","lastName":"Spedroni","username":"aspedroni4","email":"aspedroni4@sun.com","passsword":"o78ibUPPmDlZ"},{"firstName":"Abelard","lastName":"Rodriguez","username":"arodriguez5","email":"arodriguez5@shutterfly.com","passsword":"g2jd4AwfpA"},{"firstName":"Ikey","lastName":"Latek","username":"ilatek6","email":"ilatek6@berkeley.edu","passsword":"GAsgPpKvJx"},{"firstName":"Justis","lastName":"Habbeshaw","username":"jhabbeshaw7","email":"jhabbeshaw7@simplemachines.org","passsword":"GN2aQt3ZPq"},{"firstName":"Maddie","lastName":"Bayne","username":"mbayne8","email":"mbayne8@constantcontact.com","passsword":"H1GmQcyG6"},{"firstName":"Gerrie","lastName":"Rulton","username":"grulton9","email":"grulton9@reverbnation.com","passsword":"tcwp6oONe"}]

//const headerList = ['Header1','Header2']

function MyTable(props: { header: any[]; data: any[]; handleRemove: any; startEditing: any; editIdx: any; handleSave: any; stopEditing: any; setFilter: any }/*data,
  header,
  handleRemove,
  startEditing,
  editIdx,
  handleSave,
  stopEditing,
  handleSort,
  sortDirection,
  columnToSort
*/) {
  //console.log('--------columnToSort: ' + JSON.stringify(props.header));

  // console.log('---------FilterList: ' + value);

  return (
<Table>
  <TableHead>
    
    
          <TableRow >
            {props.header.map((row) => (
             
              <TableCell key={row.props} component="td">{row.name}</TableCell>
              
              ))}
          </TableRow>
          <TableRow>
            <TableCell>
              <TextField
                name="firstName"
                helperText="First name"
                onChange={(e: any) => {
                  props.setFilter('firstName', e.target.value);
                }}
              />
            </TableCell>
            <TableCell>
            <TextField
              name="lastName"
              helperText="Last name"
              onChange={(e: any) => {
                props.setFilter('lastName', e.target.value);
              }}
            />
            </TableCell>
            <TableCell>
            <TextField
              name="username"
              helperText="Username"
              onChange={(e: any) => {
                props.setFilter('username', e.target.value);
              }}
            />
            </TableCell>
            <TableCell>
            <TextField
              name="email"
              helperText="Email"
              onChange={(e: any) => {
                props.setFilter('email', e.target.value);
              }}
            />
            </TableCell>
            <TableCell>
              <Button variant="contained" color="primary" onClick={e => alert('XXX')}>Filter</Button>
            </TableCell>
          </TableRow>
       
      {/*<TableCell>Dessert (100g serving)</TableCell>
      <TableCell align="right">Calories</TableCell>
      <TableCell align="right">Fat&nbsp;(g)</TableCell>
      <TableCell align="right">Carbs&nbsp;(g)</TableCell>
      <TableCell align="right">Protein&nbsp;(g)</TableCell>*/}
    
  </TableHead>

  <TableBody>
      {props.data.map((x, i) =>
        row(
          x,
          i,
          props.header,
          props.handleRemove,
          props.startEditing,
          props.editIdx,
          props.handleSave,
          props.stopEditing
        )
      )}
    </TableBody>

  {/*</TableHead>
    <TableHead>
      <TableRow>
        {header.map((x, i) => (
          row(
            x, i
          )
          return(
          <TableCell>Dessert (100g serving)</TableCell>
          )
        ))}
      </TableRow>
          </TableHead>*/}
    {/*<TableBody>
      {rows.map((row) => (
          <TableRow key={row.name}>
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="right">{row.calories}</TableCell>
            <TableCell align="right">{row.fat}</TableCell>
            <TableCell align="right">{row.carbs}</TableCell>
            <TableCell align="right">{row.protein}</TableCell>
          </TableRow>
        ))}
      </TableBody>*/}
  </Table>)
}

export default MyTable; /*({
  data,
  header,
  handleRemove,
  startEditing,
  editIdx,
  handleSave,
  stopEditing,
  handleSort,
  sortDirection,
  columnToSort
}) => (
  <Table>
    <TableHead>
      <TableRow>
        {header.map((x, i) => (
          <TableCell>Dessert (100g serving)</TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((x, i) =>
        row(
          x,
          i,
          header,
          handleRemove,
          startEditing,
          editIdx,
          handleSave,
          stopEditing
        )
      )}
    </TableBody>
  </Table>
);*/