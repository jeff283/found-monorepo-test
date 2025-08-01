"use client"

import { useState } from "react"
import type { StaticImageData } from "next/image"
import laxLogo from "@/assets/images/logos/Institution Logos/Los Angeles International Airport (LAX).jpeg"
import uclaLogo from "@/assets/images/logos/Institution Logos/University of California.png"
import westfieldLogo from "@/assets/images/logos/Institution Logos/Westfield Century City Mall.png"
import jfkLogo from "@/assets/images/logos/Institution Logos/John F. Kennedy International Airport.png"
import harvardLogo from "@/assets/images/logos/Institution Logos/Harvard University.png"
import stanfordLogo from "@/assets/images/logos/Institution Logos/Stanford University.png"
import itemImg1 from "@/assets/images/logos/Items/pexels.jpg"
import itemImg2 from "@/assets/images/logos/Items/pexels-veeterzy-303383.jpg"
import itemImg3 from "@/assets/images/logos/Items/pexels-tracy-le-blanc-67789-607812.jpg"
import itemImg4 from "@/assets/images/logos/Items/pexels-chuck-3587478.jpg"
import InstitutionSelect from "@/components/report-lost/InstitutionSelect"
import ReportDetailsForm from "@/components/report-lost/ReportDetailsForm"
import FoundMatchesList from "@/components/report-lost/FoundMatchesList"
import SuccessScreen from "@/components/report-lost/SuccessScreen"

interface Institution {
  id: string
  name: string
  address: string
  logo: string | StaticImageData 
}

interface FoundItem {
  itemName: string
  itemNumber: string
  foundAt: string
  date: string
  description: string
  status: string
  image: StaticImageData
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
    image: itemImg1,
  },
  {
    itemName: "MacBook Pro 13-inch (Space Gray)",
    itemNumber: "LA-503",
    foundAt: "Terminal 3, Security Checkpoint",
    date: "June 16, 2025",
    description: "MacBook Pro 13-inch, space gray, small dent on corner",
    status: "Available for pickup",
    image: itemImg2,
  },
  {
    itemName: "Apple Laptop (Black Case)",
    itemNumber: "LA-498",
    foundAt: "Gate 42, Waiting Area",
    date: "June 15, 2025",
    description: "Apple laptop with black case, charging cable attached",
    status: "On hold at LAX Lost & Found",
    image: itemImg3,
  },
  {
    itemName: "Silver MacBook (Stickers)",
    itemNumber: "LA-495",
    foundAt: "Baggage Claim Area 4",
    date: "June 14, 2025",
    description: "Silver MacBook with university stickers, slightly used",
    status: "Available for pickup",
    image: itemImg4,
  },
]


// async function claimItem(itemNumber: string, referenceId: string) {
//   const res = await fetch('/api/claim-item', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ itemNumber, referenceId }),
//   });
//   if (!res.ok) throw new Error('Failed to claim item');
//   return res.json();
// }

// async function rejectItem(itemNumber: string, referenceId: string) {
//   const res = await fetch('/api/reject-item', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ itemNumber, referenceId }),
//   });
//   if (!res.ok) throw new Error('Failed to reject item');
//   return res.json();
// }

export default function ReportLost() {
  const [currentStep, setCurrentStep] = useState<"select-institution" | "report-details" | "found-matches" | "success">(
    "select-institution",
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInstitutionName, setSelectedInstitutionName] = useState("")
  const [referenceId, setReferenceId] = useState("")
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    dateLost: "",
    locationLastSeen: "",
    location: "",
    detailedDescription: "",
  })
  const [foundItems, setFoundItems] = useState<FoundItem[]>(initialFoundItems)


  const generateReferenceId = () => {
    const institutionCode = selectedInstitutionName.includes("LAX") ? "LAX" : "USA"
    const randomNum = Math.floor(Math.random() * 90000) + 10000
    return `USA-${institutionCode}-${randomNum}`
  }

  const handleInstitutionSelect = (institutionId: string) => {
    const institution = institutions.find((inst) => inst.id === institutionId)
    setSelectedInstitutionName(institution?.name || "")
    setCurrentStep("report-details")
  }

  const handleBack = () => {
    if (currentStep === "found-matches") {
      setCurrentStep("report-details")
    } else if (currentStep === "report-details") {
      setCurrentStep("select-institution")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    console.log("Submitting report:", {
      institution: selectedInstitutionName,
      ...formData,
    })
    // Simulate finding matches and move to next step
    setCurrentStep("found-matches")
  }

  const handleClaimItem = (itemNumber: string) => {
    console.log("Claiming item:", itemNumber)
    // Generate reference ID and go to success screen
    setReferenceId(generateReferenceId())
    setCurrentStep("success")
  }

  const handleNotMyItem = (itemNumber: string) => {
    console.log("Not my item:", itemNumber)
    setFoundItems((prev) => {
      const updated = prev.filter((item) => item.itemNumber !== itemNumber)
      if (updated.length === 0) {
        setReferenceId(generateReferenceId())
        setCurrentStep("success")
      }
      return updated
    })
  }

  const handleTrackReport = () => {
    console.log("Tracking report:", referenceId)
    // Handle track report logic
  }

  const handleReportAnother = () => {
    // Reset form and go back to step 1
    setFormData({
      itemName: "",
      category: "",
      dateLost: "",
      locationLastSeen: "",
      location: "",
      detailedDescription: "",
    })
    setSelectedInstitutionName("")
    setReferenceId("")
    setFoundItems(initialFoundItems)
    setCurrentStep("select-institution")
  }

const handleBackToWebsite = () => {
  window.location.href = "https://foundlyhq.com";
}

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
        />
      </ResponsiveWrapper>
    );
  }

  if (currentStep === "report-details") {
    return (
      <ResponsiveWrapper>
        <ReportDetailsForm
          formData={formData}
          categories={categories}
          onInputChange={handleInputChange}
          onBack={handleBack}
          onSubmit={handleSubmit}
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
}
