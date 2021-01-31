import { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import ShoppingList from './ShoppingList'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [shoppingListProfile, setShoppingListProfile] = useState({})

  useEffect(() => {
    const profile = localStorage.getItem('shoppinglist-app')
    if (profile) setShoppingListProfile(JSON.parse(profile))
  }, [])

  useEffect(() => console.log(shoppingListProfile), [shoppingListProfile])

  if (!shoppingListProfile || !shoppingListProfile.isLoggedIn)
    return <Alert variant='danger'>You are not logged in</Alert>
  return <ShoppingList />
}

export default App
