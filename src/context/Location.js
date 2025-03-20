import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

export const LocationContext = createContext()

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null)
  const [country, setCountry] = useState('IN')
  const [cities, setCities] = useState([])
  const [loadingCountry, setLoadingCountry] = useState(true)
  const [errorCountry, setErrorCountry] = useState('')

  useEffect(() => {
    const getActiveLocation = async () => {
      try {
        const locationStr = await AsyncStorage.getItem('location')
        if (locationStr) {
          setLocation(JSON.parse(locationStr))
        }
      } catch (err) {
        console.log(err)
      }
    }

    getActiveLocation()
  }, [])

  useEffect(() => {
    if (location) {
      const saveLocation = async () => {
        await AsyncStorage.setItem('location', JSON.stringify(location))
      }

      saveLocation()
    }
  }, [location])

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await axios.get('https://api.ipify.org/?format=json')
        const data = response.data

        const ipResponse = await axios.get(`https://ipinfo.io/${data.ip}/json`)
        const countryName = ipResponse.data.country // missing 'US'
        setCountry(countryName)
      } catch (error) {
        setErrorCountry(error.message)
        console.error('Error fetching user location:', error)
      } finally {
        setLoadingCountry(false)
      }
    }
    fetchCountry()
  }, [])

 
  useEffect(() => {
    const fetchCities = async () => {
      if (country) {
        try {
          // Example of another REST API to fetch cities by country code (change this API to your desired source)
          const citiesResponse = await axios.get(`https://api.example.com/cities/${country}`)
          setCities(citiesResponse.data || [])
        } catch (error) {
          console.error('Error fetching cities:', error)
        }
      }
    }

    if (country && !loadingCountry) {
      fetchCities()
    }
  }, [country, loadingCountry])

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        cities
      }}>
      {children}
    </LocationContext.Provider>
  )
}
