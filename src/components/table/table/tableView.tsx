import { FC, useMemo } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useDomainCache } from '../../../lib/useDomainCache';
import { Column, useTable, useGlobalFilter, useFilters } from 'react-table';
import TableImage from './table-image';
import SearchTable from './searchTable';
import marketimg from '../css/img/chart.svg';
import Grid from './grid-view';
import './css/subdomains.scss';
import Image from '../mockup/image';
import graph1 from './img/mockgraphs/graph1.png';
import graph2 from './img/mockgraphs/graph2.png';
import graph3 from './img/mockgraphs/graph3.png';
import graph4 from './img/mockgraphs/graph4.png';
import graph5 from './img/mockgraphs/graph5.png';

interface Data {
  '#': string;
  asset: any;
  name: string;
  '24Hr': any;
  '7d': any;
  marketcap: string;
  volume: string;
  supply: string;
  last7days: any;
  timestamp: any;
  trade: any;
}

interface TProps {
  domain: string;
  gridView: boolean;
  search: string;
}

const TableView: FC<TProps> = ({ domain: _domain, gridView, search }) => {
  // const context = useWeb3React<Web3Provider>();
  // const { account } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { name } = domainContext;
  const history = useHistory();

  //
  // Following functions generate random numbers to display mock data in the UI
  //

  const randThreeS = () => {
    let temp =
      Math.random() > 0.5
        ? Math.floor(Math.random() * 1000).toString()
        : Math.floor(Math.random() * 100).toString();
    if (temp === '0') {
      temp = '10';
    }
    return temp;
  };

  const randThree = () => {
    let temp = Math.floor(Math.random() * 1000).toString();
    if (temp.length === 1) {
      temp = '00' + temp;
    }
    if (temp.length === 2) {
      temp = '0' + temp;
    }
    return temp;
  };

  const randVol = () => {
    let temp =
      (Math.floor(Math.random() * 99) + 1).toString() +
      ',' +
      randThree() +
      ',' +
      randThree();
    return temp;
  };

  const randPrice = () => {
    let temp = Math.floor(Math.random() * 100).toString();
    let dot = Math.floor(Math.random() * 100).toString();
    if (dot.length === 1) {
      dot = '0' + dot;
    }
    let up = Math.random() > 0.3;
    let price = `${up ? '▲' : '▼'} ${temp}.${dot}%`;
    return (
      <div style={{ color: `${up ? '#27AE60' : '#EB5757'}` }}>{price}</div>
    );
  };

  const randTrade = () => {
    let digits = Math.random() > 0.5;
    let temp;
    digits
      ? (temp =
          (Math.floor(Math.random() * 2) + 1).toString() + ',' + randThree())
      : (temp = randThreeS());
    let dec = Math.floor(Math.random() * 100).toString();
    if (dec.length === 1) {
      dec = '0' + dec;
    }
    return '$' + temp + '.' + dec;
  };

  const randGraph = () => {
    let temp = Math.floor(Math.random() * 10);
    if (temp === 0 || temp === 1) {
      return graph1;
    } else if (temp === 2 || temp === 3) {
      return graph2;
    } else if (temp === 4 || temp === 5) {
      return graph3;
    } else if (temp === 6 || temp === 7) {
      return graph4;
    } else if (temp === 8 || temp === 9) {
      return graph5;
    } else return graph5;
  };

  //
  //
  //

  const dataInput: Data[] = useMemo(
    () =>
      name.isNothing()
        ? []
        : _.map(name.value.name, (key, i) => ({
            key: key,
            '#': i.toString(),
            // asset: <Profile domain={key} />,
            asset: <TableImage domain={key} />,
            name: key,
            '24Hr': randPrice(),
            '7d': randPrice(),
            marketcap: `$${randThreeS()},${randThree()},${randThree()}`,
            volume: '$' + randVol(),
            supply: `${randThreeS()},${randThree()},${randThree()} TICK`,
            last7days: <img src={randGraph()} alt="" />,
            timestamp: '',
            trade: <button className="tradeButton">{randTrade()}</button>,
          })),

    [name],
  );

  console.log(dataInput, 'THIS List');
  const data = useMemo<Data[]>(() => dataInput, [dataInput]);

  const columns = useMemo<Column<Data>[]>(
    () => [
      {
        Header: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '60px',
              height: '40px',
            }}
          >
            #
          </div>
        ),
        accessor: '#',
      },
      {
        Header: '',
        accessor: 'asset',
      },
      {
        Header: 'Name',
        accessor: 'name',
        width: '100%',
      },
      { Header: '24Hr', accessor: '24Hr' },
      { Header: '7d', accessor: '7d' },
      {
        Header: (
          <div className="infoHeader">
            <span>Market Cap </span>
            <span className="infoButton">
              <span className="infoMark">?</span>
            </span>
          </div>
        ),
        accessor: 'marketcap',
      },
      {
        Header: (
          <div className="infoHeader">
            <span>Volume </span>
            <span className="infoButton">
              <span className="infoMark">?</span>
            </span>
          </div>
        ),
        accessor: 'volume',
      },
      {
        Header: (
          <div className="infoHeader">
            <span>Supply </span>
            <span className="infoButton">
              <span className="infoMark">?</span>
            </span>
          </div>
        ),
        accessor: 'supply',
      },

      {
        Header: 'Last 7 Days',
        accessor: 'last7days',
      },
      {
        Header: '',
        accessor: 'timestamp',
        width: '0px',
        Cell: () => <div style={{ display: 'none' }}></div>,
      },
      {
        Header: (
          <div className="infoHeader">
            <span>Trade </span>
            <span className="infoButton">
              <span className="infoMark">?</span>
            </span>
          </div>
        ),
        accessor: 'trade',
      },
    ],
    [],
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      // defaultColumn,
      // initialState: {
      //   hiddenColumns: ['timestamp'],
      // },
    },
    useFilters,
    useGlobalFilter,
    // useAbsoluteLayout,
  );

  const handleRowClick = (row: any) => {
    //console.log('fire');
    //console.log(row);
    history.push({
      pathname: row.original.key,
    });
  };

  if (name.isNothing()) return null;

  //console.log(domain.value.children, 'xxxxxxxxxxxxxxxxx');
  return (
    <div className="shiftTableUp">
      <SearchTable globalFilter={search} setGlobalFilter={setGlobalFilter} />

      <div className="removeTopShadow">
        {!gridView ? (
          <div className="tableContainer">
            <table {...getTableProps()} className="subdomainsTable">
              {rows.length === 0 ? null : (
                <thead className="subdomainsHeaderGroupLocal">
                  {
                    // Loop over the header rows
                    headerGroups.map((headerGroup) => (
                      // Apply the header row props
                      <tr
                        className="subdomainsHeaderTR"
                        {...headerGroup.getHeaderGroupProps()}
                      >
                        {
                          // Loop over the headers in each row
                          headerGroup.headers.map((column) => (
                            // Apply the header cell props
                            <th
                              className="subdomainsHeaderTH"
                              {...column.getHeaderProps()}
                            >
                              {
                                // Render the header
                                column.render('Header')
                              }
                            </th>
                          ))
                        }
                      </tr>
                    ))
                  }
                </thead>
              )}
              {/* Apply the table body props */}
              <tbody {...getTableBodyProps()}>
                {/*console.log('ROWS', rows)*/}

                {
                  // Loop over the table rows
                  rows.map((row) => {
                    // Prepare the row for display
                    prepareRow(row);
                    return (
                      // Apply the row props
                      <tr
                        onClick={() => handleRowClick(row)}
                        {...row.getRowProps()}
                      >
                        {
                          // Loop over the rows cells
                          row.cells.map((cell) => {
                            // Apply the cell props
                            return (
                              <td className="tdLocal" {...cell.getCellProps()}>
                                {
                                  // Render the cell contents
                                  cell.render('Cell')
                                }
                              </td>
                            );
                          })
                        }
                      </tr>
                    );
                  })
                }
              </tbody>
              {rows.length !== 0 ? null : (
                <tfoot>
                  <tr>
                    <td
                      style={{
                        borderLeft: '1px solid #bd5fff',
                        borderRight: '1px solid #bd5fff',
                        borderBottom: '1px solid #bd5fff',
                        borderRadius: '0px 0px 15px 15px',
                      }}
                    >
                      <div
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          marginBottom: '20px',
                        }}
                      >
                        No domains to view
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        ) : (
          <Grid domain={_domain} />
        )}

        <br />
        <br />
        {/* {colors.map((color) => {
        return (
          <div
            style={{
              background: '#' + color,
              height: '40px',
              width: '80%',
              textAlign: 'right',
            }}
          >
            {color}
          </div>
        );
      })} */}
      </div>
    </div>
  );
};

export default TableView;
