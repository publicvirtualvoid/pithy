import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';

function App() {
  const transactions = useLiveQuery(() => db.transactions.toArray());
  return (
    <div>
      <h1>Hello world!</h1>
      {transactions?.map((t) => <li key={t.id}>{t.date.toString()}</li>)}
    </div>
  );
}

export default App;
