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
import moment from 'moment'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function ShoppingList() {
  const [shoppingListItems, setShoppingListItems] = useState([])
  const [errorMessage, setErrorMessage] = useState(false)
  const refItemName = useRef()

  const handleSubmit = (event) => {
    event.preventDefault()
    setErrorMessage(false)
    const itemName = refItemName.current.value
    if (isNaN(itemName))
      if (!shoppingListItems.includes(refItemName.current.value)) {
        setShoppingListItems((prevShoppingListItems) => [
          ...prevShoppingListItems,
          { itemName, bought: false, added: new Date() },
        ])
        refItemName.current.value = ''
      } else {
        setErrorMessage(`Item ${itemName} is already on the list`)
      }

    if (!isNaN(itemName)) setErrorMessage('Item name cannot be a number')
  }

  const handleItemBought = (itemName) => {
    const boughtItem = shoppingListItems.find(
      (item) => item.itemName === itemName
    )
    boughtItem.bought = !boughtItem.bought ? new Date() : boughtItem.bought
    const newShoppingListItems = shoppingListItems.filter(
      (item) => item.itemName !== itemName
    )
    setShoppingListItems([...newShoppingListItems, boughtItem])
  }
  const handleItemNeeded = (itemName) => {
    const boughtItem = shoppingListItems.find(
      (item) => item.itemName === itemName
    )
    boughtItem.bought = !boughtItem.bought
    boughtItem.added = new Date()
    const newShoppingListItems = shoppingListItems.filter(
      (item) => item.itemName !== itemName
    )
    setShoppingListItems([...newShoppingListItems, boughtItem])
  }

  const handleClearShoppingList = (event) => {
    event.preventDefault()
    setShoppingListItems([])
  }

  const handleRemoveItem = (itemName) => {
    const newShoppingListItems = shoppingListItems.filter(
      (item) => item.itemName !== itemName
    )
    setShoppingListItems(newShoppingListItems)
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
    const items = localStorage.getItem('shoppinglist-app-items')
    if (items) setShoppingListItems(JSON.parse(items))
  }, [])

  useEffect(() => {
    // When shopping list is updated, save it to local storage
    localStorage.setItem(
      'shoppinglist-app-items',
      JSON.stringify(shoppingListItems)
    )
  }, [shoppingListItems])

  return (
    <div className='App'>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          <Row className='w-100'>
            <Form onSubmit={handleSubmit} className='w-100' inline>
              <Col xs={3} md={2}>
                <Navbar.Brand href='#home'>ShoppingList</Navbar.Brand>
              </Col>
              <Col xs={8} md={9}>
                <Form.Control
                  className='w-100'
                  type='text'
                  placeholder='Search/Add item'
                  ref={refItemName}
                  required
                />
              </Col>
              <Col xs={1}>
                <Button className='w-100' type='submit'>
                  Submit
                </Button>
              </Col>
            </Form>
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
            variant={item.bought ? 'success' : 'primary'}
            key={index}
            dismissible
            onClose={() => handleRemoveItem(item.itemName)}
          >
            <Container>
              <Row className='align-items-center'>
                <Col xs={10}>
                  {item.bought ? (
                    <>
                      <del>{item.itemName}</del> (Bought:{' '}
                      {moment(item.bought).format('YYYY-MM-DD HH:mm:ss')})
                    </>
                  ) : (
                    <>
                      {item.itemName} (Added:{' '}
                      {moment(item.added).format('YYYY-MM-DD HH:mm:ss')})
                    </>
                  )}
                </Col>
                <Col xs={2}>
                  {item.bought ? (
                    <Button
                      onClick={() => handleItemNeeded(item.itemName)}
                      className='my-0'
                      variant='success'
                    >
                      Need it
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleItemBought(item.itemName)}
                      className='my-0'
                      variant='primary'
                    >
                      Bought it
                    </Button>
                  )}
                </Col>
              </Row>
            </Container>
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

export default ShoppingList
