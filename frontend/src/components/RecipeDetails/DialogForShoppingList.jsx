import { Button, Dialog, Portal, NumberInput, Flex } from "@chakra-ui/react"
import { CloseButton } from "../ui/close-button"
import PropTypes from 'prop-types'

const DialogForShoppingList = ({handleDone,setServingSize,servingSize}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button size="md" variant="outline">
          Generate Shopping List
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Flex justify="space-between" align="center">
                <Dialog.Title>Serving Size</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
            <NumberInput.Root
              value={servingSize}
              onValueChange={(e) => setServingSize(e.value)}
              size="lg"
              step={1}
              textEmphasis="none"
            >
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              <NumberInput.Input/>
            </NumberInput.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleDone}>Done</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
DialogForShoppingList.propTypes = {
  handleDone: PropTypes.func.isRequired,
  setServingSize: PropTypes.func.isRequired,
  servingSize: PropTypes.number.isRequired,
}


export default DialogForShoppingList
