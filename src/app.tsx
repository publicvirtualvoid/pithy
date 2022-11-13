import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';
import { Column } from '@devexpress/dx-react-grid';

const columns: Column[] = [
  { name: 'id', title: 'ID' },
  { name: 'name', title: 'Name' },
  { name: 'code', title: 'Code' },
  { name: 'symbol', title: 'Symbol' },
];

function App() {
  const transactions = useLiveQuery(() => db.assetTypes.toArray()) ?? [];
  return (
    <div>
      <div className="card">
        <Grid
          rows={transactions}
          columns={columns}
        >
          <Table />
          <TableHeaderRow />
        </Grid>
      </div>
    </div>
  );
}

export default App;
