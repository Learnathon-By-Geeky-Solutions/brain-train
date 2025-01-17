import { Flex, IconButton } from '@chakra-ui/react';
import { MdHealthAndSafety, MdShoppingCart } from 'react-icons/md';
import './Toolbar.css';

export default function Toolbar({click}) {
    return (
        <Flex direction="row" alignItems="center" bg="none" placeContent="center">
            <IconButton aria-label="ingredient" sz="sm" className="toolbar" onClick={click[0]}>
            {/* onClick={click[0]} */}
                <Flex direction="row" alignItems="center" padding="5px">
                    <MdShoppingCart />
                    Search by ingredient
                </Flex>
            </IconButton>
            <IconButton aria-label="ingredient" className="toolbar" sz="sm">
            <Flex direction="row" alignItems="center" padding="5px">
                <MdHealthAndSafety />
                Search by nutritions
            </Flex>
            </IconButton>
            <IconButton aria-label="ingredient" sz="sm" className="toolbar">
                <Flex direction="row" alignItems="center" padding="5px">
                    <MdShoppingCart />
                    Search by ingredient
                </Flex>
            </IconButton>
        </Flex>
    )
}