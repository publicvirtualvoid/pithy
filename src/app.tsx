import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';
import { Grid, Table, TableHeaderRow, TableRowDetail } from '@devexpress/dx-react-grid-bootstrap4';
import { Tabs, Tab } from 'react-bootstrap';
import { useState } from 'react';
import { RowDetailState } from '@devexpress/dx-react-grid';
import { Table as DbTable } from 'dexie';
import { flatten } from 'flat';
import { defaultColumnSort } from './util';

function App() {
  const [expandedRowIds, setExpandedRowIds] = useState([2, 5] as (string | number)[]);
  return (
    <>
      <Tabs>
        {(db as any)._storeNames.map((key: string) => {
          const rows = (useLiveQuery(async () => (await ((db as any)[key] as DbTable<any, number>).toArray()).map((r) => flatten(r))) as any[] ?? []);
          const columns = (rows.length > 0 ? Object.keys(rows[0]).map(k => ({ name: k, title: k })) : [{ name: 'no data', title: 'no data' }]).sort(defaultColumnSort);
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
