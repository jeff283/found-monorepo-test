import { UserButton, UserProfile } from '@clerk/nextjs'

const RandomPage = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <UserButton/>
      <UserProfile />
    </div>
  )
}

export default RandomPage