import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './footer';
import { socialMedia } from '../socialmediaDetails';

const Layout = () => {
  return (
    <div>
      <Header />
      
      <div className="content">
      
        <Outlet />
      </div>
      <Footer objects={socialMedia}/>
    </div>
  );
};

export default Layout;
