import React, { FunctionComponent, useState, useEffect } from "react";
import { InputProps } from "@material-ui/core";
import fetchService from "../../../services/fetch";
import { VirtualizedTableExtended } from "./VirtualizedTableExtended";
import { ColumnData, SELECT_MAX_ROWS_NONE } from "./VirtualizedTable";

interface ReportGridVirtualizedProps extends InputProps {
  gridId: number;
}

async function getGridDefinition(gridId: number) {
  const json: any = await fetchService.get(
    process.env.REACT_APP_API_URL_INDRA + "/grid/getGrid/" + gridId
  );

  return json;
}

const getGridData = () => {
  return [
    ["star_outline", 1, "00:00 - 00:15", 455.0, 455.0, 455.0, 49.97, true],
    ["star", 2, "00:15 - 00:30", 180.0, 180.0, 180.0, 46.22, true],
    ["star", 3, "00:30 - 00:45", 109.8, 109.8, 109.8, -4.54, false],
    ["star_outline", 4, "00:45 - 01:00", 960.9, 960.9, 960.9, 22.51, false],
    ["star_outline", 5, "01:00 - 01:15", 680.0, 680.0, 680.0, -0.06, false],
    ["star", 6, "01:15 - 01:30", 948.6, 948.6, 948.6, -2.5, true],
    ["star_outline", 7, "01:30 - 01:45", 270.4, 270.4, 270.4, 58.8, false],
    ["star_outline", 8, "01:45 - 02:00", 375.9, 375.9, 375.9, 79.23, false],
    ["star_outline", 9, "02:00 - 02:15", 918.4, 918.4, 918.4, 32.19, true],
    ["star", 10, "02:15 - 02:30", 537.0, 537.0, 537.0, 74.34, false],
    ["star", 11, "02:30 - 02:45", 814.4, 814.4, 814.4, 9.86, false],
    ["star_outline", 12, "02:45 - 03:00", 980.7, 980.7, 980.7, 39.33, true],
    ["star_outline", 13, "03:00 - 03:15", 890.3, 890.3, 890.3, 15.6, true],
    ["star", 14, "03:15 - 03:30", 39.8, 39.8, 39.8, -16.39, false],
    ["star_outline", 15, "03:30 - 03:45", 370.4, 370.4, 370.4, 68.75, true],
    ["star_outline", 16, "03:45 - 04:00", 359.4, 359.4, 359.4, 67.4, false],

    ["star_outline", 17, "00:00 - 00:15", 455.0, 455.0, 455.0, 49.97, true],
    ["star", 18, "00:15 - 00:30", 180.0, 180.0, 180.0, 46.22, true],
    ["star", 19, "00:30 - 00:45", 109.8, 109.8, 109.8, -4.54, false],
    ["star_outline", 20, "00:45 - 01:00", 960.9, 960.9, 960.9, 22.51, false],
    ["star_outline", 21, "01:00 - 01:15", 680.0, 680.0, 680.0, -0.06, false],
    ["star", 22, "01:15 - 01:30", 948.6, 948.6, 948.6, -2.5, true],
    ["star_outline", 23, "01:30 - 01:45", 270.4, 270.4, 270.4, 58.8, false],
    ["star_outline", 24, "01:45 - 02:00", 375.9, 375.9, 375.9, 79.23, false],
    ["star_outline", 25, "02:00 - 02:15", 918.4, 918.4, 918.4, 32.19, true],
    ["star", 26, "02:15 - 02:30", 537.0, 537.0, 537.0, 74.34, false],
    ["star", 27, "02:30 - 02:45", 814.4, 814.4, 814.4, 9.86, false],
    ["star_outline", 28, "02:45 - 03:00", 980.7, 980.7, 980.7, 39.33, true],
    ["star_outline", 29, "03:00 - 03:15", 890.3, 890.3, 890.3, 15.6, true],
    ["star", 30, "03:15 - 03:30", 39.8, 39.8, 39.8, -16.39, false],
    ["star_outline", 31, "03:30 - 03:45", 370.4, 370.4, 370.4, 68.75, true],
    ["star_outline", 32, "03:45 - 04:00", 359.4, 359.4, 359.4, 67.4, false],

    ["star_outline", 33, "00:00 - 00:15", 455.0, 455.0, 455.0, 49.97, true],
    ["star", 34, "00:15 - 00:30", 180.0, 180.0, 180.0, 46.22, true],
    ["star", 35, "00:30 - 00:45", 109.8, 109.8, 109.8, -4.54, false],
    ["star_outline", 36, "00:45 - 01:00", 960.9, 960.9, 960.9, 22.51, false],
    ["star_outline", 37, "01:00 - 01:15", 680.0, 680.0, 680.0, -0.06, false],
    ["star", 38, "01:15 - 01:30", 948.6, 948.6, 948.6, -2.5, true],
    ["star_outline", 39, "01:30 - 01:45", 270.4, 270.4, 270.4, 58.8, false],
    ["star_outline", 40, "01:45 - 02:00", 375.9, 375.9, 375.9, 79.23, false],
    ["star_outline", 41, "02:00 - 02:15", 918.4, 918.4, 918.4, 32.19, true],
    ["star", 42, "02:15 - 02:30", 537.0, 537.0, 537.0, 74.34, false],
    ["star", 43, "02:30 - 02:45", 814.4, 814.4, 814.4, 9.86, false],
    ["star_outline", 44, "02:45 - 03:00", 980.7, 980.7, 980.7, 39.33, true],
    ["star_outline", 45, "03:00 - 03:15", 890.3, 890.3, 890.3, 15.6, true],
    ["star", 46, "03:15 - 03:30", 39.8, 39.8, 39.8, -16.39, false],
    ["star_outline", 47, "03:30 - 03:45", 370.4, 370.4, 370.4, 68.75, true],
    ["star_outline", 48, "03:45 - 04:00", 359.4, 359.4, 359.4, 67.4, false],

    ["star_outline", 49, "00:00 - 00:15", 455.0, 455.0, 455.0, 49.97, true],
    ["star", 50, "00:15 - 00:30", 180.0, 180.0, 180.0, 46.22, true],
    ["star", 51, "00:30 - 00:45", 109.8, 109.8, 109.8, -4.54, false],
    ["star_outline", 52, "00:45 - 01:00", 960.9, 960.9, 960.9, 22.51, false],
    ["star_outline", 53, "01:00 - 01:15", 680.0, 680.0, 680.0, -0.06, false],
    ["star", 54, "01:15 - 01:30", 948.6, 948.6, 948.6, -2.5, true],
    ["star_outline", 55, "01:30 - 01:45", 270.4, 270.4, 270.4, 58.8, false],
    ["star_outline", 56, "01:45 - 02:00", 375.9, 375.9, 375.9, 79.23, false],
    ["star_outline", 57, "02:00 - 02:15", 918.4, 918.4, 918.4, 32.19, true],
    ["star", 58, "02:15 - 02:30", 537.0, 537.0, 537.0, 74.34, false],
    ["star", 59, "02:30 - 02:45", 814.4, 814.4, 814.4, 9.86, false],
    ["star_outline", 60, "02:45 - 03:00", 980.7, 980.7, 980.7, 39.33, true],
    ["star_outline", 61, "03:00 - 03:15", 890.3, 890.3, 890.3, 15.6, true],
    ["star", 62, "03:15 - 03:30", 39.8, 39.8, 39.8, -16.39, false],
    ["star_outline", 63, "03:30 - 03:45", 370.4, 370.4, 370.4, 68.75, true],
    ["star_outline", 64, "03:45 - 04:00", 359.4, 359.4, 359.4, 67.4, false],
  ];
};

