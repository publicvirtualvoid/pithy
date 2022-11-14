import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';
import { Tabs, Tab } from 'react-bootstrap';

function App() {
  return (
    <>
      <Tabs>
        {(db as any)._storeNames.map((key: string) => {
          const rows = useLiveQuery(() => ((db as any)[key] as any).toArray()) ?? [];
          return (<Tab key={key} eventKey={key} title={key}>
            <Grid
              rows={rows}
              columns={rows.length > 0 ? Object.keys(rows[0]).map(k => ({ name: k, title: k })) : [{ name: 'no data', title: 'no data' }]}
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
