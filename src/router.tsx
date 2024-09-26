import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserTable from './components/UserTable';
import UserDetail from './components/UserDetail';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<UserTable />} />
      <Route path="/user/:username" element={<UserDetail />} />
    </Routes>
  </Router>
);

export default AppRouter;
