import React, { FunctionComponent, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";

interface PaginatorProps {
  perPage: number;
  pageRange: number;
  currentPage: number;
  rowCount: number;
  filteredRowCount: number;
  selectedRowCount: number;
  onPageChange: (index: number | undefined) => void;
}

const Paginator: FunctionComponent<PaginatorProps> = React.memo(
  (props: PaginatorProps) => {
    useEffect(() => {
      handleRowsScroll();
    }, [props.currentPage]);

    const pageCount = Math.ceil(props.filteredRowCount / props.perPage);
    const firstPage = 1;
    const lastPage = pageCount;

    const [currentPage, setCurrentPage] = useState<number>(firstPage);
    const [scrollToIndex, setScrollToIndex] = useState<number | undefined>(
      undefined
    );

    //setCurrentPage(Math.ceil(props.stopIndex / props.perPage));

    const handleRowsScroll = (/*stopIndex: number*/) => {
      console.log("handleRowsScroll");
      setCurrentPage(
        props.currentPage /*Math.ceil(stopIndex / props.perPage)*/
      );
      setScrollToIndex(undefined);
    };

    const handlePageChange = (page: number) => {
      const index: number = (page - 1) * props.perPage;

      setScrollToIndex(index);
      props.onPageChange(index);
    };

    const array: number[] = [];
    for (let i = 0; i < props.pageRange * 2 + 1; i++) {
      array.push(i);
    }
    const renderedPages = array
      .map((i) => currentPage - props.pageRange + i)
      .filter((i) => i > 0 && i <= pageCount);

    const showStart = currentPage - props.pageRange > firstPage;
    const showEnd = currentPage + props.pageRange < lastPage;

    const showStartBetween = currentPage - props.pageRange != firstPage + 1;
    const showEndBetween = currentPage + props.pageRange != lastPage - 1;

    const PageButton = (props: any) => {
      return <Button {...props}>{props.children}</Button>;
    };

    const PseudoButton = (props: any) => {
      if (!props.show) {
        return null;
      }

      return (
        <PageButton
          style={{ ...buttonStyle, ...{ cursor: "default" }, ...props.style }}
        >
          {props.children}
        </PageButton>
      );
    };

    return (
      <div style={{ paddingBottom: 20 }}>
        {showStart && [
          <PageButton
            key={firstPage}
            onClick={() => handlePageChange(firstPage)}
            style={{
              ...buttonStyle,
              ...{
                backgroundColor:
                  currentPage === firstPage ? "#66cdaa" : "#b2e6d4",
              },
            }}
          >
            {firstPage}
          </PageButton>,
          <PseudoButton show={showStartBetween}>...</PseudoButton>,
        ]}
        {renderedPages.map((page) => (
          <PageButton
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              ...buttonStyle,
              ...{
                backgroundColor: currentPage === page ? "#66cdaa" : "#b2e6d4",
              },
            }}
          >
            {page}
          </PageButton>
        ))}
        {showEnd && [
          <PseudoButton show={showEndBetween}>...</PseudoButton>,
          <PageButton
            key={lastPage}
            onClick={() => handlePageChange(lastPage)}
            style={{
              ...buttonStyle,
              ...{
                backgroundColor:
                  currentPage === lastPage ? "#66cdaa" : "#b2e6d4",
              },
            }}
          >
            {lastPage}
          </PageButton>,
        ]}
        <PseudoButton
          show={true}
          style={{
            marginRight: 0,
            paddingLeft: 16,
            paddingRight: 16,
            float: "right",
            marginBottom: 20,
          }}
        >
          {(props.rowCount - props.filteredRowCount === 0
            ? "Zobrazeno záznamů: " + props.rowCount
            : "Celkem záznamů: " +
              props.rowCount +
              ", zobrazeno: " +
              props.filteredRowCount) +
            (props.selectedRowCount > 0
              ? ", vybráno: " + props.selectedRowCount
              : "")}
        </PseudoButton>
      </div>
    );
  }
);

const buttonStyle = {
  fontSize: 10,
  fontWeight: "bold",
  minWidth: 30,
  padding: 5,
  marginRight: 10,
  backgroundColor: "#eaeaea",
};

export default Paginator;
