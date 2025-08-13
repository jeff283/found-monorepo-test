"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // ⬅️ added
import laxLogo from "@/assets/images/logos/Institution Logos/Los Angeles International Airport (LAX).jpeg"
import uclaLogo from "@/assets/images/logos/Institution Logos/University of California.png"
import westfieldLogo from "@/assets/images/logos/Institution Logos/Westfield Century City Mall.png"
import jfkLogo from "@/assets/images/logos/Institution Logos/John F. Kennedy International Airport.png"
import harvardLogo from "@/assets/images/logos/Institution Logos/Harvard University.png"
import stanfordLogo from "@/assets/images/logos/Institution Logos/Stanford University.png"
import type { StaticImageData } from "next/image"
import InstitutionSelect from "@/components/report-lost/InstitutionSelect"
import ReportDetailsForm from "@/components/report-lost/ReportDetailsForm"
import FoundMatchesList from "@/components/report-lost/FoundMatchesList"
import SuccessScreen from "@/components/report-lost/SuccessScreen"

interface Institution {
  id: string;
  name: string;
  address: string;
  logo: string | StaticImageData;
}

interface FoundItem {
  itemName: string
  itemNumber: string
  foundAt: string
  date: string
  description: string
  status: string
  matchPercentage: number
}

// async function fetchInstitutions() {
//   const res = await fetch('/api/institutions');
//   if (!res.ok) throw new Error('Failed to fetch institutions');
//   return res.json();
// }

const institutions: Institution[] = [
  { id: "1", name: "Los Angeles International Airport", address: "World Way, Los Angeles, CA", logo: laxLogo },
  {
    id: "2",
    name: "University of California, Los Angeles (UCLA)",
    address: "405 Hilgard Ave, Los Angeles, CA",
    logo: uclaLogo,
  },
  { id: "3", name: "Westfield Century City Mall", address: "10250 Santa Monica Blvd, LA", logo: westfieldLogo },
  { id: "4", name: "John F. Kennedy International Airport", address: "Queens, NY 11430", logo: jfkLogo },
  { id: "5", name: "Harvard University", address: "Cambridge, MA 02138", logo: harvardLogo },
  { id: "6", name: "Stanford University", address: "450 Serra Mall, Stanford, CA 94305", logo: stanfordLogo },
  { id: "7", name: "Massachusetts Institute of Technology (MIT)", address: "77 Massachusetts Ave, Cambridge, MA 02139", logo: "" },
  { id: "8", name: "Yale University", address: "New Haven, CT 06520", logo: "" },
  { id: "9", name: "Princeton University", address: "Princeton, NJ 08544", logo: "" },
  { id: "10", name: "Columbia University", address: "116th St & Broadway, New York, NY 10027", logo: "" },
  { id: "11", name: "University of Chicago", address: "5801 S Ellis Ave, Chicago, IL 60637", logo: "" },
  { id: "12", name: "University of Pennsylvania", address: "Philadelphia, PA 19104", logo: "" },
  { id: "13", name: "California Institute of Technology (Caltech)", address: "1200 E California Blvd, Pasadena, CA 91125", logo: "" },
  { id: "14", name: "Duke University", address: "Durham, NC 27708", logo: "" },
  { id: "15", name: "Johns Hopkins University", address: "Baltimore, MD 21218", logo: "" },
  { id: "16", name: "Northwestern University", address: "633 Clark St, Evanston, IL 60208", logo: "" },
  { id: "17", name: "University of Michigan", address: "500 S State St, Ann Arbor, MI 48109", logo: "" },
  { id: "18", name: "New York University (NYU)", address: "New York, NY 10003", logo: "" },
  { id: "19", name: "University of California, Berkeley", address: "Berkeley, CA 94720", logo: "" },
  { id: "20", name: "Cornell University", address: "Ithaca, NY 14850", logo: "" },
]

const categories = ["Electronics", "Clothing", "Documents", "Jewelry", "Keys", "Bags", "Other"]

// Mock found items data
const initialFoundItems: FoundItem[] = [
// async function fetchFoundItems(reportDetails: {
//   institution: string;
//   itemName: string;
//   category: string;
//   dateLost: string;
//   locationLastSeen: string;
//   location: string;
//   detailedDescription: string;
// }) {
//   const res = await fetch('/api/found-items', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(reportDetails),
//   });
//   if (!res.ok) throw new Error('Failed to fetch found items');
//   return res.json();
// }
  {
    itemName: "MacBook Air (Grey Sleeve)",
    itemNumber: "LA-502",
    foundAt: "Terminal 5, Starbucks",
    date: "June 17, 2025",
    description: "MacBook in grey sleeve, has sticker on front",
    status: "On hold at LAX Lost & Found",
    matchPercentage: 92,
  },
  {
    itemName: "MacBook Pro 13-inch (Space Gray)",
    itemNumber: "LA-503",
    foundAt: "Terminal 3, Security Checkpoint",
    date: "June 16, 2025",
    description: "MacBook Pro 13-inch, space gray, small dent on corner",
    status: "Available for pickup",
    matchPercentage: 87,
  },
  {
    itemName: "Apple Laptop (Black Case)",
    itemNumber: "LA-498",
    foundAt: "Gate 42, Waiting Area",
    date: "June 15, 2025",
    description: "Apple laptop with black case, charging cable attached",
    status: "On hold at LAX Lost & Found",
    matchPercentage: 80,
  },
  {
    itemName: "Silver MacBook (Stickers)",
    itemNumber: "LA-495",
    foundAt: "Baggage Claim Area 4",
    date: "June 14, 2025",
    description: "Silver MacBook with university stickers, slightly used",
    status: "Available for pickup",
    matchPercentage: 75,
  },
  {
    itemName: "HP Laptop (Blue Case)",
    itemNumber: "LA-490",
    foundAt: "Terminal 1, Coffee Shop",
    date: "June 10, 2025",
    description: "HP laptop in blue case, no stickers",
    status: "Available for pickup",
    matchPercentage: 62,
  },
];

