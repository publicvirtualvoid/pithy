import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';

const columns = [
  { name: 'id', title: 'ID' },
  { name: 'product', title: 'Product' },
  { name: 'owner', title: 'Owner' },
];
const rows = [
  { id: 0, product: 'DevExtreme', owner: 'DevExpress' },
  { id: 1, product: 'DevExtreme Reactive', owner: 'DevExpress' },
];

function App() {
  const transactions = useLiveQuery(() => db.transactions.toArray());
  return (
    <div>
      <h1>Hello world!</h1>

      {transactions?.map((t) => <li key={t.id}>{t.date.toString()}</li>)}
      <div className="card">
        <Grid
          rows={rows}
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
