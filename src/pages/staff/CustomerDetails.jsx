import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function CustomerDetails({ id }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`/customers/${id}`).then(res => setData(res.data));
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>{data.name}</h2>

      <h3>Vehicles</h3>
      {data.vehicles?.map(v => (
        <p key={v.id}>{v.vehicleNumber}</p>
      ))}

      <h3>Invoices</h3>
      {data.invoices?.map(i => (
        <p key={i.id}>Total: {i.totalAmount}</p>
      ))}
    </div>
  );
}