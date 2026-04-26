import React from 'react'
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import { industries } from '../../../../data/industries';
import OnboardingForm from './_components/onboarding-form';
const Onboarding = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  if(isOnboarded){
    redirect('/dashboard')
  }
  return (
    <div>
      <OnboardingForm industries={industries}/>
    </div>
  )
}

export default Onboarding
