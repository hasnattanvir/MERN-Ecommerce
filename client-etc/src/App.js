import './App.css';
import{BrowserRouter as Router} from 'react-router-dom';
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import Home from './components/Home';
function App() {
  return (
    <Router>
      <div className="App">
      <Header/>
      <div className='container container-fluid'>
      {/* <Routes path='/' component={Home} exact/> */}
      <Home/>
      </div>
      <Footer/>
      
      </div>
    </Router>
  );
}

export default App;
