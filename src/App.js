import Header from './Dashboard/Header/Header';
import logo from './logo.svg';
import Sidebar from './Dashboard/Sidebar/Sidebar';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard';
import ChildrenProfile from './Pages/ChildrenProfile/ChildrenProfile';
import Programs from './Pages/Programs/Programs';
import DashboardSection from './Components/DashboardComponents/DashboardSection';

function App() {
  return (
    <div className="App">
        <Router>
          <Header/>
          <Routes>
            <Route path="/" element={<DashboardSection />}>
              <Route path='dashboard' element = {<Dashboard/>}/>
            <Route path='children-profile' element = {<ChildrenProfile/>}/>
            <Route path='programs' element = {<Programs/>}/>
            </Route>

          </Routes>
        </Router>
    </div>
  );
}

export default App;