const ReportGridVirtualized: FunctionComponent<ReportGridVirtualizedProps> = React.memo(
  (props) => {
    console.log("VirtualizedGrid rerendered");

    const [grid, setGrid] = useState<any>({});
    const [data, setData] = useState<any>(getGridData());

    let params: any[] =
      Object.entries(grid).length === 0 && grid.constructor === Object
        ? []
        : JSON.parse(grid.params);
    let columns: any[] =
      Object.entries(grid).length === 0 && grid.constructor === Object
        ? []
        : JSON.parse(grid.columns);
    const rowSelection: number =
      Object.entries(grid).length === 0 && grid.constructor === Object
        ? SELECT_MAX_ROWS_NONE
        : JSON.parse(grid.definition).Grid.rowSelection;

    const tableColumns: ColumnData[] = [];
    columns.forEach((column: any) => {
      tableColumns.push({
        dataKey: column["order"].toString(),
        label: column["labelCode"],
        width: column["width"],
        datatype: column["datatype"],
      });
    });

    useEffect(() => {
      const fetchDataAsync = async () => {
        setGrid(await getGridDefinition(props.gridId));
        //filterData();
      };
      fetchDataAsync();
    }, []);

    const renderParam = (datatype: string) => {
      switch (datatype.toLowerCase()) {
        case "number":
          return <input type="number" value={""} onChange={() => {}} />;
        case "float":
          return <input type="number" value={""} onChange={() => {}} />;
        case "date":
          return (
            <input
              type="date"
              value={new Date().toISOString().substr(0, 10)}
              onChange={() => {}}
            />
          );
        case "datetime":
          return <input type="datetime" value={""} onChange={() => {}} />;
        case "boolean":
          return <input type="checkbox" value={""} onChange={() => {}} />;
        default:
          return <input type="text" value={""} onChange={() => {}} />;
      }
    };

    const getGrid = (tableColumns: ColumnData[]) => {
      if (tableColumns.length === 0) {
        return "Grid se načítá...";
      }

      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 0 }}>
            <h3 style={{ marginTop: 20 }}>Parametry</h3>

            <div
              style={{
                height: 88,
                backgroundColor: "#b2e6d4",
                padding: 16,
                borderRadius: 4,
              }}
            >
              {params.map((param: any, key: any) => {
                return (
                  <div
                    key={key}
                    style={{ height: "100%", display: "inline-block" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderWidth: 0,
                        borderStyle: "solid",
                        borderColor: "#3d3d3d",
                        ...(key !== 0
                          ? {
                              borderLeftWidth: 1,
                              paddingLeft: 16,
                              marginLeft: 16,
                            }
                          : {}),
                      }}
                    >
                      <div>{param["label"]}</div>
                      <div>{renderParam(param["datatype"])}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <br />

            <h3 style={{ marginTop: 20 }}>Tabulka</h3>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflowX: "auto",
              overflowY: "hidden",
            }}
          >
            <VirtualizedTableExtended
              headerHeight={84}
              filterHeight={64}
              rowHeight={48}
              minRows={5}
              columns={tableColumns}
              data={data}
              rowSelection={rowSelection}
            />
          </div>
        </div>
      );
    };

    return (
      <div style={{ width: "100%", height: "100%" }}>
        {getGrid(tableColumns)}
      </div>
    );
  }
);

export default ReportGridVirtualized;
