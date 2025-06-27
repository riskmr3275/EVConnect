import LiveMap from './LiveMap';
import { useSearchParams } from 'react-router-dom';

function StationDirectionPage() {
    const [searchParams] = useSearchParams();
    const latitude = searchParams.get('lat');
    const longitude = searchParams.get('lng');
  const destination = {
    lat: latitude,  // replace with dynamic lat
    lng: longitude,  // replace with dynamic lng
  };

  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Real-time Route to Station</h2>
      <div className="p-4">
      <h2 className="text-xl font-bold">Book EV Slot</h2>
      <p className="text-gray-700">Latitude: {latitude}</p>
      <p className="text-gray-700">Longitude: {longitude}</p>
    </div>
      {/* <LiveMap destination={destination} /> */}
    </div>
  );
}


export default StationDirectionPage