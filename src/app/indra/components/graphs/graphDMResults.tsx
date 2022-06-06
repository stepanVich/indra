import ApexCharts from 'apexcharts';
import {PanelProp} from 'app/indra/components/panels/panelController';
import fetchService from 'app/indra/services/fetch';
import {DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE} from 'app/indra/utils/const';
import moment from 'moment';
import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import ReactApexChart from 'react-apexcharts';
import {useTranslation} from 'react-i18next';

const DELIVERY_DATE = 'deliveryDate';

const COLOR_ORANGE = '#ed7d31';
const COLOR_BLUE = '#4472c4';
const COLOR_GREEN = '#70ad47';
const COLOR_GRAY = '#d9d9d9';
const COLOR_DARK = '#3d3d3d';

//const NAME_PRICE = 'Cena';
//const NAME_PRICE_UNIT = '[Euro]';
//const NAME_QTY = 'Množství';
//const NAME_QTY_UNIT = '[MW]';
//const NAME_BUY = 'Nákup';
//const NAME_SELL = 'Prodej';

const DEFAULT_BAR_WIDTH_PERCENT = 80;

interface DMResult {
  deliveryDate: Date;
  interval: number;
  price: number;
  buyQty: number;
  sellQty: number;
}

export const GraphDMResults: FunctionComponent<PanelProp> = React.memo((props) => {
  const translation: any = useTranslation();
  const {t} = translation;
  const tPrice = t('indra:graph.price');
  const tPriceUnit = t('indra:graph.unit.price');
  const tQuantity = t('indra:graph.quantity');
  const tQuantityUnit = t('indra:graph.unit.quantity');
  const tBuy = t('indra:graph.buy');
  const tSell = t('indra:graph.sell');

  const [date, setDate] = useState<string | undefined>(undefined);
  const [data, setData] = useState<DMResult[] | undefined>(undefined);

  const [series, setSeries] = useState<any>();
  const [options, setOptions] = useState<any>();

  const showAlternativeYAxisPrev = useRef<boolean | undefined>(undefined);

  const handleUpdated = (chartContext: any, config: any) => {
    const showAlternativeYAxis = config.config.series[1].data.length === 0 && config.config.series[2].data.length !== 0;

    if (showAlternativeYAxis !== showAlternativeYAxisPrev.current) {
      const newOptions = {
        yaxis: getOptionsYAxis(showAlternativeYAxis)
      };

      ApexCharts.exec('DMResultsChart', 'updateOptions', newOptions);
      showAlternativeYAxisPrev.current = showAlternativeYAxis;
    }
  };

  const handleZoomed = (chartContext: any, {xaxis, yaxis}: any) => {
    //console.log(chartContext);
    let zoomRatio = 1;
    if (xaxis.min != null && xaxis.max != null) {
      const allIntervalsCount = 96;
      const zoomedIntervalsCount = xaxis.max - xaxis.min + 1;

      if (zoomedIntervalsCount !== allIntervalsCount) {
        zoomRatio = allIntervalsCount / zoomedIntervalsCount;
      }
    }

    const newOptions = {
      plotOptions: getOptionsPlot(DEFAULT_BAR_WIDTH_PERCENT * zoomRatio + '%')
    };

    ApexCharts.exec('DMResultsChart', 'updateOptions', newOptions);
  };

  const handleLegendClick = (chartContext: any, seriesIndex: any, config: any) => {
    const {series} = config.config;

    let visibleSeriesCount = 0;
    series.forEach((serie: any, key: number) => {
      if (key !== seriesIndex && serie.data.length !== 0) {
        visibleSeriesCount += 1;
      }
    });

    if (visibleSeriesCount === 0) {
      series.forEach((serie: any, key: number) => {
        if (key !== seriesIndex) {
          ApexCharts.exec('DMResultsChart', 'toggleSeries', serie.name);
        }
      });
    } else {
      ApexCharts.exec('DMResultsChart', 'toggleSeries', series[seriesIndex].name);
    }
  };

  const formatInterval = (tickItem: number) => {
    const startTime = moment('00:00', 'HH:mm').add(15 * (tickItem - 1), 'minutes');
    const endTime = startTime.clone().add(15, 'minutes');

    return (
      tickItem +
      ' (' +
      startTime.format(t('indra:format.time.hourMinutes')) +
      ' - ' +
      endTime.format(t('indra:format.time.hourMinutes')) +
      ')'
    );
  };

  async function getDMResults(deliveryDate: string) {
    //console.log('Graph - fetch DMResults');

    const json: any = await fetchService.get(
      process.env.REACT_APP_API_URL_INDRA + '/graph/getDMResults/' + deliveryDate
    );

    /*
    let json = [
      {interval: 1, price: 56, buyQty: 765, sellQty: 1132},
      {interval: 2, price: 54, buyQty: 1000, sellQty: 1016},
      {interval: 3, price: 50, buyQty: 869, sellQty: 1046},
      {interval: 4, price: 48, buyQty: 836, sellQty: 950},
      {interval: 5, price: 48, buyQty: 962, sellQty: 1131},
      {interval: 6, price: 40, buyQty: 930, sellQty: 874},
      {interval: 7, price: 47, buyQty: 1108, sellQty: 1038},
      {interval: 8, price: 52, buyQty: 1139, sellQty: 990},
      {interval: 9, price: 43, buyQty: 966, sellQty: 1032},
      {interval: 10, price: 54, buyQty: 723, sellQty: 847},
      {interval: 11, price: 64, buyQty: 708, sellQty: 832},
      {interval: 12, price: 53, buyQty: 1181, sellQty: 882},
      {interval: 13, price: 61, buyQty: 1076, sellQty: 997},
      {interval: 14, price: 68, buyQty: 807, sellQty: 1029},
      {interval: 15, price: 61, buyQty: 1164, sellQty: 1132},
      {interval: 16, price: 60, buyQty: 962, sellQty: 936},
      {interval: 17, price: 54, buyQty: 1169, sellQty: 778},
      {interval: 18, price: 68, buyQty: 1102, sellQty: 797},
      {interval: 19, price: 66, buyQty: 773, sellQty: 900},
      {interval: 20, price: 44, buyQty: 776, sellQty: 1008},
      {interval: 21, price: 45, buyQty: 881, sellQty: 982},
      {interval: 22, price: 44, buyQty: 864, sellQty: 1121},
      {interval: 23, price: 69, buyQty: 1108, sellQty: 922},
      {interval: 24, price: 63, buyQty: 1078, sellQty: 771},
      {interval: 25, price: 45, buyQty: 1007, sellQty: 904},
      {interval: 26, price: 56, buyQty: 744, sellQty: 828},
      {interval: 27, price: 53, buyQty: 862, sellQty: 929},
      {interval: 28, price: 59, buyQty: 1016, sellQty: 948},
      {interval: 29, price: 54, buyQty: 1041, sellQty: 800},
      {interval: 30, price: 43, buyQty: 979, sellQty: 774},
      {interval: 31, price: 49, buyQty: 1006, sellQty: 1094},
      {interval: 32, price: 52, buyQty: 1073, sellQty: 1200},
      {interval: 33, price: 49, buyQty: 1190, sellQty: 725},
      {interval: 34, price: 41, buyQty: 727, sellQty: 791},
      {interval: 35, price: 54, buyQty: 892, sellQty: 1011},
      {interval: 36, price: 44, buyQty: 778, sellQty: 730},
      {interval: 37, price: 51, buyQty: 739, sellQty: 1139},
      {interval: 38, price: 61, buyQty: 895, sellQty: 890},
      {interval: 39, price: 56, buyQty: 1198, sellQty: 863},
      {interval: 40, price: 43, buyQty: 729, sellQty: 860},
      {interval: 41, price: 54, buyQty: 947, sellQty: 943},
      {interval: 42, price: 53, buyQty: 1160, sellQty: 725},
      {interval: 43, price: 42, buyQty: 1123, sellQty: 974},
      {interval: 44, price: 55, buyQty: 825, sellQty: 930},
      {interval: 45, price: 44, buyQty: 1086, sellQty: 887},
      {interval: 46, price: 70, buyQty: 883, sellQty: 854},
      {interval: 47, price: 43, buyQty: 827, sellQty: 877},
      {interval: 48, price: 53, buyQty: 717, sellQty: 758}
    ];
    */

    let priceData: number[] = [];
    let buyQtyData: number[] = [];
    let sellQtyData: number[] = [];
    json.forEach((result: DMResult) => {
      priceData.push(result.price);
      buyQtyData.push(result.buyQty);
      sellQtyData.push(result.sellQty);
    });

    setSeries([
      {
        name: tPrice,
        type: 'line',
        data: priceData
      },
      {
        name: tBuy,
        type: 'column',
        data: buyQtyData
      },
      {
        name: tSell,
        type: 'column',
        data: sellQtyData
      }
    ]);

    refreshOptions();

    return json;
  }

  const getOptionsPlot = (columnWidth: any) => {
    //console.log('columnWidth: ' + columnWidth);
    return {
      bar: {
        columnWidth: columnWidth
      }
    };
  };

  const getOptionsYAxis = (showAlternativeYAxis: boolean) => {
    return [
      {
        seriesName: tPrice,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: COLOR_DARK
        },
        labels: {
          style: {
            fontSize: DEFAULT_FONT_SIZE,
            colors: COLOR_DARK
          }
        },
        title: {
          text: tPrice + ' ' + tPriceUnit,
          style: {
            fontSize: DEFAULT_FONT_SIZE,
            color: COLOR_DARK
          }
        },
        tooltip: {
          enabled: true
        }
      },
      {
        seriesName: tBuy,
        opposite: true,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: COLOR_DARK
        },
        labels: {
          style: {
            fontSize: DEFAULT_FONT_SIZE,
            colors: COLOR_DARK
          }
        },
        title: {
          text: tQuantity + ' ' + tQuantityUnit,
          style: {
            fontSize: DEFAULT_FONT_SIZE,
            color: COLOR_DARK
          }
        }
      },
      {
        seriesName: tBuy,
        show: showAlternativeYAxis,
        opposite: true,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: COLOR_DARK
        },
        labels: {
          style: {
            fontSize: DEFAULT_FONT_SIZE,
            colors: COLOR_DARK
          }
        },
        title: {
          text: tQuantity + ' ' + tQuantityUnit,
          style: {
            fontSize: DEFAULT_FONT_SIZE,
            color: COLOR_DARK
          }
        }
      }
    ];
  };

  const refreshOptions = () => {
    setOptions({
      chart: {
        id: 'DMResultsChart',
        width: '100%',
        height: '100%',
        type: 'line',
        stacked: false,
        fontFamily: DEFAULT_FONT_FAMILY,
        animations: {
          enabled: false
        },
        zoom: {
          enabled: true,
          type: 'xy',
          autoScaleYaxis: false,
          zoomedArea: {
            fill: {
              color: COLOR_ORANGE,
              opacity: 0.25
            },
            stroke: {
              color: COLOR_ORANGE,
              opacity: 0.5,
              width: 1
            }
          }
        },
        toolbar: {
          show: true
        },
        events: {
          //updated: handleUpdated,
          //zoomed: handleZoomed,
          legendClick: handleLegendClick
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: [COLOR_ORANGE, COLOR_BLUE, COLOR_GREEN],
      stroke: {
        width: [4, 0, 0]
      },
      plotOptions: getOptionsPlot(DEFAULT_BAR_WIDTH_PERCENT + '%'),
      fill: {
        opacity: [1, 0.75, 0.75]
      },
      xaxis: {
        type: 'category',
        tickAmount: 24,
        labels: {
          rotate: 0,
          hideOverlappingLabels: true
        }
      },
      yaxis: getOptionsYAxis(false),
      grid: {
        show: true,
        borderColor: COLOR_GRAY,
        position: 'back',
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 10,
          left: 6,
          bottom: 10,
          right: 11
        }
      },
      tooltip: {
        enabled: true,
        followCursor: true,
        x: {
          show: true,
          formatter: formatInterval
        },
        y: {
          show: true
        },
        fixed: {
          enabled: false
        }
      },
      legend: {
        show: true,
        horizontalAlign: 'center',
        offsetY: -5,
        onItemClick: {
          toggleDataSeries: false
        }
      }
    });
  };

  useEffect(() => {
    if (props.communication) {
      props.communication.forEach((com: any) => {
        com.data.forEach((data: any) => {
          if (data.key === DELIVERY_DATE) {
            setDate(data.value);
            setData(undefined);
            return;
          }
        });
      });
    }
  }, [props.communication]);

  useEffect(() => {
    if (date) {
      const fetchDataAsync = async () => {
        setData(await getDMResults('2020-08-30')); // TODO: replace with "date"
      };
      fetchDataAsync();
    }
  }, [date, translation.i18n.language]);

  if (date === undefined) {
    //console.log('Graph - GraphDMResults date undefined');
    return null;
  }

  if (data === undefined) {
    //console.log('Graph - GraphDMResults loading');
    return <div>{t('indra:graph.loading')}</div>;
  }
  //console.log('Graph - GraphDMResults render');

  return (
    <div style={{flex: 1, width: '100%', height: '100%', minHeight: 250, boxSizing: 'border-box', overflow: 'hidden'}}>
      <ReactApexChart options={options} series={series} type="line" height="100%" />
    </div>
  );
});
