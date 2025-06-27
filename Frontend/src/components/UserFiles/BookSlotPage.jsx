import { useParams } from 'react-router-dom';

export default function BookSlotPage() {
  const { stationId } = useParams();

  // You can now fetch station details using stationId
  return <div>Booking slot for Station ID: {stationId}</div>;
}
