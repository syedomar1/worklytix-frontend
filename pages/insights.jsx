import Navbar from "@/components/Navbar";
import Insights from "@/components/Insights";
import withAuthentication from "@/firebase/withAuthenticator";

function InsightsPage() {
  return (
    <>
      <Navbar />
      <Insights />
    </>
  );
}

export default InsightsPage;
