import { Routes, Route } from 'react-router-dom';
import Home from './routes/home/Home';
import About from './routes/About';
import FoundingStory from './routes/Founding_story_and_team';
import Services from './routes/Services';
import AbiSearch from './routes/AbiSearch';
import DcQrScanner from './routes/DcQrScanner';
import Vas from './routes/Vas';
import UserCentricApproach from './routes/UserCentricApproach';
import HowToUse from './routes/HowToUse';
import StartupMission from './routes/StartupMission';
import InnovationAndTechnology from './routes/Innovation_and_technology';
import MarketDifferentiation from './routes/Market_differentiation';
import Contactus from './routes/Contactus';
import TermsOfService from './routes/TermsOfService';
import PrivacyPolicy from './routes/PrivacyPolicy';
import Layout from './components/Layout'
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  return (
    <>
      <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="founding_story_and_team" element={<FoundingStory />} />
          <Route path="services" element={<Services />} />
          <Route path="abi" element={<AbiSearch />} />
          <Route path="dcqr" element={<DcQrScanner />} />
          <Route path="vas" element={<Vas />} />
          <Route path="user_centric_approach" element={<UserCentricApproach />} />
          <Route path="How_to_use" element={<HowToUse />} />
          <Route path="startup_mission" element={<StartupMission />} />
          <Route path="innovation_and_technology" element={<InnovationAndTechnology />} />
          <Route path="market_differentiation" element={<MarketDifferentiation />} />
          <Route path="contact_us" element={<Contactus />} />
          <Route path="terms_of_service" element={<TermsOfService />} />
          <Route path="privacy_policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<p>Not found!</p>} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
