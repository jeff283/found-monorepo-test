export const dynamic = "force-dynamic"; 

import { getAgents } from "@/server/actions/institution/query-agents";
import { getMembers } from "@/server/actions/institution/query-members";
import { getLocations } from "@/server/actions/institution/query-locations";

const TestPage = async () => {
  const agents = await getAgents();
  const members = await getMembers();
  const locations = await getLocations();

  const obj = JSON.stringify({ agents, members, locations }, null, 2);
  console.log("Agents:", agents);
  console.log("Members: ", members)
  console.log("Locations:", locations);
  console.log("Object: ",obj)
  return (
    <div className="min-h-screen flex items-center justify-center mx-8">
      <div>
        <pre>{obj}</pre>
      </div>
    </div>
  );
};

export default TestPage;
