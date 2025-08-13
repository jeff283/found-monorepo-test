import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import type { StaticImageData } from "next/image";

interface Institution {
  id: string;
  name: string;
  address: string;
  logo: string | StaticImageData;
}

interface InstitutionSelectProps {
  institutions: Institution[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelect: (institutionId: string) => void;
  onBack?: () => void; // ⬅️ added
}

export default function InstitutionSelect({
  institutions,
  searchQuery,
  setSearchQuery,
  onSelect,
  onBack, // ⬅️ added
}: InstitutionSelectProps) {
  const filteredInstitutions = institutions.filter(
    (institution) =>
      institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-2 sm:px-4 md:px-8 py-4">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-screen-sm sm:max-w-screen-md md:max-w-[900px] lg:max-w-[1100px] p-4 sm:p-6 md:p-10 lg:p-14 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onBack}            // ⬅️ added
            aria-label="Go back"        // (nice for a11y)
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-base sm:text-lg font-medium">Report lost</span>
        </div>

        {/* Title and Description */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Report lost</h1>
          <p className="text-gray-500 text-sm sm:text-base">Select an institution where you lost your stuff</p>
        </div>

        {/* Search + Grid Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 sm:p-4 md:p-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search institutions"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
              autoComplete="off"
              spellCheck={false}
              inputMode="text"
            />
          </div>

          {/* Institution Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredInstitutions.map((institution) => (
              <button
                key={institution.id}
                onClick={() => onSelect(institution.id)}
                className="w-full h-[78px] p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center gap-3 text-left hover:shadow-md transition"
              >
                <div className="w-10 h-10 sm:w-[43px] sm:h-[43px] rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={institution.logo || "/placeholder.svg"}
                    alt={institution.name}
                    fill
                    style={{ objectFit: "cover", borderRadius: 12, opacity: 1 }}
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 leading-tight">{institution.name}</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500">{institution.address}</p>
                </div>
              </button>
            ))}
          </div>

          {/* No Result Message */}
          {filteredInstitutions.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-500">No institutions found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