export default function ReportLost() {
  const router = useRouter(); // ⬅️ added
  const DASHBOARD_URL = "https://app.foundlyhq.com/institution/dashboard"; // ⬅️ added

  const [currentStep, setCurrentStep] = useState<"select-institution" | "report-details" | "found-matches" | "success">(
    "select-institution",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstitutionName, setSelectedInstitutionName] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [foundItems, setFoundItems] = useState<FoundItem[]>(initialFoundItems);

  const generateReferenceId = () => {
    const institutionCode = selectedInstitutionName.includes("LAX") ? "LAX" : "USA";
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    return `USA-${institutionCode}-${randomNum}`;
  };

  const handleInstitutionSelect = (institutionId: string) => {
    const institution = institutions.find((inst) => inst.id === institutionId);
    setSelectedInstitutionName(institution?.name || "");
    setCurrentStep("report-details");
  };

  const handleBack = () => {
    // ⬇️ NEW: if user is on the first step, redirect to institution dashboard
    if (currentStep === "select-institution") {
      router.push(DASHBOARD_URL);
      return;
    }
    if (currentStep === "found-matches") {
      setCurrentStep("report-details");
    } else if (currentStep === "report-details") {
      setCurrentStep("select-institution");
    }
  };

  const handleClaimItem = (itemNumber: string) => {
    console.log("Claiming item:", itemNumber);
    setReferenceId(generateReferenceId());
    setCurrentStep("success");
  };

  const handleNotMyItem = (itemNumber: string) => {
    console.log("Not my item:", itemNumber);
    setFoundItems((prev) => {
      const updated = prev.filter((item) => item.itemNumber !== itemNumber);
      if (updated.length === 0) {
        setReferenceId(generateReferenceId());
        setCurrentStep("success");
      }
      return updated;
    });
  };

  const handleTrackReport = () => {
    console.log("Tracking report:", referenceId);
    // Handle track report logic
  };

  const handleReportAnother = () => {
    setSelectedInstitutionName("");
    setReferenceId("");
    setFoundItems(initialFoundItems);
    setCurrentStep("select-institution");
  };

  const handleBackToWebsite = () => {
    window.location.href = "https://foundlyhq.com";
  };

  const ResponsiveWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen w-full flex items-center justify-center px-2 sm:px-4 md:px-8 py-4 bg-gray-50">
      <div className="w-full max-w-screen-sm sm:max-w-screen-md md:max-w-[900px] lg:max-w-[1100px]">{children}</div>
    </div>
  );

  if (currentStep === "select-institution") {
    return (
      <ResponsiveWrapper>
        <InstitutionSelect
          institutions={institutions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelect={handleInstitutionSelect}
          onBack={handleBack} 
        />
      </ResponsiveWrapper>
    );
  }

  if (currentStep === "report-details") {
    // Example: AI/Backend integration for matching
    // const handleReportSubmit = async (data) => {
    //   // Send report details to backend/AI API
    //   const response = await fetch('/api/found-items', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    //   });
    //   if (!response.ok) {
    //     // handle error
    //     return;
    //   }
    //   const matches = await response.json(); // Expecting array of found items with matchPercentage, etc.
    //   setFoundItems(matches);
    //   setCurrentStep("found-matches");
    // };

    return (
      <ResponsiveWrapper>
        <ReportDetailsForm
          categories={categories}
          onBack={handleBack}
          // onSubmit={handleReportSubmit} // Uncomment to enable backend/AI integration
          onSubmit={() => {
            setCurrentStep("found-matches");
          }}
        />
      </ResponsiveWrapper>
    );
  }

  if (currentStep === "found-matches") {
    return (
      <ResponsiveWrapper>
        <FoundMatchesList
          foundItems={foundItems}
          onBack={handleBack}
          onClaim={handleClaimItem}
          onReject={handleNotMyItem}
        />
      </ResponsiveWrapper>
    );
  }

  if (currentStep === "success") {
    return (
      <ResponsiveWrapper>
        <SuccessScreen
          referenceId={referenceId}
          onTrackReport={handleTrackReport}
          onReportAnother={handleReportAnother}
          onBackToWebsite={handleBackToWebsite}
        />
      </ResponsiveWrapper>
    );
  }

  return (
    <ResponsiveWrapper>
      <SuccessScreen
        referenceId={referenceId}
        onTrackReport={handleTrackReport}
        onReportAnother={handleReportAnother}
        onBackToWebsite={handleBackToWebsite}
      />
    </ResponsiveWrapper>
  );
}
