import {DELIMITER_NEWLINE, DELIMITER_TAB} from 'app/indra/utils/const';

export interface CopyClipboardProps {
  copyClipboard: boolean;
  handleClipboardCopy: (data: any[][]) => void;
}

export interface PasteClipboardProps {
  pasteClipboard: boolean;
  handleClipboardPaste: (e: any, data: any, setData: any, property?: string, posY?: number, posX?: number) => void;
}

export interface ClipboardProps extends CopyClipboardProps, PasteClipboardProps {}

export function clipboardCopy(data: any[][]) {
  const newData: any = [];
  data.map((row: any) => {
    let newRow: any = [];
    row.map((cell: any) => {
      if (cell == null || cell !== Object(cell)) {
        // cell is simple type
        newRow.push(cell);
      } else {
        // cell is group type
        Object.keys(cell).map((key: any) => {
          newRow.push(cell[key]);
        });
      }
    });

    newData.push(newRow.join(DELIMITER_TAB));
  });

  const clipboardData = newData.join(DELIMITER_NEWLINE);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(clipboardData);
  } else if (document.queryCommandSupported('copy')) {
    const textField = document.createElement('textarea');
    textField.value = clipboardData;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }
}

export function clipboardPaste(e: any, data: any, setData: any, property?: string, posY?: number, posX?: number) {
  //console.log(data);
  const content = e.clipboardData.getData('Text');
  let filtered: any = [];

  content.split(DELIMITER_NEWLINE).map((line: any, lineKey: any) => {
    if (lineKey !== content.length && line.trim() !== '') {
      let newLine: string[] = [];
      const values = line.split(DELIMITER_TAB);
      values.map((value: any, key: any) => {
        newLine.push(value.trim());
      });
      filtered.push(newLine);
    }
  });

  if (filtered) {
    //console.log(filtered);
    const newData = data.slice();
    const startY = posY || 0;
    const startX = posX || 0;

    filtered.map((line: any, y: any) => {
      // y limit
      if (startY + y >= newData.length) {
        return;
      }

      let x = 0;
      let valueIndex = 0;

      // x limit
      while (startX + x < newData[startY + y].length) {
        let cells: any = newData[startY + y];
        let cell: any = cells[startX + x];

        if (cell == null || cell !== Object(cell)) {
          //console.log("simple type"); // cell is simple type
          if (valueIndex >= line.length) {
            return;
          }
          cells[startX + x] = line[valueIndex++];
        } else {
          //console.log("group type"); // cell is group type
          let keys = Object.keys(cell);

          // start by focused cell
          if (x === 0) {
            let startIndex = 0;
            keys.map((keyValue: any, index: any) => {
              if (keyValue === property) {
                startIndex = index;
                return;
              }
            });
            keys = keys.slice(startIndex);
          }

          keys.map((key: any) => {
            // copyboard limit
            if (valueIndex >= line.length) {
              return;
            }
            cell[key] = line[valueIndex++];
          });
        }

        x += 1;
      }
    });

    setData(newData);
    e.preventDefault();
  }
}
