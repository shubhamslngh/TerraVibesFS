import { getPackages } from "../services/api";
import EventCard from "../components/Events/EventCard";
import TextGenerateEffect from "@/components/ui/TextGenerateEffect";
export default function Home() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    getPackages().then((res) => setPackages(res.data));
  }, []);
  const words = `Oxygen gets you high. In a catastrophic emergency, we're taking giant, panicked breaths. Suddenly you become euphoric, docile. You accept your fate. It's all right here. Emergency water landing, six hundred miles an hour. Blank faces, calm as Hindu cows
`;
  return (
    <div className="container mx-auto bg-red-500 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Curated Event Experiences</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <EventCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}
