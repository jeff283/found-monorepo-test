import { Grid, Bell, ShieldCheck, MessageCircle, Eye, Zap } from "lucide-react";
import FoundlyButton from "./FoundlyButton";

export default function FoundlyActionCTA() {
  const features = [
    {
      icon: <Grid className="text-primary w-7 h-7" />,
      title: "Smart Dashboards",
    },
    {
      icon: <Bell className="text-primary w-7 h-7" />,
      title: "Real-Time Notifications",
    },
    {
      icon: <ShieldCheck className="text-primary w-7 h-7" />,
      title: "Secure Claim Verification",
    },
    {
      icon: <MessageCircle className="text-primary w-7 h-7" />,
      title: "In-App Messaging",
    },
    {
      icon: <Eye className="text-primary w-7 h-7" />,
      title: "End-to-End Visibility",
    },
    {
      icon: <Zap className="text-primary w-7 h-7" />,
      title: "Fast Item Resolution",
    },
    // {
    //   icon: <Globe className="text-primary w-7 h-7" />,
    //   title: 'Sector-Agnostic Design'
    // }
  ];

  return (
    <section className="relative bg-background text-secondary py-20 px-4 md:px-8 rounded-3xl mx-6 overflow-hidden">
      <div className="hidden md:block absolute left-0 top-1/8 h-3/4 w-[clamp(80px,7vw,220px)] bg-white/10 pointer-events-none z-10 rounded-r-3xl transition-all duration-300" />
      <div className="hidden md:block absolute right-0 top-1/8 h-3/4 w-[clamp(80px,7vw,220px)] bg-white/10 pointer-events-none z-10 rounded-l-3xl transition-all duration-300" />
      <div className="flex relative z-20">
        <div className="max-w-6xl w-full mx-auto">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="headline-1 mb-6 text-center font-bold">
              Ready to simplify your lost &amp; found operations?
            </h2>
            <p className="body-1 text-secondary/80 mb-10 max-w-xl text-center">
              Experience how Foundly helps teams log, match, and recover items
              faster — with full visibility and control.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gap-y-12 w-full mb-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center h-full gap-4"
                >
                  <div className="bg-blue-50 rounded-xl flex items-center justify-center p-3">
                    {feature.icon}
                  </div>
                  <h3 className="headline-3 text-secondary text-left mb-0">
                    {feature.title.split(" ")[0]}
                    <span className="block">
                      {feature.title.split(" ").slice(1).join(" ")}
                    </span>
                  </h3>
                </div>
              ))}
            </div>
            <FoundlyButton
              text="Join Our Waitlist"
              href="#waitlist"
              className="px-8 py-3"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
