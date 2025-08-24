import { UserButton, UserProfile, OrganizationList } from "@clerk/nextjs";

const RandomPage = () => {
  return (
    <div className="h-screen w-full  flex flex-col items-center space-y-8 justify-center">
      <UserButton />
      <div className="flex flex-col lg:flex-row justify-between w-full max-w-7xl gap-20 ">
        <OrganizationList />
        <UserProfile />
      </div>
    </div>
  );
};

export default RandomPage;
