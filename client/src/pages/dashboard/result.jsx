import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PredictionDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPrediction = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/records/${id}`);
        if (!res.ok) throw new Error("Failed to fetch prediction");
        const data = await res.json();
        setPrediction(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!prediction) return <p>No prediction found.</p>;

  return (
    <div>
      <h1>Prediction Details for {id}</h1>
      {/* Show detailed data here */}
      <pre>{JSON.stringify(prediction, null, 2)}</pre>
    </div>
  );
}
