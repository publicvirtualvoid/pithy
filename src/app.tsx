import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';
import { Grid, Table, TableHeaderRow, TableRowDetail } from '@devexpress/dx-react-grid-bootstrap4';
import { Tabs, Tab } from 'react-bootstrap';
import { useState } from 'react';
import { Column, RowDetailState } from '@devexpress/dx-react-grid';
import { flatten } from 'flat';
import { defaultColumnSort } from './util';

function App() {
  const [expandedRowIds, setExpandedRowIds] = useState([2, 5] as (string | number)[]);
  const collections = db.tables.map((table) => {
    const rows: Record<string, any>[] = useLiveQuery(async () => (await table.toArray()).map((r) => flatten(r))) ?? [];
    const columns = (rows.length > 0 ? Object.keys(rows[0]).map(k => ({ name: k, title: k })) : [{ name: 'no data', title: 'no data' }]).sort(defaultColumnSort);
    return [
      table.name,
      rows,
      columns
    ] as [string, Record<string, any>[], Column[]];
  });
  return (
    <>
      <Tabs>
        {collections.map(([key, rows, columns]) => {
          return (<Tab key={key} eventKey={key} title={key}>
            <Grid
              rows={rows}
              columns={columns}
            >
              <RowDetailState
                expandedRowIds={expandedRowIds}
                onExpandedRowIdsChange={setExpandedRowIds}
              />
              <Table />
              <TableHeaderRow />
              <TableRowDetail
                contentComponent={() => <div>foo!</div>}
              />
            </Grid>
          </Tab>);
        })}
      </Tabs>
    </>
  );
}

export default App;
