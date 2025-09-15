import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'member'
  membershipStatus: 'active' | 'inactive' | 'pending'
  joinDate: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('barometerban_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Mock authentication - replace with real API
    if (email === 'admin@barometerban.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        email: 'admin@barometerban.com',
        name: 'Admin User',
        role: 'admin',
        membershipStatus: 'active',
        joinDate: new Date().toISOString()
      }
      setUser(adminUser)
      localStorage.setItem('barometerban_user', JSON.stringify(adminUser))
      setIsLoading(false)
      return true
    }
    
    if (email && password) {
      const memberUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'member',
        membershipStatus: 'active',
        joinDate: new Date().toISOString()
      }
      setUser(memberUser)
      localStorage.setItem('barometerban_user', JSON.stringify(memberUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Mock registration - replace with real API
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'member',
      membershipStatus: 'pending',
      joinDate: new Date().toISOString()
    }
    
    setUser(newUser)
    localStorage.setItem('barometerban_user', JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('barometerban_user')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
