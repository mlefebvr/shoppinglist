import { useState, useRef, useEffect } from 'react'
import {
  Alert,
  Navbar,
  Form,
  Container,
  Row,
  Col,
  Button,
} from 'react-bootstrap'
import _ from 'lodash'
import moment from 'moment'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [shoppingListItems, setShoppingListItems] = useState([])
  const [errorMessage, setErrorMessage] = useState(false)
  const refItemName = useRef()

  const handleSubmit = (event) => {
    event.preventDefault()
    setErrorMessage(false)
    const itemName = refItemName.current.value
    console.log(_.isNumber(itemName))
    if (!_.isNumber(itemName)) {
      if (!shoppingListItems.includes(refItemName.current.value)) {
        setShoppingListItems((prevShoppingListItems) => [
          ...prevShoppingListItems,
          { itemName, bought: false, added: new Date() },
        ])
        refItemName.current.value = ''
      } else {
        setErrorMessage(`Item ${itemName} is already on the list`)
      }
    } else {
      setErrorMessage('Item name cannot be a number')
    }
  }

  const handleItemBought = (itemName) => {
    const boughtItem = shoppingListItems.find(
      (item) => item.itemName === itemName
    )
    boughtItem.bought = !boughtItem.bought
    const newShoppingListItems = shoppingListItems.filter(
      (item) => item.itemName !== itemName
    )
    setShoppingListItems([...newShoppingListItems, boughtItem])
  }

  const handleClearShoppingList = (event) => {
    event.preventDefault()
    setShoppingListItems([])
  }

  const handleRemoveBoughtItems = (event) => {
    event.preventDefault()
    const newShoppingListItems = shoppingListItems.filter(
      (item) => !item.bought
    )
    setShoppingListItems(newShoppingListItems)
  }

  useEffect(() => {
    // On load, get shopping list from local storage
    const shoppingListItems = localStorage.getItem('shoppinglist-app')
    if (shoppingListItems) setShoppingListItems(JSON.parse(shoppingListItems))
  }, [])

  useEffect(() => {
    // When shopping list is updated, save it to local storage
    localStorage.setItem('shoppinglist-app', JSON.stringify(shoppingListItems))
  }, [shoppingListItems])

  return (
    <div className='App'>
      <Navbar bg='primary' variant='dark' expand='lg'>
        <Container fluid>
          <Row className='w-100'>
            <Col xs={3} md={2}>
              <Navbar.Brand href='#home'>ShoppingList</Navbar.Brand>
            </Col>
            <Col xs={9} md={10}>
              <Form onSubmit={handleSubmit} className='w-100'>
                <Form.Control
                  type='text'
                  placeholder='Search/Add item'
                  ref={refItemName}
                />
              </Form>
            </Col>
          </Row>
        </Container>
      </Navbar>

      <Container>
        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
        {shoppingListItems.length === 0 ? (
          <Alert variant='warning' className='my-1'>
            Shopping List is empty
          </Alert>
        ) : (
          ''
        )}
        {shoppingListItems.map((item, index) => (
          <Alert
            className='my-1'
            variant='primary'
            key={index}
            dismissible
            onClose={() => handleItemBought(item.itemName)}
          >
            {item.bought ? (
              <span>
                <del>{item.itemName}</del> (Added:{' '}
                {moment(item.added).format('YYYY-MM-DD HH:mm:ss')})
              </span>
            ) : (
              <span>
                {item.itemName} (Added:{' '}
                {moment(item.added).format('YYYY-MM-DD HH:mm:ss')})
              </span>
            )}
          </Alert>
        ))}
        <Button className='mr-1' onClick={handleClearShoppingList}>
          Clear shopping list
        </Button>
        <Button onClick={handleRemoveBoughtItems}>Remove bought items</Button>
      </Container>
    </div>
  )
}

export default App
