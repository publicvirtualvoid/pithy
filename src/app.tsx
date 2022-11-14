import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';
import { Column } from '@devexpress/dx-react-grid';
import { Tabs, Tab } from 'react-bootstrap';

const columns: Column[] = [
  { name: 'id', title: 'ID' },
  { name: 'name', title: 'Name' },
  { name: 'code', title: 'ISO Code' },
  { name: 'symbol', title: 'Symbol' },
];

function App() {
  return (
    <>
      <Tabs>
        {(db as any)._storeNames.map((key: string) => {
          const rows = useLiveQuery(() => ((db as any)[key] as any).toArray()) ?? [];
          return (<Tab key={key} eventKey={key} title={key}>
            <Grid
              rows={rows}
              columns={columns}
            >
              <Table />
              <TableHeaderRow />
            </Grid>
          </Tab>);
        })}
      </Tabs>
    </>
  );
}

export default App;
