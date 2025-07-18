import React, { useState } from 'react'
import type { Route } from "./+types/home";
import { AuthModal } from '../../src/components/auth/AuthModal'
import { LandingPage } from '../../src/components/landing/LandingPage'

export function meta(_: Route.MetaArgs) {
  return [
    { title: "RENTAGAIN - Professional Fleet Management" },
    { name: "description", content: "Professional fleet management for rental companies. Streamline operations, track vehicles, manage maintenance, and grow your business." },
  ];
}

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleSignIn = () => {
    setAuthMode('signin')
    setIsAuthModalOpen(true)
  }

  const handleSignUp = () => {
    setAuthMode('signup')
    setIsAuthModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <>
      <LandingPage onSignIn={handleSignIn} onSignUp={handleSignUp} />
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={handleCloseModal}
        defaultMode={authMode}
      />
    </>
  )
}
